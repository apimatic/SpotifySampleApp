import {
  Client,
  Environment,
  OAuthScopeEnum,
  UsersController,
  TracksController,
} from "spotify-apimatic-sdk";

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

function createBaseClient(creds: SpotifyCredentials) {
  return new Client({
    authorizationCodeAuthCredentials: {
      oAuthClientId: creds.clientId,
      oAuthClientSecret: creds.clientSecret,
      oAuthRedirectUri: creds.redirectUri,
      oAuthScopes: [OAuthScopeEnum.UserTopRead],
    },
    timeout: 0,
    environment: Environment.Production,
  });
}

function createAuthenticatedClient(creds: SpotifyCredentials, token: string) {
  return new Client({
    authorizationCodeAuthCredentials: {
      oAuthClientId: creds.clientId,
      oAuthClientSecret: creds.clientSecret,
      oAuthRedirectUri: creds.redirectUri,
      oAuthScopes: [OAuthScopeEnum.UserTopRead],
      oAuthToken: {
        accessToken: token,
        tokenType: "Bearer",
      },
    },
    timeout: 0,
    environment: Environment.Production,
  });
}

export function getAuthUrl(creds: SpotifyCredentials): string {
  const client = createBaseClient(creds);
  return client.authorizationCodeAuthManager.buildAuthorizationUrl();
}

export async function getTokenFromCode(
  creds: SpotifyCredentials,
  code: string
): Promise<{ accessToken: string }> {
  const client = createBaseClient(creds);
  const token =
    await client.authorizationCodeAuthManager.fetchToken(code);
  return { accessToken: token.accessToken };
}

export async function fetchTopArtists(creds: SpotifyCredentials, token: string) {
  const client = createAuthenticatedClient(creds, token);
  const usersController = new UsersController(client);
  const response = await usersController.getUsersTopArtists(
    "medium_term",
    50,
    0
  );
  return response.result;
}

export async function fetchTopTracks(creds: SpotifyCredentials, token: string) {
  const client = createAuthenticatedClient(creds, token);
  const usersController = new UsersController(client);
  const response = await usersController.getUsersTopTracks(
    "medium_term",
    50,
    0
  );
  return response.result;
}

export async function fetchAudioFeatures(creds: SpotifyCredentials, token: string, trackIds: string[]) {
  const client = createAuthenticatedClient(creds, token);
  const tracksController = new TracksController(client);

  const batches: string[][] = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    batches.push(trackIds.slice(i, i + 100));
  }

  const allFeatures = [];
  for (const batch of batches) {
    const ids = batch.join(",");
    const response = await tracksController.getSeveralAudioFeatures(ids);
    if (response.result.audioFeatures) {
      allFeatures.push(...response.result.audioFeatures);
    }
  }

  return allFeatures;
}
