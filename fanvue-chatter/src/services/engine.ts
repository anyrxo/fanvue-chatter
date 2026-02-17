import { CreatorService } from './creators';
import { FanService } from './fans';
import { analyzeIntent, generateReply } from './ai';
import { supabase } from '../db/supabase';
import { ContentService } from './content';

export class ChatEngine {
  static async handleMessage(
    creatorId: string, 
    fanExternalId: string, 
    messageContent: string,
    fanName?: string
  ) {
    // 1. Get Creator & Fan
    const creator = await CreatorService.getCreator(creatorId);
    if (!creator) throw new Error('Creator not found');

    let fan = await FanService.getFan(creatorId, fanExternalId);
    if (!fan) {
      fan = await FanService.createFan(creatorId, fanExternalId, fanName);
    }

    // 2. Fetch History (last 20 messages to calculate turns properly)
    const { data: historyData } = await supabase
      .from('messages')
      .select('role, content, metadata')
      .eq('fan_id', fan.id)
      .order('created_at', { ascending: false })
      .limit(20);
    
    // Reverse for chronological order, but keep raw for analysis
    const rawHistory = historyData || [];
    const history = [...rawHistory].reverse().map(m => ({ role: m.role, content: m.content }));

    // 3. Save User Message
    await supabase.from('messages').insert({
      fan_id: fan.id,
      creator_id: creator.id,
      role: 'user',
      content: messageContent
    });

    // 4. Analyze Intent
    const intent = await analyzeIntent(messageContent, history);
    
    // 5. Calculate Turns Since Last Pitch
    let turnsSinceLastPitch = 999;
    for (let i = 0; i < rawHistory.length; i++) {
      const msg = rawHistory[i];
      if (msg.role === 'assistant' && (msg.metadata?.is_ppv || msg.content.includes('fanvue.com/post'))) {
        turnsSinceLastPitch = i;
        break;
      }
    }

    console.log(`Fan: ${fan.id} | Intent: ${intent.buying_signal} | Turns since pitch: ${turnsSinceLastPitch}`);

    // 6. Generate Reply
    // Pass fan object for whale logic
    let reply = await generateReply(messageContent, history, creator.persona_config, fan, intent, turnsSinceLastPitch);

    // 7. Post-Process Reply (Insert PPV links if needed)
    let isPpv = false;
    let price = 0;
    let mediaUuid = null;

    if (reply.includes('{{LINK}}') || reply.includes('{{PRICE}}') || intent.suggested_action === 'hard_sell_ppv') {
      // Check if we should actually sell (double check logic)
      // Allow if turns >= 6 (approx 3 fan messages) OR if buying signal is explicitly HIGH (e.g. tipped)
      if (turnsSinceLastPitch >= 6 || intent.buying_signal === 'high') {
        const content = await ContentService.getRecommendation(
          creator.id, 
          fan.id, 
          'any', 
          [], 
          fan.spending_tier === 'whale' ? 25 : 5, 
          fan.spending_tier === 'whale' ? 100 : 20
        );

        if (content) {
          const ppvLink = `https://fanvue.com/post/${content.id}`; // Mock link structure if not real
          price = content.price;
          mediaUuid = content.id;
          isPpv = true;
          
          reply = reply.replace('{{LINK}}', ppvLink).replace('{{PRICE}}', `$${price}`);
          
          // Fallback if placeholders missing
          if (!reply.includes('http')) {
             reply += ` Check it out: ${ppvLink} ($${price})`;
          }
        } else {
          // No content found, fallback to standard text
          reply = reply.replace('{{LINK}}', '').replace('{{PRICE}}', '');
          // Ideally regenerate or modify text to say "I'll send it later"
        }
      }
    }

    // 8. Save Assistant Message
    await supabase.from('messages').insert({
      fan_id: fan.id,
      creator_id: creator.id,
      role: 'assistant',
      content: reply,
      metadata: {
        intent: intent,
        is_ppv: isPpv,
        price: price,
        mediaUuid: mediaUuid
      }
    });

    return reply;
  }
}
