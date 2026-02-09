import { NextRequest, NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/spotify";
import { getCredentials } from "@/lib/credentials";

export async function GET(request: NextRequest) {
  const creds = getCredentials(request);
  if (!creds) {
    return NextResponse.redirect(new URL("/?error=no_credentials", request.url));
  }

  const authUrl = getAuthUrl(creds);
  return NextResponse.redirect(authUrl);
}
