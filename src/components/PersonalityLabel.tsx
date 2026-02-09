interface Props {
  label: string;
  description: string;
}

export default function PersonalityLabel({ label, description }: Props) {
  return (
    <div className="text-center">
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
        Your Music Personality
      </h3>
      <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
        {label}
      </p>
      <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
}
