#!/bin/bash

# Telegram Mini App - Bot Setup Script
# This script sets the menu button for your bot after deployment

echo "🤖 Telegram Mini App - Bot Setup"
echo "================================"
echo ""

# Check if token is provided
if [ -z "$1" ]; then
  echo "Usage: ./scripts/setup-bot.sh <BOT_TOKEN> <APP_URL>"
  echo ""
  echo "Example:"
  echo "  ./scripts/setup-bot.sh 123456:ABC-DEF https://username.github.io/repo/"
  echo ""
  echo "Get your BOT_TOKEN from @BotFather on Telegram"
  exit 1
fi

if [ -z "$2" ]; then
  echo "Error: APP_URL is required"
  echo ""
  echo "Usage: ./scripts/setup-bot.sh <BOT_TOKEN> <APP_URL>"
  exit 1
fi

BOT_TOKEN=$1
APP_URL=$2

echo "Setting menu button..."
echo "Bot Token: ${BOT_TOKEN:0:10}..."
echo "App URL: $APP_URL"
echo ""

# Set the menu button
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton" \
  -H "Content-Type: application/json" \
  -d "{
    \"menu_button\": {
      \"type\": \"web_app\",
      \"text\": \"Open App\",
      \"web_app\": {\"url\": \"${APP_URL}\"}
    }
  }")

# Check response
if echo "$RESPONSE" | grep -q '"ok":true'; then
  echo "✅ Menu button set successfully!"
  echo ""
  echo "Next steps:"
  echo "1. Open Telegram"
  echo "2. Search for your bot"
  echo "3. Click 'Open App' menu button"
else
  echo "❌ Failed to set menu button"
  echo "Response: $RESPONSE"
  exit 1
fi
