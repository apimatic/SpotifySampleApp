"use client";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import type { AudioFeatureAverages } from "@/types";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface Props {
  features: AudioFeatureAverages;
}

export default function RadarChart({ features }: Props) {
  const data = {
    labels: [
      "Danceability",
      "Energy",
      "Valence",
      "Acousticness",
      "Instrumentalness",
      "Speechiness",
    ],
    datasets: [
      {
        label: "Your Music DNA",
        data: [
          features.danceability,
          features.energy,
          features.valence,
          features.acousticness,
          features.instrumentalness,
          features.speechiness,
        ],
        backgroundColor: "rgba(139, 92, 246, 0.2)",
        borderColor: "rgba(139, 92, 246, 0.8)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(139, 92, 246, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.2,
          color: "rgba(255, 255, 255, 0.3)",
          backdropColor: "transparent",
          font: { size: 10 },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.08)",
        },
        angleLines: {
          color: "rgba(255, 255, 255, 0.08)",
        },
        pointLabels: {
          color: "rgba(255, 255, 255, 0.7)",
          font: { size: 11, weight: 500 as const },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        titleColor: "#e2e8f0",
        bodyColor: "#e2e8f0",
        borderColor: "rgba(139, 92, 246, 0.3)",
        borderWidth: 1,
        callbacks: {
          label: (ctx: { parsed: { r: number } }) =>
            ` ${(ctx.parsed.r * 100).toFixed(0)}%`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-[320px] mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
