import { FC } from 'react';
import { Section, Cell, Text } from '@telegram-apps/telegram-ui';
import type { WeatherData } from '@/types/location';

interface WeatherCardProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

const getWeatherIcon = (icon: string): string => {
  return `https://openweathermap.org/img/wn/${icon}@2x.png`;
};

export const WeatherCard: FC<WeatherCardProps> = ({ weather, isLoading, error }) => {
  if (error) {
    return (
      <Section header="Weather">
        <Cell subtitle="Could not load weather data">
          <Text style={{ color: 'var(--tg-theme-destructive-text-color)' }}>
            {error}
          </Text>
        </Cell>
      </Section>
    );
  }

  if (isLoading || !weather) {
    return (
      <Section header="Weather">
        <Cell subtitle="Fetching weather...">
          <Text>Loading...</Text>
        </Cell>
      </Section>
    );
  }

  return (
    <Section header={`Weather in ${weather.locationName}`}>
      <Cell
        before={
          <img
            src={getWeatherIcon(weather.icon)}
            alt={weather.description}
            style={{ width: 50, height: 50 }}
          />
        }
        subtitle={weather.description.charAt(0).toUpperCase() + weather.description.slice(1)}
      >
        <Text style={{ fontSize: 28, fontWeight: 'bold' }}>
          {weather.temperature}°C
        </Text>
      </Cell>

      <Cell subtitle="Feels like">
        <Text>{weather.feelsLike}°C</Text>
      </Cell>

      <Cell subtitle="Humidity">
        <Text>{weather.humidity}%</Text>
      </Cell>

      <Cell subtitle="Wind speed">
        <Text>{weather.windSpeed} m/s</Text>
      </Cell>
    </Section>
  );
};
