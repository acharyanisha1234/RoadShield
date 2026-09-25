import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { useSocket } from './useSocket';

/**
 * Hook to continuously track and broadcast user location
 * Sends updates to server every 30 seconds
 */
export function useLocationTracking(enabled = true) {
  const { updateLocation, isConnected } = useSocket();
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (!enabled || !isConnected) return;

    let isMounted = true;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;

        // Initial location
        const initial = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          updateLocation(initial.coords.latitude, initial.coords.longitude);
        }

        // Watch for changes (every 30s or 100m)
        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 30000,
            distanceInterval: 100,
          },
          (loc) => {
            if (isMounted) {
              updateLocation(loc.coords.latitude, loc.coords.longitude);
            }
          }
        );
      } catch (error) {
        console.error('[LocationTracking] Error:', error);
      }
    };

    start();

    return () => {
      isMounted = false;
      subscriptionRef.current?.remove();
    };
  }, [enabled, isConnected, updateLocation]);
}