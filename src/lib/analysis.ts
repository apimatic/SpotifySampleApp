import type { AudioFeatureAverages, ArtistData } from "@/types";

const FEATURE_KEYS: (keyof AudioFeatureAverages)[] = [
  "danceability",
  "energy",
  "valence",
  "acousticness",
  "instrumentalness",
  "speechiness",
];

interface AudioFeatureInput {
  danceability?: number;
  energy?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  speechiness?: number;
}

export function calculateAverageFeatures(
  features: AudioFeatureInput[]
): AudioFeatureAverages {
  if (features.length === 0) {
    return {
      danceability: 0,
      energy: 0,
      valence: 0,
      acousticness: 0,
      instrumentalness: 0,
      speechiness: 0,
    };
  }

  const sums: AudioFeatureAverages = {
    danceability: 0,
    energy: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
  };

  for (const feat of features) {
    for (const key of FEATURE_KEYS) {
      sums[key] += feat[key] ?? 0;
    }
  }

  const count = features.length;
  const averages: AudioFeatureAverages = {
    danceability: 0,
    energy: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
  };

  for (const key of FEATURE_KEYS) {
    averages[key] = Math.round((sums[key] / count) * 1000) / 1000;
  }

  return averages;
}

// Genre-to-feature mapping: estimate audio features from genre keywords
const GENRE_SIGNALS: Record<string, Partial<AudioFeatureAverages>> = {
  // High danceability
  dance: { danceability: 0.9, energy: 0.8, valence: 0.7 },
  edm: { danceability: 0.85, energy: 0.9, valence: 0.6 },
  house: { danceability: 0.85, energy: 0.8, valence: 0.65 },
  techno: { danceability: 0.8, energy: 0.85, instrumentalness: 0.6 },
  disco: { danceability: 0.9, energy: 0.75, valence: 0.8 },
  funk: { danceability: 0.85, energy: 0.7, valence: 0.75 },
  reggaeton: { danceability: 0.9, energy: 0.75, valence: 0.7, speechiness: 0.3 },
  "latin pop": { danceability: 0.8, energy: 0.7, valence: 0.75 },
  latin: { danceability: 0.75, energy: 0.7, valence: 0.7 },
  afrobeat: { danceability: 0.8, energy: 0.7, valence: 0.7 },
  // High energy
  rock: { energy: 0.8, danceability: 0.5, valence: 0.5 },
  metal: { energy: 0.95, danceability: 0.35, valence: 0.25, instrumentalness: 0.3 },
  punk: { energy: 0.9, danceability: 0.45, valence: 0.4, speechiness: 0.2 },
  hardcore: { energy: 0.95, danceability: 0.4, valence: 0.2 },
  grunge: { energy: 0.8, valence: 0.3, acousticness: 0.2 },
  "alt rock": { energy: 0.7, valence: 0.45, danceability: 0.5 },
  "alternative": { energy: 0.65, valence: 0.45, danceability: 0.5 },
  "indie rock": { energy: 0.65, valence: 0.5, danceability: 0.5 },
  // High acousticness
  acoustic: { acousticness: 0.9, energy: 0.3, valence: 0.5 },
  folk: { acousticness: 0.8, energy: 0.35, valence: 0.5 },
  "singer-songwriter": { acousticness: 0.75, energy: 0.35, valence: 0.45, speechiness: 0.2 },
  country: { acousticness: 0.6, valence: 0.6, energy: 0.5 },
  bluegrass: { acousticness: 0.8, energy: 0.5, valence: 0.55 },
  classical: { acousticness: 0.85, instrumentalness: 0.9, energy: 0.3 },
  // High speechiness
  "hip hop": { speechiness: 0.6, danceability: 0.75, energy: 0.7, valence: 0.45 },
  rap: { speechiness: 0.7, danceability: 0.75, energy: 0.7, valence: 0.4 },
  trap: { speechiness: 0.5, danceability: 0.7, energy: 0.65, valence: 0.35 },
  "spoken word": { speechiness: 0.9, instrumentalness: 0.05, energy: 0.2 },
  podcast: { speechiness: 0.95, instrumentalness: 0.05, energy: 0.15 },
  // High instrumentalness
  ambient: { instrumentalness: 0.85, energy: 0.2, acousticness: 0.5, valence: 0.3 },
  "post-rock": { instrumentalness: 0.7, energy: 0.6, acousticness: 0.3 },
  jazz: { instrumentalness: 0.5, acousticness: 0.6, energy: 0.4, valence: 0.55 },
  "lo-fi": { instrumentalness: 0.6, energy: 0.3, valence: 0.4, acousticness: 0.4 },
  electronic: { instrumentalness: 0.5, energy: 0.7, danceability: 0.7 },
  // High valence
  pop: { valence: 0.65, danceability: 0.7, energy: 0.65 },
  "k-pop": { valence: 0.7, danceability: 0.75, energy: 0.75 },
  reggae: { valence: 0.75, danceability: 0.7, energy: 0.5, acousticness: 0.3 },
  soul: { valence: 0.6, energy: 0.5, acousticness: 0.5, speechiness: 0.2 },
  gospel: { valence: 0.7, energy: 0.6, acousticness: 0.4 },
  // Low valence
  emo: { valence: 0.25, energy: 0.65, acousticness: 0.3, speechiness: 0.2 },
  goth: { valence: 0.2, energy: 0.5, instrumentalness: 0.3 },
  doom: { valence: 0.15, energy: 0.7, instrumentalness: 0.4 },
  // R&B / other
  "r&b": { valence: 0.55, danceability: 0.7, energy: 0.5, speechiness: 0.2 },
  "neo soul": { valence: 0.55, acousticness: 0.5, energy: 0.4 },
  blues: { valence: 0.4, acousticness: 0.6, energy: 0.45 },
  // Indie / art
  indie: { valence: 0.5, energy: 0.55, danceability: 0.55, acousticness: 0.35 },
  "art pop": { valence: 0.5, energy: 0.6, danceability: 0.6, instrumentalness: 0.2 },
  "dream pop": { valence: 0.45, energy: 0.4, acousticness: 0.4, instrumentalness: 0.3 },
  shoegaze: { valence: 0.35, energy: 0.6, instrumentalness: 0.4 },
};

export function estimateFeaturesFromGenres(
  artists: ArtistData[]
): AudioFeatureAverages {
  const sums: AudioFeatureAverages = {
    danceability: 0,
    energy: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
  };
  let matchCount = 0;

  for (const artist of artists) {
    for (const genre of artist.genres) {
      const lowerGenre = genre.toLowerCase();

      // Try exact match first
      if (GENRE_SIGNALS[lowerGenre]) {
        const signals = GENRE_SIGNALS[lowerGenre];
        for (const key of FEATURE_KEYS) {
          sums[key] += signals[key] ?? 0;
        }
        matchCount++;
        continue;
      }

      // Try partial match (e.g. "indie pop" matches "indie" and "pop")
      for (const [keyword, signals] of Object.entries(GENRE_SIGNALS)) {
        if (lowerGenre.includes(keyword)) {
          for (const key of FEATURE_KEYS) {
            sums[key] += signals[key] ?? 0;
          }
          matchCount++;
          break;
        }
      }
    }
  }

  if (matchCount === 0) {
    // Default balanced profile
    return {
      danceability: 0.5,
      energy: 0.5,
      valence: 0.5,
      acousticness: 0.3,
      instrumentalness: 0.2,
      speechiness: 0.1,
    };
  }

  const averages: AudioFeatureAverages = {
    danceability: 0,
    energy: 0,
    valence: 0,
    acousticness: 0,
    instrumentalness: 0,
    speechiness: 0,
  };

  for (const key of FEATURE_KEYS) {
    averages[key] = Math.round((sums[key] / matchCount) * 1000) / 1000;
  }

  return averages;
}

export function getTopGenres(artists: ArtistData[]): string[] {
  const genreCount: Record<string, number> = {};

  for (const artist of artists) {
    for (const genre of artist.genres) {
      genreCount[genre] = (genreCount[genre] || 0) + 1;
    }
  }

  return Object.entries(genreCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([genre]) => genre);
}

export function getMostObscureArtist(
  artists: ArtistData[]
): ArtistData | null {
  if (artists.length === 0) return null;

  return artists.reduce((most, current) =>
    current.popularity < most.popularity ? current : most
  );
}

interface Personality {
  label: string;
  description: string;
}

export function getPersonality(features: AudioFeatureAverages): Personality {
  const { danceability, energy, valence, acousticness, instrumentalness, speechiness } =
    features;

  if (energy > 0.7 && danceability > 0.7) {
    return {
      label: "The Party Starter",
      description:
        "You live for the beat drop. Your playlists fuel dance floors and your energy is infectious.",
    };
  }

  if (valence > 0.65 && energy > 0.65) {
    return {
      label: "The Euphoric Explorer",
      description:
        "You chase musical highs. Your taste is uplifting, adventurous, and full of positive energy.",
    };
  }

  if (acousticness > 0.6 && energy < 0.45) {
    return {
      label: "The Acoustic Dreamer",
      description:
        "Stripped-back sounds speak to your soul. You find beauty in simplicity and raw emotion.",
    };
  }

  if (instrumentalness > 0.4) {
    return {
      label: "The Instrumental Voyager",
      description:
        "Words aren't needed — you let the music do the talking. You're drawn to sonic textures and atmosphere.",
    };
  }

  if (speechiness > 0.25) {
    return {
      label: "The Lyrical Poet",
      description:
        "Words matter to you. You gravitate toward storytelling, rap, and spoken-word artistry.",
    };
  }

  if (valence > 0.55 && energy < 0.5) {
    return {
      label: "The Chill Optimist",
      description:
        "Good vibes, low tempo. You keep things positive but relaxed — the perfect sunset playlist curator.",
    };
  }

  if (valence < 0.4 && energy > 0.6) {
    return {
      label: "The Intense Rebel",
      description:
        "Dark energy runs through your veins. You're drawn to powerful, moody, and intense sounds.",
    };
  }

  if (valence < 0.4 && energy < 0.45) {
    return {
      label: "The Melancholic Thinker",
      description:
        "You feel deeply through music. Introspective and emotional tracks are your comfort zone.",
    };
  }

  return {
    label: "The Eclectic Soul",
    description:
      "You can't be pinned down. Your taste spans genres and moods — a true musical omnivore.",
  };
}
