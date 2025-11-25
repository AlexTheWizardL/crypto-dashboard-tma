import { Section, Cell, List, Spinner, Avatar, Placeholder } from '@telegram-apps/telegram-ui';
import { type FC, useEffect, useState, useCallback } from 'react';
import { cloudStorage, hapticFeedback, popup } from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

const FAVORITES_KEY = 'favorite_coins';

export const FavoritesPage: FC = () => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch coin data for favorites
  useEffect(() => {
    const fetchCoins = async () => {
      if (favorites.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const ids = favorites.join(',');
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setCoins(data);
      } catch (err) {
        console.error('Failed to fetch coins:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCoins();
  }, [favorites]);

  const removeFavorite = useCallback(async (coinId: string) => {
    // Show confirmation popup
    if (popup.show.isAvailable()) {
      const result = await popup.show({
        title: 'Remove from Favorites',
        message: 'Are you sure you want to remove this coin?',
        buttons: [
          { id: 'remove', type: 'destructive', text: 'Remove' },
          { id: 'cancel', type: 'cancel' },
        ],
      });

      if (result !== 'remove') return;
    }

    // Remove from favorites
    const newFavorites = favorites.filter((id) => id !== coinId);
    setFavorites(newFavorites);
    setCoins(coins.filter((c) => c.id !== coinId));

    // Save to cloud storage
    if (cloudStorage.setItem.isAvailable()) {
      await cloudStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }

    // Haptic feedback
    if (hapticFeedback.notificationOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success');
    }
  }, [favorites, coins]);

  if (loading) {
    return (
      <Page>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <Spinner size="l" />
        </div>
      </Page>
    );
  }

  if (favorites.length === 0) {
    return (
      <Page>
        <Placeholder
          header="No Favorites Yet"
          description="Add coins from the Home page to track them here"
        />
      </Page>
    );
  }

  return (
    <Page>
      <List>
        <Section header="Your Favorites">
          {coins.map((coin) => (
            <Cell
              key={coin.id}
              before={<Avatar src={coin.image} size={40} />}
              after={
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>
                    ${coin.current_price.toLocaleString()}
                  </div>
                  <div
                    style={{
                      fontSize: '0.85rem',
                      color: coin.price_change_percentage_24h >= 0 ? '#34C759' : '#FF3B30',
                    }}
                  >
                    {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                  </div>
                </div>
              }
              subtitle={coin.name}
              onClick={() => removeFavorite(coin.id)}
            >
              {coin.symbol.toUpperCase()}
            </Cell>
          ))}
        </Section>
      </List>
    </Page>
  );
};
