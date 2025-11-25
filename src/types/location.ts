export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  locationName: string;
}

export interface FavoriteLocation extends LocationData {
  id: string;
  name: string;
  savedAt: number;
}
