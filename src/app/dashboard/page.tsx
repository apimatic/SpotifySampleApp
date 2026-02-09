"use client";

import { useEffect, useState } from "react";
import type { MusicDnaData } from "@/types";
import DnaCard from "@/components/DnaCard";

export default function Dashboard() {
  const [data, setData] = useState<MusicDnaData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/music-data");
        if (cancelled) return;
        if (!res.ok) {
          if (res.status === 401) {
            window.location.href = "/";
            return;
          }
          throw new Error("Failed to fetch");
        }
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setError("Something went wrong. Please try logging in again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-lg">Analyzing your music DNA...</p>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen gradient-bg flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error || "No data found"}</p>
          <a
            href="/"
            className="text-purple-400 underline hover:text-purple-300"
          >
            Go back and try again
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center px-4 py-12">
      <DnaCard data={data} />
    </main>
  );
}
