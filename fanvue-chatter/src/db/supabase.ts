import { createClient } from '@supabase/supabase-js';
import { config } from '../config';

if (!config.supabase.url || !config.supabase.key) {
  throw new Error('Supabase URL and Key must be set in environment variables');
}

export const supabase = createClient(config.supabase.url, config.supabase.key, {
  auth: {
    persistSession: false,
  },
});
