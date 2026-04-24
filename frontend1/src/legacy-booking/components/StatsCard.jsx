function StatsCard({ title, value, delta, icon: Icon, accentClassName }) {
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${accentClassName} shadow-sm`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
          {delta}
        </span>
      </div>

      <div className="mt-6 space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">{title}</p>
        <p className="text-2xl font-bold tracking-tight text-[#374151] md:text-3xl">{value}</p>
      </div>
    </article>
  );
}

export default StatsCard;
