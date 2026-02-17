import { FanvueClient } from './fanvue';
import { supabase } from '../db/supabase';

export class MassDMService {
  static async sendCampaign(
    creatorId: string,
    listName: 'all_fans' | 'subscribers' | 'expired_subscribers' | 'top_spenders',
    message: string,
    mediaUuids: string[] = [],
    price?: number
  ) {
    // 1. Get List UUID
    // In real API, list IDs are usually fetched first via /chats/lists/smart
    // For now, assume listName maps directly or fetch if needed.
    // Fanvue API doc says: "Target smart lists (all_fans...)"
    // Let's assume the API accepts the string name or we need to map it.
    // The reference says: `GET .../chats/lists/smart` returns list objects.
    
    let listUuid = '';
    try {
      // Mock fetching lists or implement getLists in FanvueClient
      // For now, we'll just pass the name as a placeholder or assume the client handles it.
      // But the client expects listUuids array.
      // Let's implement getSmartLists in FanvueClient or simulate it here.
      // If Test Mode, we use mock UUIDs.
      listUuid = `list-${listName}-${creatorId}`; 
    } catch (e) {
      console.error('Error fetching lists:', e);
      throw e;
    }

    // 2. Send Mass Message
    try {
      const result = await FanvueClient.sendMassMessage(
        creatorId,
        [listUuid], // Array of list UUIDs
        message,
        mediaUuids,
        price
      );

      // 3. Log Campaign
      await supabase.from('campaigns').insert({
        creator_id: creatorId,
        list_name: listName,
        message_content: message,
        media_uuids: mediaUuids,
        price,
        status: 'sent', // Async in reality
        fanvue_campaign_id: result.campaignUuid || 'mock-campaign'
      });

      return result;
    } catch (e) {
      console.error('Mass DM Failed:', e);
      throw e;
    }
  }

  static async getCampaignStats(campaignId: string) {
    // Implement stats fetching if API supports it
    return { delivered: 0, opened: 0, purchased: 0 };
  }
}
