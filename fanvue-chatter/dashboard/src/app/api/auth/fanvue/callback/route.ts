import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }
  
  const cookieStore = await cookies();
  const codeVerifier = cookieStore.get('fanvue_code_verifier')?.value;
  
  if (!codeVerifier) {
    return NextResponse.json({ error: 'No code verifier found' }, { status: 400 });
  }

  const clientId = process.env.FANVUE_CLIENT_ID;
  const redirectUri = process.env.FANVUE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/fanvue/callback`;

  if (!clientId) {
    return NextResponse.json({ error: 'FANVUE_CLIENT_ID not configured' }, { status: 500 });
  }

  try {
    const tokenResponse = await fetch('https://auth.fanvue.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId,
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return NextResponse.json({ error: 'Token exchange failed', details: errorText }, { status: 500 });
    }

    const tokens = await tokenResponse.json();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
       return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { error: dbError } = await supabase.from('fanvue_tokens').upsert({
      user_id: user.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      updated_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({ error: 'Failed to save tokens' }, { status: 500 });
    }

    cookieStore.delete('fanvue_code_verifier');

    const redirectUrl = new URL('/creators', request.url);
    redirectUrl.searchParams.set('connected', 'true');
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
