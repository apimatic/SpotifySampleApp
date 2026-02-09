export interface AudioFeatureAverages {
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  speechiness: number;
}

export interface ArtistData {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  imageUrl: string | null;
}

export interface TrackData {
  id: string;
  name: string;
  artistName: string;
}

export interface MusicDnaData {
  audioFeatures: AudioFeatureAverages;
  topGenres: string[];
  obscureArtist: ArtistData | null;
  personalityLabel: string;
  personalityDescription: string;
  topArtists: ArtistData[];
  topTracks: TrackData[];
}
