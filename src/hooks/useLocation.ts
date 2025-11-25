import { useState, useEffect, useCallback } from 'react';
import { locationManager, hapticFeedback } from '@tma.js/sdk-react';
import type { LocationData } from '@/types/location';

interface UseLocationResult {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  requestLocation: () => Promise<void>;
}

export function useLocation(): UseLocationResult {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Check support and mount on init
  useEffect(() => {
    const checkSupport = async () => {
      try {
        if (locationManager.mount.isAvailable()) {
          setIsSupported(true);
          await locationManager.mount();
          setIsMounted(true);
        } else {
          setIsSupported(false);
          setError('Location not supported in this Telegram version');
        }
      } catch (err) {
        setIsSupported(false);
        setError('Failed to initialize location manager');
      }
    };

    checkSupport();

    return () => {
      if (isMounted) {
        locationManager.unmount();
      }
    };
  }, []);

  const requestLocation = useCallback(async () => {
    if (!isSupported || !isMounted) {
      setError('Location manager not ready');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await locationManager.requestLocation();

      if (result) {
        setLocation({
          latitude: result.latitude,
          longitude: result.longitude,
          accuracy: result.horizontal_accuracy ?? undefined,
        });

        // Success haptic
        if (hapticFeedback.notificationOccurred.isAvailable()) {
          hapticFeedback.notificationOccurred('success');
        }
      } else {
        throw new Error('Location request denied or failed');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      setError(message);

      // Error haptic
      if (hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('error');
      }
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isMounted]);

  return {
    location,
    isLoading,
    error,
    isSupported,
    requestLocation,
  };
}
