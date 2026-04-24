export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#E5E7EB] border-t-[#1D4ED8]" />
    </div>
  );
}

export function EmptyState({ title = 'No data', description = "There's nothing to display here." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 text-4xl text-[#9CA3AF]">📭</div>
      <h3 className="text-lg font-semibold text-[#374151]">{title}</h3>
      <p className="mt-2 text-sm text-[#9CA3AF]">{description}</p>
    </div>
  );
}

export function ErrorAlert({ message = 'An error occurred' }) {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
      {message}
    </div>
  );
}
