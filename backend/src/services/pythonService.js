/**
 * Python AI Service Client
 * Handles all communication with the FastAPI AI service
 */

const axios = require('axios');
const FormData = require('form-data');

const PYTHON_API = process.env.PYTHON_API_URL || 'http://localhost:8000';
const AI_ENABLED = process.env.AI_ENABLED !== 'false';
const AI_TIMEOUT = parseInt(process.env.AI_TIMEOUT_MS || '30000', 10);

/**
 * Axios instance with timeout
 */
const aiClient = axios.create({
  baseURL: PYTHON_API,
  timeout: AI_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Health check — is AI service up?
 */
const isAiHealthy = async () => {
  if (!AI_ENABLED) return false;

  try {
    const { data } = await aiClient.get('/ai/health', { timeout: 5000 });
    return data?.status === 'healthy';
  } catch (error) {
    console.warn('[PythonService] AI service unreachable:', error.message);
    return false;
  }
};

/**
 * Detect accident from image buffer
 * @param {Buffer} imageBuffer - Raw image bytes
 * @param {string} filename - Original filename
 * @returns {Promise<Object|null>} Detection result or null if failed
 */
const detectAccident = async (imageBuffer, filename = 'upload.jpg') => {
  if (!AI_ENABLED) {
    console.log('[PythonService] AI disabled, skipping detection');
    return null;
  }

  try {
    const form = new FormData();
    form.append('file', imageBuffer, {
      filename,
      contentType: 'image/jpeg',
    });

    const { data } = await aiClient.post('/ai/detect', form, {
      headers: form.getHeaders(),
    });

    if (data?.success && data?.result) {
      console.log(
        `[PythonService] Detection: accident=${data.result.accident_detected}, ` +
          `confidence=${data.result.confidence}, severity=${data.result.severity}`
      );
      return data.result;
    }

    return null;
  } catch (error) {
    console.error('[PythonService] Detection failed:', error.message);
    return null;
  }
};

/**
 * Predict severity from features
 * @param {Object} features - { red_ratio, edge_density, ... }
 */
const predictSeverity = async (features) => {
  if (!AI_ENABLED) return null;

  try {
    const { data } = await aiClient.post('/ai/predict', features);

    if (data?.success && data?.prediction) {
      return data.prediction;
    }

    return null;
  } catch (error) {
    console.error('[PythonService] Prediction failed:', error.message);
    return null;
  }
};

/**
 * Find accident hotspots from reports
 * @param {Array} reports - Array of report objects
 */
const findHotspots = async (reports, epsKm = 0.5, minSamples = 3) => {
  if (!AI_ENABLED || !reports || reports.length === 0) {
    return null;
  }

  try {
    const payload = {
      reports: reports.map((r) => ({
        location: r.location,
        severity: r.severity,
        type: r.type,
        status: r.status,
      })),
      eps_km: epsKm,
      min_samples: minSamples,
    };

    const { data } = await aiClient.post('/ai/analytics/hotspots', payload);

    if (data?.success) {
      console.log(`[PythonService] Found ${data.count} hotspots`);
      return data.hotspots;
    }

    return null;
  } catch (error) {
    console.error('[PythonService] Hotspot analysis failed:', error.message);
    return null;
  }
};

/**
 * Compute statistics from reports
 */
const computeStats = async (reports) => {
  if (!AI_ENABLED || !reports || reports.length === 0) {
    return null;
  }

  try {
    const payload = {
      reports: reports.map((r) => ({
        location: r.location,
        severity: r.severity,
        type: r.type,
        status: r.status,
      })),
    };

    const { data } = await aiClient.post('/ai/analytics/stats', payload);

    return data?.success ? data.stats : null;
  } catch (error) {
    console.error('[PythonService] Stats failed:', error.message);
    return null;
  }
};

module.exports = {
  isAiHealthy,
  detectAccident,
  predictSeverity,
  findHotspots,
  computeStats,
};