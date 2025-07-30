# OpenServ Referrals SDK

Simple referral tracking for Telegram bots.

## What It Does

Track user referrals through Telegram. Users get referral links, share them with friends, and when friends use the links, you can track the referrals and rewards.

## Quick Start

### Step 1: Get Credentials
Contact OpenServ team to get:
- Your app's API key
- Your Telegram bot token

### Step 2: Choose Integration Method

#### Option 1: SDK (Recommended)

```bash
npm install @openserv-labs/referrals-sdk
```

```javascript
import { register, ack } from '@openserv-labs/referrals-sdk'
import TelegramBot from 'node-telegram-bot-api'

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true })

// Automatic start tracking
await register(bot)

// Manual purchase tracking
bot.onText(/\/buy (.+)/, async (msg, match) => {
  const result = await ack({
    userId: msg.from.id,
    username: msg.from.username,
    action: 'purchase',
    amount: parseFloat(match[1])
  })
  
  if (result.success) {
    await bot.sendMessage(msg.chat.id, "✅ Purchase confirmed!")
  }
})
```

**Features:**
- Automatic `/start <referral_code>` tracking
- Custom welcome messages
- Manual purchase tracking with custom responses

#### Option 2: REST API

**Start Acknowledgment:**
```bash
curl -X POST https://referrals.openserv.ai/api/referrals/ack \
  -H "Content-Type: application/json" \
  -H "x-openserv-referrals-api-key: YOUR_API_KEY" \
  -d '{
    "userId": 123456789,
    "username": "user123",
    "action": "start",
    "code": "XYZABC123"
  }'
```

**Purchase Acknowledgment:**
```bash
curl -X POST https://referrals.openserv.ai/api/referrals/ack \
  -H "Content-Type: application/json" \
  -H "x-openserv-referrals-api-key: YOUR_API_KEY" \
  -d '{
    "userId": 123456789,
    "username": "user123",
    "action": "purchase",
    "amount": 10.50
  }'
```

## Environment Setup

Create `.env`:
```env
TELEGRAM_BOT_TOKEN=your_bot_token
OPENSERV_REFERRALS_API_KEY=your_api_key
```

## Complete Example

See `integration-example.js` for full working example.

## Testing

1. Go to @openserv_referrals_bot
2. Send `/listapps` and `/getcodefor 1`
3. Use the referral link to test your bot

## Support

Contact OpenServ for API keys and help. 