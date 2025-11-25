import { FC, useEffect } from 'react';
import { Section, Cell, List, Button, Text } from '@telegram-apps/telegram-ui';
import { hapticFeedback } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';
import { WeatherCard } from '@/components/Location/WeatherCard';
import { LocationMap } from '@/components/Location/LocationMap';
import { useLocation } from '@/hooks/useLocation';
import { useWeather } from '@/hooks/useWeather';

export const LocationPage: FC = () => {
  const { location, isLoading: locationLoading, error: locationError, isSupported, requestLocation } = useLocation();
  const { weather, isLoading: weatherLoading, error: weatherError, refresh: refreshWeather } = useWeather(
    location?.latitude ?? null,
    location?.longitude ?? null
  );

  // Request location on mount if supported
  useEffect(() => {
    if (isSupported && !location && !locationLoading) {
      requestLocation();
    }
  }, [isSupported]);

  const handleRefresh = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
    requestLocation();
  };

  const handleRefreshWeather = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
    refreshWeather();
  };

  return (
    <Page>
      <List>
        {/* Location Status */}
        {!isSupported && (
          <Section header="Not Supported">
            <Cell>
              <Text style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
                Location requires Telegram v8.0+ or TMA Studio
              </Text>
            </Cell>
          </Section>
        )}

        {locationError && (
          <Section header="Location Error">
            <Cell>
              <Text style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
                {locationError}
              </Text>
            </Cell>
          </Section>
        )}

        {/* Weather Section */}
        <WeatherCard
          weather={weather}
          isLoading={weatherLoading || locationLoading}
          error={!location ? null : weatherError}
        />

        {/* Map Section */}
        <Section header="Your Location">
          <div style={{ padding: '8px 0' }}>
            <LocationMap location={location} height="250px" />
          </div>

          {location && (
            <Cell subtitle="Coordinates">
              <Text>
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </Text>
            </Cell>
          )}

          {location?.accuracy && (
            <Cell subtitle="Accuracy">
              <Text>{Math.round(location.accuracy)} meters</Text>
            </Cell>
          )}
        </Section>

        {/* Actions Section */}
        <Section header="Actions">
          <div style={{ padding: '8px 16px', display: 'flex', gap: 12, flexDirection: 'column' }}>
            <Button
              mode="filled"
              size="l"
              stretched
              loading={locationLoading}
              onClick={handleRefresh}
              disabled={!isSupported}
            >
              {location ? 'Refresh Location' : 'Get My Location'}
            </Button>

            {location && weather && (
              <Button
                mode="outline"
                size="l"
                stretched
                loading={weatherLoading}
                onClick={handleRefreshWeather}
              >
                Refresh Weather
              </Button>
            )}
          </div>
        </Section>

        {/* Info Section */}
        <Section header="About">
          <Cell subtitle="SDK Feature">
            TMA locationManager
          </Cell>
          <Cell subtitle="Weather API">
            OpenWeatherMap
          </Cell>
          <Cell subtitle="Map">
            Leaflet + OpenStreetMap
          </Cell>
        </Section>
      </List>
    </Page>
  );
};
