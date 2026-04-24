import { BellIcon, SearchIcon } from '../utils/icons';

function Header({ search, onSearchChange }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#060c18]/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search reservations, guests or events..."
            className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-slate-100 outline-none transition focus:border-emerald-400/30 focus:bg-white/10 focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        <button
          type="button"
          className="relative flex h-12 w-12 items-center justify-center rounded-full border border-white/6 bg-white/5 text-slate-300 transition hover:border-emerald-400/20 hover:text-white"
          aria-label="Notifications"
          title="2 new notifications"
        >
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-4 ring-[#07111f]" />
        </button>

        <div className="hidden items-center gap-3 rounded-full border border-white/6 bg-white/5 px-3 py-2 sm:flex">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-sm font-bold text-slate-950">
            SM
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Sarmilan</p>
            <p className="text-xs text-slate-400">Operations Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

