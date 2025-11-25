# Crypto Dashboard - Telegram Mini App

A cryptocurrency tracker showcasing Telegram Mini App SDK features.

## Features

- **Live crypto prices** from CoinGecko API
- **Favorites** with cloud storage persistence
- **Location + Weather** with interactive map
- **Bottom tab navigation** (Home, Favorites, Location, Settings)
- **Native popups** for confirmations
- **Haptic feedback** on interactions
- **Main button** for actions
- **Theme sync** with Telegram (dark/light)

## SDK Features Used

| Feature | Usage |
|---------|-------|
| `initData` | User profile (name, photo, premium) |
| `cloudStorage` | Persist favorites across sessions |
| `locationManager` | Request user location (TMA v8.0+) |
| `popup` | Native confirmation dialogs |
| `hapticFeedback` | Vibration on actions |
| `mainButton` | Save settings action |
| `themeParams` | Auto dark/light mode |
| `backButton` | Navigation |

## Quick Start

```bash
npm install
npm run dev
```

## Environment Variables

Create `.env` file (see `.env.example`):

```
VITE_OPENWEATHER_API_KEY=your_api_key
```

Get free API key at [OpenWeatherMap](https://openweathermap.org/api).

## Deploy

```bash
npm run deploy
./scripts/setup-bot.sh <BOT_TOKEN> <APP_URL>
```

## Project Structure

```
src/
├── components/
│   ├── App.tsx           # Router + tabs
│   ├── Page.tsx          # Back button wrapper
│   └── Location/
│       ├── WeatherCard.tsx
│       └── LocationMap.tsx
├── hooks/
│   ├── useWeather.ts     # OpenWeatherMap API
│   └── useLocation.ts    # TMA locationManager
├── pages/
│   ├── CryptoPage/       # Home - prices + favorites
│   ├── FavoritesPage/    # Saved coins (cloudStorage)
│   ├── LocationPage/     # Weather + map
│   └── SettingsPage/     # Preferences + SDK demos
├── types/
│   └── location.ts       # Location/weather types
└── navigation/
    └── routes.tsx        # Route definitions
```

## License

MIT
