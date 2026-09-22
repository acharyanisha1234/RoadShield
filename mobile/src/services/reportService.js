import api from './api';

export const reportService = {
  async create(formData) {
    const res = await api.post('/reports', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  async getAll(params = {}) {
    const res = await api.get('/reports', { params });
    return res.data;
  },

  async getOne(id) {
    const res = await api.get(`/reports/${id}`);
    return res.data;
  },

  async getNearby(lat, lng, radius = 5) {
    const res = await api.get('/reports/nearby', {
      params: { lat, lng, radius },
    });
    return res.data;
  },

  async updateStatus(id, status) {
    const res = await api.patch(`/reports/${id}/status`, { status });
    return res.data;
  },

  async upvote(id) {
    const res = await api.patch(`/reports/${id}/upvote`);
    return res.data;
  },
};