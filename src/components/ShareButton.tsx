"use client";

import { useCallback, useState } from "react";
import html2canvas from "html2canvas";

interface Props {
  cardRef: React.RefObject<HTMLDivElement | null>;
}

export default function ShareButton({ cardRef }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current || downloading) return;
    setDownloading(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f0c29",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.download = "my-music-dna.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to capture card:", err);
    } finally {
      setDownloading(false);
    }
  }, [cardRef, downloading]);

  const handleShare = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#0f0c29",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share) {
          const file = new File([blob], "my-music-dna.png", {
            type: "image/png",
          });
          await navigator.share({
            title: "My Music DNA",
            text: "Check out my Music DNA card!",
            files: [file],
          });
        }
      }, "image/png");
    } catch (err) {
      console.error("Failed to share:", err);
    }
  }, [cardRef]);

  const canShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <div className="flex gap-3 justify-center mt-6">
      <button
        onClick={handleDownload}
        disabled={downloading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        {downloading ? "Saving..." : "Download PNG"}
      </button>

      {canShare && (
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      )}
    </div>
  );
}
