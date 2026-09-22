import { formatDistanceToNow, format } from 'date-fns';

export const formatRelativeTime = (date) => {
  if (!date) return 'just now';
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  } catch {
    return 'unknown';
  }
};

export const formatDateTime = (date) => {
  if (!date) return '';
  try {
    return format(new Date(date), 'PPp');
  } catch {
    return '';
  }
};

export const formatCoordinates = (coordinates, precision = 4) => {
  if (!coordinates || coordinates.length < 2) return 'Unknown location';
  const [lng, lat] = coordinates;
  return `${lat.toFixed(precision)}, ${lng.toFixed(precision)}`;
};

export const truncate = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};