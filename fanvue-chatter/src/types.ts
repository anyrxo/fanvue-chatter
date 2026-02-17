export interface Creator {
  id: string;
  name: string;
  persona_config: {
    name: string;
    style: string; // Changed from enum to string to allow detailed descriptions
    boundaries: string[];
    upsell_frequency: number; // 0-1
    sexting_intensity: number; // 0-1
  };
  content_vault_url?: string;
  created_at: string;
}

export interface Fan {
  id: string;
  creator_id: string;
  external_id: string;
  name?: string;
  spending_tier: 'free' | 'spender' | 'whale';
  total_spent: number;
  notes?: string;
  created_at: string;
  last_active: string;
}

export interface Message {
  id: string;
  fan_id: string;
  creator_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: {
    is_ppv?: boolean;
    price?: number;
    paid?: boolean;
    [key: string]: any;
  };
  created_at: string;
}

export interface Sale {
  id: string;
  fan_id: string;
  creator_id: string;
  amount: number;
  type: 'ppv' | 'tip' | 'subscription';
  created_at: string;
}
