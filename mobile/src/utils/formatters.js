import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format a date as relative time (e.g., "5 minutes ago")
 */
export const formatRelativeTime = (date) => {
  if (!date) return 'just now';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'unknown';
  }
};

/**
 * Format a date as absolute timestamp (e.g., "Sep 19, 2026 3:45 PM")
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'PPp');
  } catch {
    return '';
  }
};

/**
 * Format coordinates to readable string
 * @param {number[]} coordinates - [longitude, latitude]
 * @param {number} precision - Decimal precision (default: 4)
 */
export const formatCoordinates = (coordinates, precision = 4) => {
  if (!coordinates || coordinates.length < 2) return 'Unknown location';
  const [lng, lat] = coordinates;
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

/**
 * Truncate long text with ellipsis
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

/**
 * Get user initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};