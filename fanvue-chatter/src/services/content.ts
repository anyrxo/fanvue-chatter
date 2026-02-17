import { supabase } from '../db/supabase';
import { FanvueClient } from './fanvue';

export interface ContentItem {
  id: string; // uuid
  url?: string;
  type: 'image' | 'video';
  tags: string[];
  price: number;
  description?: string;
  source: 'fanvue' | 'supabase';
}

export class ContentService {

  static async getRecommendation(
    creatorId: string, 
    fanId: string, 
    type: 'image' | 'video' | 'any', 
    tags: string[] = [], 
    minPrice: number = 5, 
    maxPrice: number = 50
  ): Promise<ContentItem | null> {

    // 1. Fetch from Supabase Vault
    let vaultQuery = supabase
      .from('content_vault')
      .select('*')
      .eq('creator_id', creatorId)
      .gte('price', minPrice)
      .lte('price', maxPrice);

    if (type !== 'any') {
      vaultQuery = vaultQuery.eq('type', type);
    }
    
    // Postgres array contains check for tags if provided
    if (tags.length > 0) {
      vaultQuery = vaultQuery.contains('tags', tags);
    }

    const { data: localData, error } = await vaultQuery;
    if (error) console.error('Supabase Vault Error:', error);

    const localContent: ContentItem[] = (localData || []).map((item: any) => ({
      id: item.id,
      url: item.url,
      type: item.type,
      tags: item.tags || [],
      price: item.price,
      description: item.description,
      source: 'supabase'
    }));

    // 2. Fetch from Fanvue API (Real Media)
    // Note: In a real high-scale app, we'd cache this or sync it to DB.
    // For now, we fetch live.
    let apiContent: ContentItem[] = [];
    try {
      const media = await FanvueClient.getCreatorMedia(creatorId); // This might need a mapped creatorUuid
      apiContent = media.map(m => ({
        id: m.uuid,
        url: m.url,
        type: m.type,
        tags: m.tags || [],
        price: m.price || 0,
        source: 'fanvue'
      })).filter(m => m.price >= minPrice && m.price <= maxPrice);
      
      if (type !== 'any') {
        apiContent = apiContent.filter(m => m.type === type);
      }
      if (tags.length > 0) {
        // Simple client-side filter for API data
        apiContent = apiContent.filter(m => tags.some(t => m.tags.includes(t)));
      }
    } catch (e) {
      console.error('Fanvue API Media Fetch Error:', e);
    }

    // 3. Merge and Deduplicate
    const allContent = [...localContent, ...apiContent];
    if (allContent.length === 0) return null;

    // 4. Filter out content already sent to this fan
    const sentMediaIds = await this.getSentMediaIds(fanId);
    const availableContent = allContent.filter(c => !sentMediaIds.has(c.id));

    if (availableContent.length === 0) return null;

    // 5. Randomly pick one from the remaining
    const randomIndex = Math.floor(Math.random() * availableContent.length);
    return availableContent[randomIndex];
  }

  private static async getSentMediaIds(fanId: string): Promise<Set<string>> {
    // Check messages table for metadata->mediaUuids or similar
    // Assuming we store sent media UUIDs in metadata
    const { data, error } = await supabase
      .from('messages')
      .select('metadata')
      .eq('fan_id', fanId)
      .eq('role', 'assistant'); // Only check what WE sent

    if (error) return new Set();

    const sentIds = new Set<string>();
    data?.forEach((msg: any) => {
      if (msg.metadata?.mediaUuids && Array.isArray(msg.metadata.mediaUuids)) {
        msg.metadata.mediaUuids.forEach((id: string) => sentIds.add(id));
      }
      if (msg.metadata?.mediaUuid) {
        sentIds.add(msg.metadata.mediaUuid);
      }
    });
    return sentIds;
  }
}
