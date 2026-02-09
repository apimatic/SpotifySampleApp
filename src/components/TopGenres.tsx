interface Props {
  genres: string[];
}

const COLORS = [
  "from-purple-500 to-violet-600",
  "from-blue-500 to-cyan-500",
  "from-indigo-500 to-purple-500",
  "from-violet-500 to-fuchsia-500",
  "from-cyan-500 to-blue-600",
];

export default function TopGenres({ genres }: Props) {
  if (genres.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
        Top Genres
      </h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre, i) => (
          <span
            key={genre}
            className={`px-3 py-1.5 rounded-full text-xs font-medium text-white bg-gradient-to-r ${COLORS[i % COLORS.length]} shadow-lg`}
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
}
