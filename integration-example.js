#!/usr/bin/env node

/**
 * 🚀 OpenServ Referrals SDK - Complete Integration Example
 * 
 * This single file demonstrates all features of the OpenServ Referrals SDK
 * for Telegram bots. Copy this into your project and you're ready to go!
 */

import { register, ack } from '@openserv-labs/referrals-sdk'
import TelegramBot from 'node-telegram-bot-api'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const OPENSERV_API_KEY = process.env.OPENSERV_REFERRALS_API_KEY

if (!BOT_TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN not found in environment variables')
  console.log('💡 Add your bot token to .env file:')
  console.log('   TELEGRAM_BOT_TOKEN=your_bot_token_here')
  process.exit(1)
}

if (!OPENSERV_API_KEY) {
  console.error('❌ OPENSERV_REFERRALS_API_KEY not found in environment variables')
  console.log('💡 Contact OpenServ team to register your app and get an API key')
  process.exit(1)
}

// Enable debug logging
process.env.DEBUG = 'openserv:*'

async function startBot() {
  console.log('🤖 Starting Telegram bot with OpenServ Referrals...')
  console.log('🔑 API Key:', OPENSERV_API_KEY ? '✅ Set' : '❌ Missing')
  console.log('🤖 Bot Token:', BOT_TOKEN ? '✅ Set' : '❌ Missing')
  
  // Initialize bot
  const bot = new TelegramBot(BOT_TOKEN, { polling: true })
  
  try {
    // Register bot with OpenServ Referrals SDK
    // This automatically handles /start <referral_code> commands
    console.log('📡 Registering bot with OpenServ...')
    await register(bot)
    console.log('✅ Bot registered with OpenServ Referrals')
  } catch (err) {
    console.error('❌ Failed to register bot with OpenServ:', err.message)
    console.error('Full error:', err)
    process.exit(1)
  }

  // Welcome message (when user starts without referral code)
  bot.onText(/\/start$/, async (msg) => {
    const chatId = msg.chat.id
    const username = msg.from.username || msg.from.first_name
    
    console.log(`👋 User ${username} (${msg.from.id}) started bot WITHOUT referral code`)
    
    await bot.sendMessage(chatId, 
      `🎉 Welcome ${username}!\n\n` +
      `This bot is powered by OpenServ Referrals.\n\n` +
      `📋 Available commands:\n` +
      `• /help - Show this help message\n` +
      `• /buy <amount> - Simulate a purchase\n\n` +
      `💡 Try sharing your referral link with friends!`
    )
  })

  // Log referral start commands (this is handled by the SDK, but we can log it)
  bot.onText(/\/start (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const username = msg.from.username || msg.from.first_name
    const referralCode = match[1]
    
    console.log(`🎯 User ${username} (${msg.from.id}) started bot WITH referral code: ${referralCode}`)
    
    // The SDK will automatically handle the referral acknowledgment
    // We just need to send a welcome message
    await bot.sendMessage(chatId, 
      `🎉 Welcome ${username}!\n\n` +
      `You were referred by someone! 🎁\n\n` +
      `📋 Available commands:\n` +
      `• /help - Show this help message\n` +
      `• /buy <amount> - Simulate a purchase\n\n` +
      `💡 Thanks for using the referral link!`
    )
  })

  // Help command
  bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id
    
    await bot.sendMessage(chatId,
      `🔧 Bot Commands:\n\n` +
      `📥 /start - Welcome message\n` +
      `🛒 /buy <amount> - Simulate purchase (e.g., /buy 10.50)\n` +
      `❓ /help - Show this help\n\n` +
      `🎁 Referral Rewards:\n` +
      `• $2 for each new user who starts the bot\n` +
      `• $5 for each purchase made\n\n` +
      `📊 Check your stats at @openserv_referrals_bot\n` +
      `🔗 Share your referral link to earn rewards!`
    )
  })

  // Purchase simulation command
  bot.onText(/\/buy (.+)/, async (msg, match) => {
    const chatId = msg.chat.id
    const userId = msg.from.id
    const username = msg.from.username || msg.from.first_name
    const amount = parseFloat(match[1])

    console.log(`🛒 Purchase attempt: ${username} (${userId}) - $${amount}`)

    if (isNaN(amount) || amount <= 0) {
      await bot.sendMessage(chatId, 
        `❌ Invalid amount. Please use: /buy <amount>\n` +
        `Example: /buy 10.50`
      )
      return
    }

    try {
      console.log('📡 Calling OpenServ API...')
      console.log('📡 Request data:', {
        userId,
        username,
        action: 'purchase',
        amount
      })
      
      // Acknowledge the purchase with OpenServ
      const result = await ack({
        userId,
        username,
        action: 'purchase',
        amount
      })

      console.log('📡 API Response:', result)

      if (result.success) {
        await bot.sendMessage(chatId,
          `✅ Purchase of $${amount.toFixed(2)} acknowledged!\n\n` +
          `💰 You earned $5 for this purchase\n` +
          `📊 Check your rewards at @openserv_referrals_bot`
        )
      } else {
        await bot.sendMessage(chatId,
          `❌ Error processing purchase: ${result.error}`
        )
      }
    } catch (error) {
      console.error('❌ Purchase acknowledgment error:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        statusCode: error.statusCode,
        response: error.response
      })
      
      // Try to extract more info from the error
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
      }
      
      await bot.sendMessage(chatId,
        `❌ Failed to process purchase. Please try again.\n\n` +
        `Debug info: ${error.message}`
      )
    }
  })

  // Handle errors
  bot.on('error', (error) => {
    console.error('Bot error:', error)
  })

  bot.on('polling_error', (error) => {
    console.error('Polling error:', error)
  })

  console.log('🎉 Bot is running!')
  console.log('📱 Test with: /start, /buy 10, /help')
  console.log('🔗 Share your referral link to test the flow')
  console.log('📊 Check stats at @openserv_referrals_bot')
}

// Start the bot
startBot().catch(console.error) 