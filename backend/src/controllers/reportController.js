const Report = require('../models/Report');
const { emitNewReport, emitReportUpdate } = require('../sockets/socketHandler');
const pythonService = require('../services/pythonService');

// @desc Create a report with AI analysis
// @route POST /api/reports
exports.createReport = async (req, res, next) => {
  try {
    const { title, description, type, severity, latitude, longitude, address } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Location (latitude & longitude) is required',
      });
    }

    // Prepare image
    const images = [];
    let imageBuffer = null;
    let imageFilename = null;

    if (req.file) {
      imageBuffer = req.file.buffer;
      imageFilename = req.file.originalname || `report-${Date.now()}.jpg`;

      images.push({
        url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        publicId: null,
      });
    }

    //  AI ANALYSIS (only if image present)
    let aiAnalysis = {
      analyzed: false,
    };

    if (imageBuffer && process.env.AI_ENABLED !== 'false') {
      try {
        console.log('[ReportController] Running AI analysis...');

        const detection = await pythonService.detectAccident(
          imageBuffer,
          imageFilename
        );

        if (detection) {
          aiAnalysis = {
            analyzed: true,
            analyzedAt: new Date(),
            accidentDetected: detection.accident_detected,
            confidence: detection.confidence,
            predictedSeverity: detection.severity,
            features: detection.features,
            indicators: detection.indicators || [],
            reasoning: [],
          };

          console.log(
            `[ReportController] AI: accident=${detection.accident_detected}, ` +
              `severity=${detection.severity}, confidence=${detection.confidence}`
          );
        }
      } catch (aiError) {
        console.error('[ReportController] AI analysis failed:', aiError.message);
        // Continue without AI — graceful degradation
      }
    }

    // Determine final severity: AI > user input > default
    const finalSeverity =
      aiAnalysis.predictedSeverity || severity || 'medium';

    // Create report
    const report = await Report.create({
      user: req.user._id,
      title: title || `${type} reported`,
      description,
      type: type || 'accident',
      severity: finalSeverity,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
      images,
      aiAnalysis,
    });

    await report.populate('user', 'name email');

    //  REAL-TIME BROADCAST
    const io = req.app.get('io');
    if (io) {
      emitNewReport(io, report);
      console.log(`[Socket] New report broadcasted: ${report.title}`);
    }

    res.status(201).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc Get all reports
// @route GET /api/reports
exports.getReports = async (req, res, next) => {
  try {
    const { severity, status, type, limit = 100 } = req.query;

    const filter = {};
    if (severity) filter.severity = severity;
    if (status) filter.status = status;
    if (type) filter.type = type;

    const reports = await Report.find(filter)
      .populate('user', 'name email')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc Get single report
// @route GET /api/reports/:id
exports.getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc Get nearby reports
// @route GET /api/reports/nearby
exports.getNearbyReports = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng query params required',
      });
    }

    const reports = await Report.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000,
        },
      },
    })
      .populate('user', 'name email')
      .limit(50);

    res.json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    next(error);
  }
};

// @desc Update report status
// @route PATCH /api/reports/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const io = req.app.get('io');
    if (io) {
      emitReportUpdate(io, report);
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc Upvote a report
// @route PATCH /api/reports/:id/upvote
exports.upvoteReport = async (req, res, next) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc Get AI hotspots
// @route GET /api/reports/analytics/hotspots
exports.getHotspots = async (req, res, next) => {
  try {
    const reports = await Report.find().select('location severity type status');

    const hotspots = await pythonService.findHotspots(
      reports.map((r) => r.toObject())
    );

    if (!hotspots) {
      return res.json({ success: true, count: 0, hotspots: [] });
    }

    res.json({ success: true, count: hotspots.length, hotspots });
  } catch (error) {
    next(error);
  }
};

// @desc Get AI statistics
// @route GET /api/reports/analytics/stats
exports.getStats = async (req, res, next) => {
  try {
    const reports = await Report.find().select('severity type status location');

    const stats = await pythonService.computeStats(
      reports.map((r) => r.toObject())
    );

    if (!stats) {
      return res.json({
        success: true,
        stats: {
          total: reports.length,
          by_severity: { low: 0, medium: 0, high: 0 },
          by_type: {},
          by_status: {},
        },
      });
    }

    res.json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};