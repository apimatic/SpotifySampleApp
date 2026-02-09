import { NextRequest } from "next/server";
import type { SpotifyCredentials } from "./spotify";

export function getCredentials(request: NextRequest): SpotifyCredentials | null {
  const clientId = request.cookies.get("sp_client_id")?.value;
  const clientSecret = request.cookies.get("sp_client_secret")?.value;
  const redirectUri = request.cookies.get("sp_redirect_uri")?.value;

  if (!clientId || !clientSecret || !redirectUri) return null;

  return { clientId, clientSecret, redirectUri };
}
