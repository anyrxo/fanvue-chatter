import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function base64URLEncode(str: Buffer) {
  return str.toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer: Buffer) {
  return crypto.createHash("sha256").update(buffer).digest();
}

export async function GET(request: NextRequest) {
  const codeVerifier = base64URLEncode(crypto.randomBytes(32));
  const codeChallenge = base64URLEncode(sha256(Buffer.from(codeVerifier)));
  
  const clientId = process.env.FANVUE_CLIENT_ID;
  const redirectUri = process.env.FANVUE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/fanvue/callback`;
  const scope = "openid offline_access offline read:self read:chat read:creator read:fan read:insights read:media read:agency write:chat write:creator write:media write:agency";
  
  if (!clientId) {
    return NextResponse.json({ error: "FANVUE_CLIENT_ID not configured" }, { status: 500 });
  }

  const url = new URL("https://auth.fanvue.com/oauth2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");

  const response = NextResponse.redirect(url);
  
  response.cookies.set("fanvue_code_verifier", codeVerifier, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10
  });
  
  return response;
}
