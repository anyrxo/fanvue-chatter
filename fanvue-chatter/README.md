# Fanvue AI Chatter

An open-source AI-powered chatting platform for Fanvue creators. Automate fan conversations, send PPV content, manage multiple creators, and run mass DM campaigns — all from a single dashboard.

> **This is a base/template.** Fork it, configure your own API keys, and deploy. Built to be self-hosted or deployed to Vercel/Railway/etc.

## Features

- 🤖 **AI-Powered Chat** — Automated fan conversations with persona-aware responses
- 💰 **Smart PPV Sales** — Intent detection, buying signal analysis, dynamic pricing based on fan tier (free → spender → whale)
- 🎭 **Multi-Persona Support** — Configure different styles per creator (girl_next_door, dominant, best_friend, luxury, custom)
- 📊 **Dashboard** — Revenue tracking, conversion rates, active chats, campaign analytics
- 📨 **Mass DM Campaigns** — Broadcast messages to smart lists (all fans, top spenders, expired subscribers)
- 🔌 **Multi-LLM Support** — OpenAI (GPT-4o), local Ollama (Hermes 3), or any OpenAI-compatible API
- 🔐 **Fanvue OAuth** — Connect creator accounts via OAuth PKCE flow
- 🎯 **Sales Strategy Engine** — Turn counting, objection handling, sexting escalation, upsell pacing

## Architecture

```
├── src/                  # Express backend
│   ├── services/
│   │   ├── ai.ts         # Provider-agnostic AI (OpenAI, Ollama, Custom)
│   │   ├── engine.ts     # Chat engine (turn counting, intent analysis, whale logic)
│   │   ├── fanvue.ts     # Fanvue API client wrapper
│   │   └── mass_dm.ts    # Mass DM campaign service
│   └── index.ts
├── dashboard/            # Next.js 16 frontend
│   ├── src/app/
│   │   ├── dashboard/    # Overview with stats + charts
│   │   ├── creators/     # Creator management + persona config
│   │   ├── campaigns/    # Mass DM campaigns
│   │   └── settings/     # AI config, webhooks, API keys
│   └── ...
└── ...
```

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-username/fanvue-chatter.git
cd fanvue-chatter

# Backend
npm install

# Dashboard
cd dashboard
npm install
```

### 2. Configure Environment

```bash
# Backend
cp .env.example .env
# Edit .env with your keys

# Dashboard
cd dashboard
cp .env.example .env.local
# Edit .env.local with your Supabase + Fanvue credentials
```

### 3. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the schema migration: `psql` or use the Supabase SQL editor with `supabase_schema.sql`
3. Copy your project URL, anon key, and service role key to `.env` / `.env.local`

### 4. Set Up Fanvue OAuth

1. Go to [Fanvue Developer Portal](https://fanvue.com/developers)
2. Create an OAuth app
3. Set redirect URI to: `http://localhost:3000/api/auth/fanvue/callback`
4. Copy Client ID and Client Secret to your `.env`

### 5. Run

```bash
# Backend (port 4000)
npm run dev

# Dashboard (port 3000)
cd dashboard
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — sign up, connect your Fanvue account, configure your AI provider, and start chatting.

## AI Providers

| Provider | Setup | Best For |
|----------|-------|----------|
| **OpenAI** | Paste API key in AI Settings | Production (GPT-4o recommended) |
| **Ollama** | Install [Ollama](https://ollama.ai), pull a model (`ollama pull hermes3:8b`) | Free local testing |
| **Custom** | Any OpenAI-compatible API endpoint | Self-hosted models, other providers |

## How It Works

1. **Fan sends a message** → Fanvue webhook triggers the backend
2. **AI analyzes intent** → Sales opportunity? Sexting? Objection? Casual chat?
3. **Engine decides response strategy** → Based on fan tier, conversation turn count, persona config
4. **AI generates response** → Using configured LLM with persona-specific system prompt
5. **Response sent via Fanvue API** → Including PPV pricing if applicable

### Sales Logic

- **Turn counting**: Minimum 6 turns before any PPV pitch (unless high buying signal detected)
- **Whale detection**: Fans with $100+ lifetime spend get premium pricing ($25-75 PPV)
- **Standard fans**: $5-15 PPV range
- **Freeloader handling**: Polite but firm boundary setting

## Deployment

### Vercel (Recommended for Dashboard)

```bash
cd dashboard
npx vercel --prod
```

Set environment variables in Vercel dashboard. Update Fanvue redirect URI to your production URL.

### Self-Hosted

The backend can run on any Node.js server. Use PM2, Docker, or systemd.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Dashboard**: Next.js 16, Tailwind CSS, shadcn/ui, Recharts
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Fanvue OAuth PKCE
- **AI**: OpenAI SDK, Ollama API

## Contributing

PRs welcome. Please open an issue first to discuss changes.

## License

MIT
