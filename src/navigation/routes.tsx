import type { ComponentType, JSX } from 'react';

import { CryptoPage } from '@/pages/CryptoPage/CryptoPage';
import { FavoritesPage } from '@/pages/FavoritesPage/FavoritesPage';
import { LocationPage } from '@/pages/LocationPage/LocationPage';
import { SettingsPage } from '@/pages/SettingsPage/SettingsPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: CryptoPage, title: 'Home' },
  { path: '/favorites', Component: FavoritesPage, title: 'Favorites' },
  { path: '/location', Component: LocationPage, title: 'Location' },
  { path: '/settings', Component: SettingsPage, title: 'Settings' },
];
