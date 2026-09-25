const Report = require('../models/Report');
const { emitNewReport, emitReportUpdate } = require('../sockets/socketHandler');

// @desc Create a report
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

    const images = [];
    if (req.file) {
      images.push({
        url: `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
        publicId: null,
      });
    }

    const report = await Report.create({
      user: req.user._id,
      title: title || `${type} reported`,
      description,
      type: type || 'accident',
      severity: severity || 'medium',
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      address,
      images,
    });

    await report.populate('user', 'name email');

    //  EMIT REAL-TIME EVENT
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
    const report = await Report.findById(req.params.id).populate('user', 'name email');

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

// @desc Get nearby reports
// @route GET /api/reports/nearby?lat=..&lng=..&radius=5
exports.getNearbyReports = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in km

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
          $maxDistance: parseFloat(radius) * 1000, // meters
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

// @desc Update report status (admin/police)
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

    // EMIT UPDATE
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