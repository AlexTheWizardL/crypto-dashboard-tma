import { Section, Cell, List, Spinner, Avatar } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState, useCallback } from 'react';
import { initData, hapticFeedback, cloudStorage, popup } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';

import './CryptoPage.css';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const FAVORITES_KEY = 'favorite_coins';

export const CryptoPage: FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = initData.user();

  // Load favorites from cloud storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (cloudStorage.getItem.isAvailable()) {
          const stored = await cloudStorage.getItem(FAVORITES_KEY);
          if (stored) {
            setFavorites(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };
    loadFavorites();
  }, []);

  // Fetch coins
  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1'
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        setError('Failed to load prices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, []);

  const toggleFavorite = useCallback(async (coin: Coin) => {
    // Haptic feedback
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }

    const isFavorite = favorites.includes(coin.id);
    let newFavorites: string[];

    if (isFavorite) {
      // Remove from favorites
      newFavorites = favorites.filter((id) => id !== coin.id);

      if (hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('warning');
      }
    } else {
      // Add to favorites - show popup confirmation
      if (popup.show.isAvailable()) {
        const result = await popup.show({
          title: 'Add to Favorites',
          message: `Add ${coin.name} to your watchlist?`,
          buttons: [
            { id: 'add', type: 'default', text: 'Add' },
            { id: 'cancel', type: 'cancel' },
          ],
        });

        if (result !== 'add') return;
      }

      newFavorites = [...favorites, coin.id];

      if (hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('success');
      }
    }

    setFavorites(newFavorites);

    // Save to cloud storage
    if (cloudStorage.setItem.isAvailable()) {
      await cloudStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  }, [favorites]);

  return (
    <Page back={false}>
      <List>
        {/* User info */}
        <Section header="Your Profile">
          <Cell
            before={
              user?.photo_url ? (
                <Avatar src={user.photo_url} size={48} />
              ) : (
                <Avatar size={48} acronym={user?.first_name?.charAt(0) || '?'} />
              )
            }
            subtitle={user?.username ? `@${user.username}` : 'Telegram User'}
            after={user?.is_premium ? <span className="premium-badge">Premium</span> : null}
          >
            {user?.first_name || 'Guest'} {user?.last_name || ''}
          </Cell>
        </Section>

        {/* Crypto list */}
        <Section header="Top Cryptocurrencies" footer="Tap to add/remove from favorites">
          {loading ? (
            <div className="crypto-loading">
              <Spinner size="l" />
            </div>
          ) : error ? (
            <Cell>{error}</Cell>
          ) : (
            coins.map((coin) => {
              const isFavorite = favorites.includes(coin.id);
              return (
                <Cell
                  key={coin.id}
                  before={<Avatar src={coin.image} size={40} />}
                  after={
                    <div className="crypto-price-container">
                      <span className="crypto-price">
                        ${coin.current_price.toLocaleString()}
                      </span>
                      <span
                        className={`crypto-change ${
                          coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                        {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                      </span>
                    </div>
                  }
                  subtitle={
                    <span>
                      {coin.name} {isFavorite && <span className="favorite-star">★</span>}
                    </span>
                  }
                  onClick={() => toggleFavorite(coin)}
                >
                  {coin.symbol.toUpperCase()}
                </Cell>
              );
            })
          )}
        </Section>
      </List>
    </Page>
  );
};
