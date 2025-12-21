import { Telegraf, Markup } from 'telegraf';
import process from 'process';

// Replace with your actual deployed URL or ngrok URL for testing
// For local development inside Telegram, you'll need https
const WEB_APP_URL = 'https://beats-miniapp.vercel.app'; 
// NOTE: Since we are local, this URL is a placeholder. 
// The user will need to deploy or use a tunnel (ngrok) to really test it inside Telegram.

const token = '8359083093:AAFqrIz9zRvD0VoiECaWj87kfKP4iUJvS5Y';
const bot = new Telegraf(token);

bot.command('start', (ctx) => {
  ctx.reply(
    'Welcome to Beatstars Clone! 🎵\nTap the button below to browse beats.',
    Markup.keyboard([
      Markup.button.webApp('🎵 Open Store', WEB_APP_URL),
    ])
  );
});

bot.launch();

console.log('Bot is running...');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
