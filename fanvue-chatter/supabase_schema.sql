-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    persona_config JSONB DEFAULT '{}',
    content_vault_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS fans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id),
    external_id TEXT NOT NULL, -- Platform fan ID
    name TEXT,
    spending_tier TEXT DEFAULT 'free', -- free, spender, whale
    total_spent DECIMAL DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    last_active TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(creator_id, external_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id UUID REFERENCES fans(id),
    creator_id UUID REFERENCES creators(id),
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT,
    metadata JSONB DEFAULT '{}', -- is_ppv, price, paid
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fan_id UUID REFERENCES fans(id),
    creator_id UUID REFERENCES creators(id),
    amount DECIMAL NOT NULL,
    type TEXT CHECK (type IN ('ppv', 'tip', 'subscription')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS content_vault (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id),
    type TEXT CHECK (type IN ('image', 'video', 'audio')),
    url TEXT NOT NULL,
    price_tier DECIMAL,
    description TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE creators ENABLE ROW LEVEL SECURITY;
ALTER TABLE fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_vault ENABLE ROW LEVEL SECURITY;

-- Policies (Allow service role full access)
CREATE POLICY "Enable all for service role" ON creators USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON fans USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON messages USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON sales USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for service role" ON content_vault USING (true) WITH CHECK (true);
