const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const PYTHON_API = process.env.PYTHON_API_URL || 'http://localhost:8000';

exports.detectAccident = async (imageBuffer, filename) => {
  try {
    const form = new FormData();
    form.append('file', imageBuffer, { filename });
    const { data } = await axios.post(`${PYTHON_API}/ai/detect`, form, {
      headers: form.getHeaders(),
      timeout: 30000,
    });
    return data;
  } catch (error) {
    console.error('[PythonService] Detection failed:', error.message);
    return null;
  }
};

exports.predictSeverity = async (features) => {
  try {
    const { data } = await axios.post(`${PYTHON_API}/ai/predict`, features, {
      timeout: 15000,
    });
    return data;
  } catch (error) {
    console.error('[PythonService] Prediction failed:', error.message);
    return null;
  }
};

exports.findHotspots = async (reports) => {
  try {
    const { data } = await axios.post(
      `${PYTHON_API}/ai/analytics/hotspots`,
      { reports, eps_km: 0.5, min_samples: 3 },
      { timeout: 20000 }
    );
    return data;
  } catch (error) {
    console.error('[PythonService] Hotspots failed:', error.message);
    return null;
  }
};