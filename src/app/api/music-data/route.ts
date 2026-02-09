import { NextRequest, NextResponse } from "next/server";
import {
  fetchTopArtists,
  fetchTopTracks,
  fetchAudioFeatures,
} from "@/lib/spotify";
import { getCredentials } from "@/lib/credentials";
import {
  calculateAverageFeatures,
  estimateFeaturesFromGenres,
  getTopGenres,
  getMostObscureArtist,
  getPersonality,
} from "@/lib/analysis";
import type { ArtistData, TrackData, MusicDnaData } from "@/types";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("spotify_token")?.value;
  const creds = getCredentials(request);

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!creds) {
    return NextResponse.json({ error: "No credentials" }, { status: 401 });
  }

  try {
    const [artistsResult, tracksResult] = await Promise.all([
      fetchTopArtists(creds, token),
      fetchTopTracks(creds, token),
    ]);

    const artists: ArtistData[] = (artistsResult.items ?? []).map(
      (a) => ({
        id: a.id ?? "",
        name: a.name ?? "Unknown",
        genres: a.genres ?? [],
        popularity: a.popularity ?? 0,
        imageUrl: a.images?.[0]?.url ?? null,
      })
    );

    const tracks: TrackData[] = (tracksResult.items ?? []).map(
      (t) => ({
        id: t.id ?? "",
        name: t.name ?? "Unknown",
        artistName: t.artists?.[0]?.name ?? "Unknown",
      })
    );

    // Try Spotify audio features API first, fall back to genre estimation
    const trackIds = tracks.map((t) => t.id).filter(Boolean);
    let audioFeatureAverages;
    try {
      const audioFeatures = trackIds.length
        ? await fetchAudioFeatures(creds, token, trackIds)
        : [];
      audioFeatureAverages = calculateAverageFeatures(audioFeatures);
      const allZero = Object.values(audioFeatureAverages).every((v) => v === 0);
      if (allZero) {
        audioFeatureAverages = estimateFeaturesFromGenres(artists);
      }
    } catch {
      console.warn("Audio features API unavailable, using genre-based estimation");
      audioFeatureAverages = estimateFeaturesFromGenres(artists);
    }

    const topGenres = getTopGenres(artists);
    const obscureArtist = getMostObscureArtist(artists);
    const { label, description } = getPersonality(audioFeatureAverages);

    const data: MusicDnaData = {
      audioFeatures: audioFeatureAverages,
      topGenres,
      obscureArtist,
      personalityLabel: label,
      personalityDescription: description,
      topArtists: artists.slice(0, 10),
      topTracks: tracks.slice(0, 10),
    };

    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching music data:", err);
    return NextResponse.json(
      { error: "Failed to fetch music data" },
      { status: 500 }
    );
  }
}
