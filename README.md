# Crypto Dashboard - Telegram Mini App

A cryptocurrency tracker showcasing Telegram Mini App SDK features.

## Features

- **Live crypto prices** from CoinGecko API
- **Favorites** with cloud storage persistence
- **Bottom tab navigation** (Home, Favorites, Settings)
- **Native popups** for confirmations
- **Haptic feedback** on interactions
- **Main button** for actions
- **Theme sync** with Telegram (dark/light)

## SDK Features Used

| Feature | Usage |
|---------|-------|
| `initData` | User profile (name, photo, premium) |
| `cloudStorage` | Persist favorites across sessions |
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

## Deploy

```bash
npm run deploy
./scripts/setup-bot.sh <BOT_TOKEN> <APP_URL>
```

## Project Structure

```
src/
├── components/
│   ├── App.tsx       # Router + tabs
│   └── Page.tsx      # Back button wrapper
├── pages/
│   ├── CryptoPage/   # Home - prices + favorites
│   ├── FavoritesPage/# Saved coins (cloudStorage)
│   └── SettingsPage/ # Preferences + SDK demos
└── navigation/
    └── routes.tsx    # Route definitions
```

## License

MIT
