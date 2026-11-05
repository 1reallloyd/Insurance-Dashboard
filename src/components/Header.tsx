import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  AlertTriangle,
  Database,
  CheckCheck,
  Radio,
} from 'lucide-react';
import { ViewType } from '../types';

interface HeaderProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onToggleMobileNav: () => void;
  onGlobalSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onToggleMobileNav,
  onGlobalSearch,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // Close notifications dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onGlobalSearch(searchValue);
    }
  };

  const handleClearNotifications = () => {
    setUnreadCount(0);
    setShowNotifications(false);
  };

  return (
    <header className="glass-panel border-b border-white/60 py-2.5 px-3 sm:px-6 flex items-center justify-between z-30 shrink-0 relative">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5">
        <button
          aria-label="Toggle Navigation"
          onClick={onToggleMobileNav}
          className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-[#00008b] hover:bg-white/80 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => onNavigate('dashboard')}
        >
          {/* IA Brand Mark in Deep Navy #00008b */}
          <div className="w-8 h-8 rounded-lg bg-[#00008b] flex items-center justify-center text-white font-bold text-xs shadow-sm ring-1 ring-white/80 group-hover:bg-[#000070] transition-colors">
            IA
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#00008b] leading-none">
                Insurance Analytics
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-blue-50/90 text-[#00008b] border border-blue-200/80 rounded-md shadow-xs">
                Pro v3.2
              </span>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium hidden md:block mt-0.5">
              Real-time Actuarial &amp; Claims Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Middle: Dynamic Global Search */}
      <form
        onSubmit={handleSearchSubmit}
        className="hidden md:flex items-center bg-white/75 backdrop-blur-md border border-white/90 rounded-xl px-3 py-1.5 w-1/3 max-w-md transition-all focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00008b]/20 shadow-xs"
      >
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            onGlobalSearch(e.target.value);
          }}
          placeholder="Search claims, policy IDs, fraud patterns..."
          className="bg-transparent border-none outline-none w-full text-xs text-slate-800 placeholder-slate-400 focus:ring-0"
        />
        <kbd className="hidden lg:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 shadow-xs">
          ⌘K
        </kbd>
      </form>

      {/* Right: Controls & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Live Sync Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-[11px] font-semibold backdrop-blur-sm shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Sync</span>
        </div>

        {/* Notification Bell & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 sm:p-2 rounded-xl text-slate-600 hover:text-[#00008b] hover:bg-white/80 transition"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ef4444] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-76 sm:w-88 glass-panel rounded-xl p-3.5 shadow-2xl border border-white/90 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-2.5">
                <span className="font-bold text-slate-900 text-xs">Actuarial Alerts</span>
                <button
                  onClick={handleClearNotifications}
                  className="text-[11px] text-[#00008b] font-semibold hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                <div
                  className="p-2.5 rounded-lg bg-red-50/90 border border-red-100 flex gap-2.5 text-xs cursor-pointer hover:bg-red-100/70 transition"
                  onClick={() => {
                    onNavigate('fraud');
                    setShowNotifications(false);
                  }}
                >
                  <AlertTriangle className="w-4 h-4 text-[#ef4444] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">
                      Anomalous Loss Burst Flagged
                    </p>
                    <p className="text-slate-600 text-[10.5px] mt-0.5">
                      3 clustered collision claims from Miami flagged for staged accident analysis.
                    </p>
                    <span className="text-[9.5px] text-slate-400 font-mono mt-1 block">
                      12 mins ago
                    </span>
                  </div>
                </div>

                <div
                  className="p-2.5 rounded-lg bg-blue-50/90 border border-blue-100 flex gap-2.5 text-xs cursor-pointer hover:bg-blue-100/70 transition"
                  onClick={() => {
                    onNavigate('upload');
                    setShowNotifications(false);
                  }}
                >
                  <Database className="w-4 h-4 text-[#00008b] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">
                      Batch Q3 Loss Run Ingested
                    </p>
                    <p className="text-slate-600 text-[10.5px] mt-0.5">
                      Auto &amp; Commercial policy loss triangulations recalculated.
                    </p>
                    <span className="text-[9.5px] text-slate-400 font-mono mt-1 block">
                      45 mins ago
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-50/90 border border-emerald-100 flex gap-2.5 text-xs">
                  <CheckCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 text-[11px]">
                      Model Retrained Successfully
                    </p>
                    <p className="text-slate-600 text-[10.5px] mt-0.5">
                      XGBoost Claims Predictor reached 99.8% precision score.
                    </p>
                    <span className="text-[9.5px] text-slate-400 font-mono mt-1 block">
                      2 hours ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div
          onClick={() => onNavigate('settings')}
          className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-white/60 transition border border-transparent hover:border-white/80"
          title="Account Settings"
        >
          <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-[#00008b] flex items-center justify-center text-white font-bold text-[11px] shadow-xs ring-1 ring-white/60">
            AU
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-900 leading-tight">Admin User</span>
            <span className="text-[10px] text-slate-500 font-medium">Chief Actuary</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
        </div>
      </div>
    </header>
  );
};
