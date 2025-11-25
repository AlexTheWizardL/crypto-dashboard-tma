import { Section, Cell, List, Switch } from '@telegram-apps/telegram-ui';
import { type FC, useState, useCallback, useEffect } from 'react';
import {
  cloudStorage,
  hapticFeedback,
  popup,
  mainButton,
  initData
} from '@tma.js/sdk-react';

import { Page } from '@/components/Page.tsx';

const SETTINGS_KEY = 'app_settings';

interface Settings {
  hapticEnabled: boolean;
  notificationsEnabled: boolean;
}

const defaultSettings: Settings = {
  hapticEnabled: true,
  notificationsEnabled: true,
};

export const SettingsPage: FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const user = initData.user();

  // Load settings from cloud storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (cloudStorage.getItem.isAvailable()) {
          const stored = await cloudStorage.getItem(SETTINGS_KEY);
          if (stored) {
            setSettings(JSON.parse(stored));
          }
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      }
    };
    loadSettings();
  }, []);

  // Show/hide main button based on changes
  useEffect(() => {
    if (mainButton.setParams.isAvailable()) {
      if (hasChanges) {
        mainButton.setParams({
          text: 'Save Settings',
          isVisible: true,
          isEnabled: true,
        });
      } else {
        mainButton.setParams({
          isVisible: false,
        });
      }
    }

    return () => {
      if (mainButton.setParams.isAvailable()) {
        mainButton.setParams({ isVisible: false });
      }
    };
  }, [hasChanges]);

  // Handle main button click
  useEffect(() => {
    if (!mainButton.onClick.isAvailable()) return;

    const off = mainButton.onClick(async () => {
      // Save settings
      if (cloudStorage.setItem.isAvailable()) {
        await cloudStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      }

      // Show success popup
      if (popup.show.isAvailable()) {
        await popup.show({
          title: 'Settings Saved',
          message: 'Your preferences have been saved.',
          buttons: [{ id: 'ok', type: 'ok' }],
        });
      }

      // Haptic feedback
      if (settings.hapticEnabled && hapticFeedback.notificationOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('success');
      }

      setHasChanges(false);
    });

    return () => off();
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof Settings>(key: K, value: Settings[K]) => {
    // Selection haptic
    if (settings.hapticEnabled && hapticFeedback.selectionChanged.isAvailable()) {
      hapticFeedback.selectionChanged();
    }

    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }, [settings.hapticEnabled]);

  const testHaptic = useCallback((type: 'light' | 'medium' | 'heavy') => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred(type);
    }
  }, []);

  const testNotification = useCallback((type: 'success' | 'warning' | 'error') => {
    if (hapticFeedback.notificationOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred(type);
    }
  }, []);

  const showTestPopup = useCallback(async () => {
    if (popup.show.isAvailable()) {
      const result = await popup.show({
        title: 'Test Popup',
        message: 'This demonstrates the native Telegram popup.',
        buttons: [
          { id: 'action', type: 'default', text: 'Action' },
          { id: 'destructive', type: 'destructive', text: 'Delete' },
          { id: 'cancel', type: 'cancel' },
        ],
      });
      console.log('Popup result:', result);
    }
  }, []);

  return (
    <Page>
      <List>
        {/* User Info */}
        <Section header="Account">
          <Cell subtitle={user?.username ? `@${user.username}` : 'No username'}>
            {user?.first_name || 'Guest'} {user?.last_name || ''}
          </Cell>
          <Cell subtitle="User ID">
            {user?.id || 'Unknown'}
          </Cell>
        </Section>

        {/* Preferences */}
        <Section header="Preferences">
          <Cell
            after={
              <Switch
                checked={settings.hapticEnabled}
                onChange={(e) => updateSetting('hapticEnabled', e.target.checked)}
              />
            }
            subtitle="Vibration feedback on actions"
          >
            Haptic Feedback
          </Cell>
          <Cell
            after={
              <Switch
                checked={settings.notificationsEnabled}
                onChange={(e) => updateSetting('notificationsEnabled', e.target.checked)}
              />
            }
            subtitle="Price alerts and updates"
          >
            Notifications
          </Cell>
        </Section>

        {/* SDK Feature Demos */}
        <Section header="SDK Features Demo">
          <Cell onClick={() => testHaptic('light')} subtitle="Light impact">
            Test Haptic (Light)
          </Cell>
          <Cell onClick={() => testHaptic('heavy')} subtitle="Heavy impact">
            Test Haptic (Heavy)
          </Cell>
          <Cell onClick={() => testNotification('success')} subtitle="Success notification">
            Test Notification
          </Cell>
          <Cell onClick={showTestPopup} subtitle="Native Telegram popup">
            Test Popup
          </Cell>
        </Section>

        {/* About */}
        <Section header="About">
          <Cell subtitle="Version">1.0.0</Cell>
          <Cell subtitle="SDK">@tma.js/sdk-react</Cell>
        </Section>
      </List>
    </Page>
  );
};
