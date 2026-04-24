import { useMemo, useState } from 'react';
import { buildRevenueBreakdown, buildTrendSeries } from '../utils/bookingHelpers';

function ChartSection({ bookings, period, onPeriodChange }) {
  const trend = useMemo(() => buildTrendSeries(bookings, period), [bookings, period]);
  const revenue = useMemo(() => buildRevenueBreakdown(bookings), [bookings]);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const { exportBookingsToPDF } = await import('../services/exportService');
      await exportBookingsToPDF(bookings, 'detailed');
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  return (
    <section className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
      <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#374151]">Booking Trends</h2>
            <p className="mt-1 text-sm text-[#9CA3AF]">Daily volume across bookings</p>
          </div>

          <div className="inline-flex rounded-lg border border-gray-200 bg-[#F3F4F6] p-1 text-xs font-semibold text-[#9CA3AF]">
            {['weekly', 'monthly'].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onPeriodChange(value)}
                className={`rounded-md px-4 py-2 capitalize transition ${
                  period === value
                    ? 'bg-[#1D4ED8] text-white shadow-sm'
                    : 'text-[#374151] hover:bg-white'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-72 rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
          <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible">
            <defs>
              <linearGradient id="trendLine" x1="0%" x2="100%" y1="0%" y2="0%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="trendFill" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
              <filter id="trendGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.2" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.15  0 0 0 0 0.45  0 0 0 0 0.95  0 0 0 0.9 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {Array.from({ length: 4 }).map((_, index) => (
              <line
                key={index}
                x1="4"
                x2="96"
                y1={18 + index * 18}
                y2={18 + index * 18}
                stroke="rgba(148,163,184,0.35)"
                strokeDasharray="2 3"
              />
            ))}

            <path d={`${trend.path} L 100 90 L 0 90 Z`} fill="url(#trendFill)" opacity="0.8" />
            <path
              d={trend.path}
              fill="none"
              stroke="url(#trendLine)"
              strokeWidth="1.8"
              filter="url(#trendGlow)"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {trend.buckets.map((point) => (
              <circle
                key={point.label}
                cx={point.x}
                cy={point.y}
                r="1.75"
                fill="#1D4ED8"
                stroke="#fff"
                strokeWidth="1"
              />
            ))}

            <g fill="#6B7280" fontSize="3" fontFamily="Inter, sans-serif">
              {trend.buckets.map((point) => (
                <text key={point.label} x={point.x} y="95" textAnchor="middle">
                  {point.label}
                </text>
              ))}
            </g>
          </svg>
        </div>
      </article>

      <article className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[#374151]">Revenue Breakdown</h2>
            <p className="mt-1 text-sm text-[#9CA3AF]">Estimated earnings by booking type</p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-lg border border-gray-200 bg-[#F3F4F6] px-3 py-1.5 text-xs font-semibold text-[#374151] transition hover:bg-gray-200 disabled:opacity-50"
            title="Download as PDF"
          >
            {exporting ? '…' : '📥 Export'}
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {revenue.map((item) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                <span>{item.label}</span>
                <span className="text-[#374151]">${item.value.toLocaleString()}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.className} transition-all duration-700`}
                  style={{ width: `${Math.max(item.percentage, item.value > 0 ? 10 : 4)}%` }}
                />
              </div>
              <div className="text-right text-[11px] font-medium text-[#9CA3AF]">
                {item.percentage}% of total revenue
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}

export default ChartSection;
