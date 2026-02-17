import axios from 'axios';
import OpenAI from 'openai';
import { config } from '../config';
import { Creator, Fan } from '../types';

export class AIClient {
  private openai: OpenAI | null = null;
  private provider: 'openai' | 'ollama';

  constructor() {
    this.provider = config.ai.provider;
    if (this.provider === 'openai' && config.ai.apiKey) {
      this.openai = new OpenAI({
        apiKey: config.ai.apiKey,
        baseURL: config.ai.baseUrl,
      });
    }
  }

  async complete(
    messages: { role: string; content: string }[],
    options: {
      temperature?: number;
      jsonMode?: boolean;
    } = {}
  ): Promise<string> {
    const { temperature = 0.7, jsonMode = false } = options;

    if (this.provider === 'openai') {
      if (!this.openai) throw new Error('OpenAI client not initialized (missing API key?)');
      const response = await this.openai.chat.completions.create({
        model: config.ai.model,
        messages: messages as any,
        temperature,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });
      return response.choices[0].message.content || '';
    } else {
      // Ollama
      // Using raw fetch/axios to /api/chat as specified
      const response = await axios.post(`${config.ai.baseUrl || 'http://localhost:11434/api/chat'}`, {
        model: config.ai.model,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        stream: false,
        format: jsonMode ? 'json' : undefined,
        options: {
          temperature,
        },
      });

      // Ollama response: { model: '...', created_at: '...', message: { role: 'assistant', content: '...' }, done: true, ... }
      if (response.data && response.data.message && response.data.message.content) {
        return response.data.message.content;
      } else {
        throw new Error(`Invalid Ollama response format: ${JSON.stringify(response.data)}`);
      }
    }
  }
}

export const aiClient = new AIClient();

// --- Business Logic ---

export async function analyzeIntent(message: string, history: {role: string, content: string}[]) {
  const systemPrompt = `
  You are an expert dating and sales coach analyzing a conversation on Fanvue/OnlyFans.
  Analyze the fan's latest message and the conversation history.
  Output a JSON object with:
  - sentiment: (positive, neutral, negative, horny, angry)
  - buying_signal: (high, medium, low)
  - objection: (none, price, trust, timing, other)
  - suggested_action: (continue_chat, flirt, tease_ppv, hard_sell_ppv, de_escalate)
  - arousal_level: (0-10)
  
  CRITICAL:
  - If the user just tipped $50+, buying_signal is HIGH.
  - If the user is asking for "free stuff", objection is PRICE.
  - If arousal_level is < 7, do not suggest hard_sell_ppv unless explicitly asked.
  `;

  try {
    const response = await aiClient.complete([
        { role: "system", content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: message }
      ], { jsonMode: true, temperature: 0.2 });
    
    return JSON.parse(response || "{}");
  } catch (e) {
    console.error("AI Analysis failed:", e);
    return { sentiment: 'neutral', buying_signal: 'low', suggested_action: 'continue_chat', arousal_level: 0 };
  }
}

export async function generateReply(
  fanMessage: string, 
  history: {role: string, content: string}[], 
  persona: Creator['persona_config'], 
  fan: Fan,
  intent: any,
  turnsSinceLastPitch: number
) {
  // Whale Context Logic
  // Treat as whale if tier is 'whale' OR total spent > $100 OR they just showed high buying signal (e.g. big tip)
  const isWhale = fan.spending_tier === 'whale' || fan.total_spent > 100 || intent.buying_signal === 'high';
  const priceStrategy = isWhale 
    ? "User is a WHALE/VIP ($100+ spent or big tipper). Do not offer cheap content. Minimum PPV price: $25. Focus on exclusivity."
    : "User is standard. Standard PPV price: $5-$15. If they complain about price, downsell to $3.";

  // Sales Ramp Logic (Wait for 3 fan messages ~ 6-7 total messages before pitching again)
  let salesInstruction = "";
  if (turnsSinceLastPitch < 6 && intent.suggested_action.includes('ppv')) {
    salesInstruction = "Refrain from selling PPV right now. You pitched recently. Build more tension first. Flirt instead.";
  } else if (intent.suggested_action === 'tease_ppv') {
    salesInstruction = "Tease a specific PPV item but don't drop the link yet. Make them want it.";
  } else if (intent.suggested_action === 'hard_sell_ppv') {
    salesInstruction = "Sell the PPV now. Use placeholder {{LINK}} and {{PRICE}}. Be confident.";
  } else {
    salesInstruction = "Just chat and build rapport. No sales pitch.";
  }

  const systemPrompt = `
  You are ${persona.name}. You are chatting with a fan on Fanvue.
  
  ## YOUR PERSONA
  - Style: ${persona.style} (If 'Girl Next Door', be a college student: messy bun, studying, procrastinating. NOT an anime character.)
  - Boundaries: ${(persona.boundaries || []).join(', ')}
  
  ## FAN CONTEXT
  - Spending Tier: ${fan.spending_tier}
  - Total Spent: $${fan.total_spent}
  - ${priceStrategy}

  ## CURRENT STATE
  - Intent: ${intent.sentiment}
  - Arousal: ${intent.arousal_level}/10
  - Buying Signal: ${intent.buying_signal}
  - INSTRUCTION: ${salesInstruction}

  ## FORMATTING RULES (CRITICAL)
  1. **NO ASTERISKS**: Never use *blushes* or *smirks*. Write like a real person texting.
  2. **Casual Tone**: Use lowercase, abbreviations (lol, rn, omg), and natural punctuation.
  3. **No Formal Language**: Never say "I truly appreciate" or "Apologies". Say "Thanks babe" or "My bad".
  4. **Short & Sweet**: 1-3 sentences max.
  5. **Emojis**: Use naturally but don't spam.

  Respond to the fan's message: "${fanMessage}"
  `;

  try {
    const response = await aiClient.complete([
      { role: "system", content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content })),
      { role: "user", content: fanMessage }
    ], { temperature: 0.9 });
    
    return response || "";
  } catch (e) {
    console.error("AI Generation failed:", e);
    return "Hey babe! Sorry, my internet is acting up. Text you in a sec 😘";
  }
}
