/**
 * Report-related constants
 * Used across report submission, listing, and detail screens
 */

export const INCIDENT_TYPES = [
  { key: 'accident', label: 'Accident', icon: 'car-sport', color: '#FF3B3B' },
  { key: 'pothole', label: 'Pothole', icon: 'ellipse', color: '#FFB800' },
  { key: 'roadwork', label: 'Roadwork', icon: 'construct', color: '#FF8C42' },
  { key: 'flood', label: 'Flood', icon: 'water', color: '#3B82F6' },
  { key: 'other', label: 'Other', icon: 'warning', color: '#94A3B8' },
];

export const SEVERITY_LEVELS = [
  { key: 'low', label: 'Low', color: '#00D26A' },
  { key: 'medium', label: 'Medium', color: '#FFB800' },
  { key: 'high', label: 'High', color: '#FF3B3B' },
];

export const REPORT_STATUS = {
  pending: { label: 'Pending', color: '#FFB800' },
  verified: { label: 'Verified', color: '#00D26A' },
  resolved: { label: 'Resolved', color: '#3B82F6' },
  rejected: { label: 'Rejected', color: '#64748B' },
};

export const REPORT_LIMITS = {
  TITLE_MAX: 120,
  DESCRIPTION_MAX: 1000,
  IMAGE_QUALITY: 0.6,
};

export const ALERT_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'high', label: 'High' },
  { key: 'medium', label: 'Medium' },
  { key: 'low', label: 'Low' },
];