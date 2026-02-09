"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    // Pre-fill redirect URI based on current origin
    const origin = window.location.origin;
    setRedirectUri(`${origin}/api/callback`);

    // Check if credentials are already saved
    const saved = document.cookie.includes("sp_client_id=");
    if (saved) setShowForm(false);
  }, []);

  function saveCredentials() {
    if (!clientId || !clientSecret || !redirectUri) return;

    const opts = "path=/;max-age=7200;samesite=lax";
    document.cookie = `sp_client_id=${encodeURIComponent(clientId)};${opts}`;
    document.cookie = `sp_client_secret=${encodeURIComponent(clientSecret)};${opts}`;
    document.cookie = `sp_redirect_uri=${encodeURIComponent(redirectUri)};${opts}`;
    setShowForm(false);
  }

  function clearCredentials() {
    document.cookie = "sp_client_id=;path=/;max-age=0";
    document.cookie = "sp_client_secret=;path=/;max-age=0";
    document.cookie = "sp_redirect_uri=;path=/;max-age=0";
    document.cookie = "spotify_token=;path=/;max-age=0";
    setClientId("");
    setClientSecret("");
    setShowForm(true);
  }

  return (
    <main className="relative min-h-screen gradient-bg flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Decorative orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-purple-600/20 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] animate-pulse-glow" />

      {/* DNA helix decoration */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <div className="w-[600px] h-[600px] border border-purple-500/30 rounded-full animate-spin-slow" />
        <div className="absolute w-[400px] h-[400px] border border-blue-500/30 rounded-full animate-spin-slow" style={{ animationDirection: "reverse" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl w-full">
        <Image
          src="/logo.svg"
          alt="Music DNA"
          width={200}
          height={50}
          className="mb-8 animate-float"
          priority
        />

        <h1 className="text-5xl sm:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
          Discover Your Music DNA
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-md leading-relaxed">
          Uncover your sonic identity. See your top genres, audio personality,
          and hidden gems — all in one beautiful card.
        </p>

        {showForm ? (
          <div className="w-full max-w-md glass rounded-2xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Spotify API Credentials
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create an app at{" "}
              <a
                href="https://developer.spotify.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 underline"
              >
                developer.spotify.com/dashboard
              </a>{" "}
              and paste your credentials below. Set the redirect URI in your app to:
            </p>
            <code className="block text-xs text-purple-300 bg-white/5 rounded-lg px-3 py-2 break-all select-all">
              {redirectUri}
            </code>

            <input
              type="text"
              placeholder="Client ID"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors"
            />
            <input
              type="password"
              placeholder="Client Secret"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors"
            />
            <input
              type="text"
              placeholder="Redirect URI"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-colors"
            />
            <button
              onClick={saveCredentials}
              disabled={!clientId || !clientSecret || !redirectUri}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:hover:scale-100"
            >
              Save & Continue
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <a
              href="/api/auth"
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-100 group-hover:opacity-90 transition-opacity" />
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <span className="relative flex items-center gap-3">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
                Login with Spotify
              </span>
            </a>
            <button
              onClick={clearCredentials}
              className="text-xs text-slate-500 hover:text-slate-400 underline transition-colors"
            >
              Change credentials
            </button>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-600">
          Your credentials are stored in your browser only. Nothing is sent to any server.
        </p>
      </div>
    </main>
  );
}
