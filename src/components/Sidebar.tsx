import React from 'react';
import {
  Home,
  UploadCloud,
  FileText,
  ShieldAlert,
  TrendingUp,
  FileBarChart,
  Settings,
  HelpCircle,
  Activity,
  X,
} from 'lucide-react';
import { ViewType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  claimsCount?: number;
  fraudCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  claimsCount = 1248,
  fraudCount = 87,
}) => {
  const handleItemClick = (view: ViewType) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`glass-panel w-56 sm:w-60 border-r border-white/60 transition-transform duration-300 ease-in-out shrink-0 flex flex-col justify-between z-40 fixed lg:static inset-y-0 left-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Navigation list */}
        <nav className="p-2.5 sm:p-3 overflow-y-auto">
          {/* Mobile close button header */}
          <div className="flex items-center justify-between lg:hidden mb-3 pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-[#00008b] uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2.5">
            Core Analytics
          </div>

          <ul className="space-y-0.5">
            <li>
              <div
                className={`sidebar-nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
                onClick={() => handleItemClick('dashboard')}
              >
                <Home className="w-4 h-4 mr-2.5 shrink-0" />
                <span className="flex-1 truncate">Dashboard Overview</span>
              </div>
            </li>

            <li>
              <div
                className={`sidebar-nav-item ${currentView === 'upload' ? 'active' : ''}`}
                onClick={() => handleItemClick('upload')}
              >
                <UploadCloud className="w-4 h-4 mr-2.5 shrink-0" />
                <span className="flex-1 truncate">Upload Dataset</span>
                <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-blue-100/80 text-[#00008b] font-mono font-bold border border-blue-200/80">
                  NEW
                </span>
              </div>
            </li>

            <li>
              <div
                className={`sidebar-nav-item ${currentView === 'claims' ? 'active' : ''}`}
                onClick={() => handleItemClick('claims')}
              >
                <FileText className="w-4 h-4 mr-2.5 shrink-0" />
                <span className="flex-1 truncate">Claims Management</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/90 text-slate-600 font-mono font-semibold border border-slate-200/80 shadow-xs">
                  {claimsCount.toLocaleString()}
                </span>
              </div>
            </li>

            <li>
              <div
                className={`sidebar-nav-item ${currentView === 'fraud' ? 'active' : ''}`}
                onClick={() => handleItemClick('fraud')}
              >
                <ShieldAlert className="w-4 h-4 mr-2.5 shrink-0" />
                <span className="flex-1 truncate">Fraud Detection</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-200/80 font-semibold">
                  {fraudCount} Flagged
                </span>
              </div>
            </li>

            <li>
              <div
                className={`sidebar-nav-item ${currentView === 'prediction' ? 'active' : ''}`}
                onClick={() => handleItemClick('prediction')}
              >
                <TrendingUp className="w-4 h-4 mr-2.5 shrink-0" />
                <span className="flex-1 truncate">Claims Prediction</span>
              </div>
            </li>

            <li>
              <div
                className={`sidebar-nav-item ${currentView === 'reports' ? 'active' : ''}`}
                onClick={() => handleItemClick('reports')}
              >
                <FileBarChart className="w-4 h-4 mr-2.5 shrink-0" />
                <span className="flex-1 truncate">Reports &amp; Insights</span>
              </div>
            </li>
          </ul>

          {/* System & Preferences */}
          <div className="mt-5 pt-4 border-t border-slate-200/60">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2.5">
              System &amp; Preferences
            </div>
            <ul className="space-y-0.5">
              <li>
                <div
                  className={`sidebar-nav-item ${currentView === 'settings' ? 'active' : ''}`}
                  onClick={() => handleItemClick('settings')}
                >
                  <Settings className="w-4 h-4 mr-2.5 shrink-0" />
                  <span className="flex-1 truncate">Settings</span>
                </div>
              </li>

              <li>
                <div
                  className={`sidebar-nav-item ${currentView === 'help' ? 'active' : ''}`}
                  onClick={() => handleItemClick('help')}
                >
                  <HelpCircle className="w-4 h-4 mr-2.5 shrink-0" />
                  <span className="flex-1 truncate">Help &amp; Support</span>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        {/* Bottom ML Model Health Widget */}
        <div className="p-3.5 border-t border-white/60">
          <div className="p-3 rounded-xl bg-white/75 backdrop-blur-md border border-white/90 shadow-2xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-600 font-medium text-[11px] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                ML Model Health
              </span>
              <span className="text-emerald-600 font-bold font-mono text-[11px]">99.8%</span>
            </div>
            <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
              <div className="bg-gradient-to-r from-[#00008b] to-emerald-500 h-full w-[99.8%] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5">
              <span>Latency: 28ms</span>
              <button
                onClick={() => handleItemClick('prediction')}
                className="text-[#00008b] font-semibold hover:underline"
              >
                Audits
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
