import dotenv from 'dotenv';
dotenv.config();

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || '',
  },
  ai: {
    provider: (process.env.AI_PROVIDER || 'openai') as 'openai' | 'ollama',
    model: process.env.AI_MODEL || 'gpt-4o', // or 'hermes3:8b'
    baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1', // or 'http://localhost:11434/api/chat' for ollama (but need to check if using SDK)
    apiKey: process.env.OPENAI_API_KEY,
  },
  fanvue: {
    apiUrl: process.env.FANVUE_API_URL || 'https://api.fanvue.com',
    authUrl: process.env.FANVUE_AUTH_URL || 'https://auth.fanvue.com/oauth2',
    clientId: process.env.FANVUE_CLIENT_ID,
    clientSecret: process.env.FANVUE_CLIENT_SECRET,
    webhookSecret: process.env.FANVUE_WEBHOOK_SECRET,
  },
  testMode: process.env.TEST_MODE === 'true' || process.argv.includes('--test'),
  port: process.env.PORT || 3000,
};
