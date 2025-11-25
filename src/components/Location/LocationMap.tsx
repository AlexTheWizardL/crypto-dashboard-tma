import { FC, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import type { LocationData } from '@/types/location';
import 'leaflet/dist/leaflet.css';

interface LocationMapProps {
  location: LocationData | null;
  height?: string;
}

// Pulsing marker for user location
const pulsingIcon = new DivIcon({
  className: 'pulsing-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: #007AFF;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0, 122, 255, 0.5);
      animation: pulse 2s infinite;
    "></div>
    <style>
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4); }
        70% { box-shadow: 0 0 0 15px rgba(0, 122, 255, 0); }
        100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0); }
      }
    </style>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to recenter map when location changes
const MapRecenter: FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
};

export const LocationMap: FC<LocationMapProps> = ({ location, height = '250px' }) => {
  if (!location) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--tg-theme-secondary-bg-color)',
          borderRadius: 12,
          margin: '0 16px',
        }}
      >
        <span style={{ color: 'var(--tg-theme-hint-color)' }}>
          Request location to view map
        </span>
      </div>
    );
  }

  const { latitude, longitude, accuracy } = location;

  return (
    <div style={{ margin: '0 16px', borderRadius: 12, overflow: 'hidden' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        style={{ height, width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={pulsingIcon}>
          <Popup>
            <div>
              <strong>Your Location</strong>
              <br />
              {latitude.toFixed(6)}, {longitude.toFixed(6)}
              {accuracy && (
                <>
                  <br />
                  <small>Accuracy: {Math.round(accuracy)}m</small>
                </>
              )}
            </div>
          </Popup>
        </Marker>
        <MapRecenter lat={latitude} lng={longitude} />
      </MapContainer>
    </div>
  );
};
