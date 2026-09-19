import { useState, useCallback } from 'react';
import { reportService } from '../services/reportService';
import Toast from 'react-native-toast-message';

export function useReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getAll(params);
      setReports(res.data);
      return res.data;
    } catch (err) {
      setError(err.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to load reports',
        text2: err.response?.data?.message || err.message,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchNearby = useCallback(async (lat, lng, radius = 5) => {
    setLoading(true);
    try {
      const res = await reportService.getNearby(lat, lng, radius);
      setReports(res.data);
      return res.data;
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Failed to load nearby reports',
        text2: err.message,
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addReport = useCallback((report) => {
    setReports((prev) => [report, ...prev]);
  }, []);

  return { reports, loading, error, fetchReports, fetchNearby, addReport };
}