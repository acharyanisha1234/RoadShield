export const MAP_CONFIG = {
  LATITUDE_DELTA: 0.05,
  LONGITUDE_DELTA: 0.05,
  ANIMATION_DURATION: 500,
  REPORTS_FETCH_LIMIT: 100,
};

export const DARK_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0B0F1A' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748B' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0B0F1A' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#1C2333' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#141A28' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#131A24' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1C2333' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#232B3D' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#232B3D' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1C2333' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0F1421' }],
  },
];

export const SOS_CONFIG = {
  TIMEOUT_MS: 1500,
  SUCCESS_MESSAGE: 'Emergency alert sent to nearby authorities',
};