interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  frequency: string;
  duration: string;
  featured?: boolean;
}

export default function PricingCard({ name, description, price, frequency, duration, featured }: PricingCardProps) {
  return (
    <div className={`rounded-xl border p-6 flex flex-col ${
      featured
        ? "bg-zinc-800 border-blue-500/50 ring-1 ring-blue-500/20"
        : "bg-zinc-900 border-zinc-800"
    }`}>
      {featured && (
        <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 rounded-full px-3 py-1 self-start mb-3">
          Most Popular
        </span>
      )}
      <h3 className="text-lg font-bold text-white">{name}</h3>
      <p className="text-zinc-400 text-sm mt-1 flex-1">{description}</p>
      <div className="mt-4 mb-4">
        <span className="text-3xl font-bold text-white">${price.toFixed(2)}</span>
        <span className="text-zinc-500 text-sm ml-1">/spot</span>
      </div>
      <ul className="space-y-2 text-sm text-zinc-400 mb-6">
        <li className="flex items-center gap-2">
          <span className="text-blue-400">·</span> Plays {frequency}
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-400">·</span> {duration} ad duration
        </li>
        <li className="flex items-center gap-2">
          <span className="text-blue-400">·</span> Targeted audience
        </li>
      </ul>
      <a
        href="/contact"
        className={`block text-center font-medium rounded-lg py-2.5 text-sm transition-colors ${
          featured
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
        }`}
      >
        Book This Slot
      </a>
    </div>
  );
}
