import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AnalyticsIcon,
  BookingIcon,
  ConciergeIcon,
  DashboardIcon,
  GuestsIcon,
  SettingsIcon,
} from '../utils/icons';

const navItems = [
  { label: 'Dashboard', icon: DashboardIcon, path: '/' },
  { label: 'Bookings', icon: BookingIcon, path: '/bookings' },
  { label: 'Guests', icon: GuestsIcon, path: '/guests' },
  { label: 'Analytics', icon: AnalyticsIcon, path: '/analytics' },
  { label: 'Settings', icon: SettingsIcon, path: '/settings' },
];

function Sidebar({ onNewBooking }) {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/6 bg-[#07111f]/95 px-5 py-5 shadow-[20px_0_60px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:flex lg:flex-col">
      <div className="flex items-center gap-3 rounded-2xl px-1 pb-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/20">
          <span className="text-lg font-bold">◎</span>
        </div>
        <div>
          <p className="font-display text-lg font-semibold tracking-wide text-white">The Nocturnal</p>
          <p className="text-[11px] uppercase tracking-[0.35em] text-slate-400">Velvet Tide</p>
        </div>
      </div>

      <nav className="grid gap-2 pt-2">
        {navItems.map(({ label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-400/12 text-emerald-300 ring-1 ring-emerald-400/20 shadow-[0_0_30px_rgba(22,242,139,0.07)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'text-emerald-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4 pt-6">
        <button
          type="button"
          onClick={onNewBooking}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(22,242,139,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(22,242,139,0.32)]"
        >
          <span className="text-lg leading-none">+</span>
          New Booking
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/5 px-3 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-500 to-slate-700 text-sm font-semibold text-white">
            SM
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">Sarmilan</p>
            <p className="truncate text-xs text-slate-400">User Profile · Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

