# OpenServ Referrals SDK

Simple referral tracking for Telegram bots.
<img width="788" height="588" alt="image" src="https://github.com/user-attachments/assets/4748687b-5df7-44a6-a7c8-478ee1e132d6" />

## What It Does

Track user referrals through Telegram. Users get referral links, share them with friends, and when friends use the links, you can track the referrals and rewards.

## Quick Start

### Step 1: Get Credentials
1. **For new bots**: Create your bot with @BotFather and get the token
2. **For existing bots**: Just share your bot's handle
3. Contact OpenServ team with:
   - Your bot's handle (e.g., @myapp_bot)
   - Start reward amount in USD (e.g., $2)
   - Purchase reward amount in USD (e.g., $5)
4. Get your API key from OpenServ team

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
2. Send `/listapps` to see your registered app
3. Send `/getcodefor YOUR_APP_ID` to get your referral link
4. Share the link with others (you cannot use your own referral code)
5. Track referrals when others use your link

## App Information

Check your app details:
```bash
curl -H "x-openserv-referrals-api-key: YOUR_API_KEY" \
     https://referrals.openserv.ai/api/apps/me
```

## Important Notes

- You cannot use your own referral code
- Referral tracking data will be shared in CSV format
- This is the initial version - more features coming soon

## Support

Contact OpenServ for API keys and help. 
