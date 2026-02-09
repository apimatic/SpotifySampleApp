import { NextRequest, NextResponse } from "next/server";
import { getTokenFromCode } from "@/lib/spotify";
import { getCredentials } from "@/lib/credentials";

export async function GET(request: NextRequest) {
  const creds = getCredentials(request);
  if (!creds) {
    return NextResponse.redirect(new URL("/?error=no_credentials", request.url));
  }

  const baseUrl = creds.redirectUri.replace("/api/callback", "");
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=no_code", baseUrl));
  }

  try {
    const { accessToken } = await getTokenFromCode(creds, code);

    const response = NextResponse.redirect(
      new URL("/dashboard", baseUrl)
    );
    response.cookies.set("spotify_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Token exchange failed:", err);
    return NextResponse.redirect(
      new URL("/?error=auth_failed", baseUrl)
    );
  }
}
