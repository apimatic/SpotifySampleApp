"use client";

import { useRef } from "react";
import Image from "next/image";
import type { MusicDnaData } from "@/types";
import RadarChart from "./RadarChart";
import TopGenres from "./TopGenres";
import ObscureArtist from "./ObscureArtist";
import PersonalityLabel from "./PersonalityLabel";
import ShareButton from "./ShareButton";

interface Props {
  data: MusicDnaData;
}

export default function DnaCard({ data }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        ref={cardRef}
        className="gradient-card glass dna-glow rounded-3xl p-6 sm:p-8 space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Image src="/logo.svg" alt="Music DNA" width={140} height={35} />
          <span className="text-xs text-slate-500 font-mono">
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

        {/* Personality Label */}
        <PersonalityLabel
          label={data.personalityLabel}
          description={data.personalityDescription}
        />

        {/* Radar Chart */}
        <RadarChart features={data.audioFeatures} />

        {/* Top Genres */}
        <TopGenres genres={data.topGenres} />

        {/* Most Obscure Artist */}
        {data.obscureArtist && <ObscureArtist artist={data.obscureArtist} />}

        {/* Top Artists Preview */}
        {data.topArtists.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Top Artists
            </h3>
            <div className="flex -space-x-2">
              {data.topArtists.slice(0, 6).map((artist) => (
                <div key={artist.id} className="relative group">
                  {artist.imageUrl ? (
                    <img
                      src={artist.imageUrl}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-purple-900/50 flex items-center justify-center text-xs text-purple-300 font-bold">
                      {artist.name[0]}
                    </div>
                  )}
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {artist.name}
                  </span>
                </div>
              ))}
              {data.topArtists.length > 6 && (
                <div className="w-10 h-10 rounded-full border-2 border-slate-800 bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-medium">
                  +{data.topArtists.length - 6}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer branding */}
        <div className="pt-2">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-4" />
          <p className="text-center text-[10px] text-slate-600">
            Generated with Music DNA
          </p>
        </div>
      </div>

      {/* Share/Download — outside the captured card */}
      <ShareButton cardRef={cardRef} />
    </div>
  );
}
