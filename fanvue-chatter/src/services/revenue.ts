import { supabase } from '../db/supabase';
import { Sale } from '../types';
import { FanService } from './fans';

export class RevenueService {
  static async recordSale(sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale> {
    const { data, error } = await supabase.from('sales').insert(sale).select().single();
    if (error) throw error;
    
    // Also update fan total_spent
    await FanService.updateSpend(sale.fan_id, sale.amount);
    
    return data as Sale;
  }
}
