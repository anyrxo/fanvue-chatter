import { supabase } from '../db/supabase';
import { Creator } from '../types';

export class CreatorService {
  static async getCreator(id: string): Promise<Creator | null> {
    const { data, error } = await supabase.from('creators').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching creator:', error);
      return null;
    }
    return data as Creator;
  }

  static async updateConfig(id: string, config: Partial<Creator['persona_config']>) {
    const { error } = await supabase.from('creators').update({ persona_config: config }).eq('id', id);
    if (error) throw error;
  }
}
