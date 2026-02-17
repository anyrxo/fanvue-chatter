import { supabase } from '../db/supabase';
import { Fan } from '../types';

export class FanService {
  static async getFan(creatorId: string, externalId: string): Promise<Fan | null> {
    const { data, error } = await supabase.from('fans').select('*').eq('creator_id', creatorId).eq('external_id', externalId).single();
    if (error) {
      if (error.code === 'PGRST116') { // Not found
        return null;
      }
      console.error('Error fetching fan:', error);
      return null;
    }
    return data as Fan;
  }

  static async createFan(creatorId: string, externalId: string, name?: string): Promise<Fan> {
    const { data, error } = await supabase.from('fans').insert({
      creator_id: creatorId,
      external_id: externalId,
      name: name,
      spending_tier: 'free',
      total_spent: 0
    }).select().single();
    
    if (error) throw error;
    return data as Fan;
  }

  static async updateSpend(fanId: string, amount: number) {
    const { data } = await supabase.from('fans').select('total_spent').eq('id', fanId).single();
    const newTotal = (data?.total_spent || 0) + amount;
    let tier = 'free';
    if (newTotal > 100) tier = 'spender';
    if (newTotal > 500) tier = 'whale';

    await supabase.from('fans').update({ total_spent: newTotal, spending_tier: tier }).eq('id', fanId);
  }
}
