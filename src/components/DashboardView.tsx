import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  TrendingUp,
  AlertCircle,
  RotateCw,
  Download,
  ArrowUp,
  ArrowDown,
  Equal,
  Upload,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { DashboardMetrics, TrendData, ViewType } from '../types';
import {
  ClaimsDistributionChart,
  ClaimsTrendChart,
  ActualVsPredictedChart,
} from './Charts';

interface DashboardViewProps {
  metrics: DashboardMetrics;
  trendData: TrendData;
  trendGranularity: 'monthly' | 'weekly' | 'quarterly';
  onGranularityChange: (g: 'monthly' | 'weekly' | 'quarterly') => void;
  onRefreshMetrics: () => void;
  isRefreshing: boolean;
  onExportReport: (name: string) => void;
  onNavigate: (view: ViewType) => void;
  onFilterCategory?: (cat: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  trendData,
  trendGranularity,
  onGranularityChange,
  onRefreshMetrics,
  isRefreshing,
  onExportReport,
  onNavigate,
  onFilterCategory,
}) => {
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('Just now');

  const handleRefreshClick = () => {
    onRefreshMetrics();
    setLastRefreshedTime(
      `Just now (${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})`
    );
  };

  return (
    <section className="space-y-2.5 sm:space-y-3">
      {/* Welcome Banner Glass Card */}
      <div className="glass-card p-3 sm:p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-2xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Engines Operational
            </span>
            <span className="text-[10.5px] text-slate-500">
              FY 2026 · Updated {lastRefreshedTime}
            </span>
          </div>

          <h1 className="text-base sm:text-lg font-bold text-[#00008b] tracking-tight">
            Welcome, Admin User!
          </h1>
          <p className="text-slate-600 text-xs mt-0.5">
            FY 2026 actuarial loss development, portfolio distributions, and forensic interception queues.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="px-2.5 py-1.5 rounded-lg bg-white/85 hover:bg-white text-slate-700 hover:text-[#00008b] border border-slate-200/80 text-xs font-medium flex items-center gap-1.5 transition shadow-2xs active:scale-[0.98]"
          >
            <RotateCw
              className={`w-3.5 h-3.5 text-[#00008b] ${isRefreshing ? 'animate-spin' : ''}`}
            />
            <span>Refresh 2026 Metrics</span>
          </button>

          <button
            onClick={() => onExportReport('Executive Actuarial Solvency Brief (FY 2026)')}
            className="px-2.5 py-1.5 rounded-lg bg-[#00008b] hover:bg-[#000070] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition active:scale-[0.98]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export 2026 PDF</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards with refined scaling & reduced bold weights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {/* KPI 1: Total Claims */}
        <div
          onClick={() => onNavigate('claims')}
          className="glass-card kpi-card-blue p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group hover:border-[#00008b]/40 transition"
        >
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h3 className="text-slate-500 font-medium text-[10.5px] uppercase tracking-wider">
                Total Claims
              </h3>
              <p className="text-[10.5px] text-slate-400">Oct 2026 Active</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00008b] shadow-2xs">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#00008b] tracking-tight tabular-nums mb-0.5">
              {metrics.kpis.totalClaimsDisplay}
            </div>
            <div className="flex items-center text-emerald-600 text-[11px] font-medium">
              <ArrowUp className="w-3 h-3 mr-0.5" />
              <span>+12% vs Sep 2026</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Fraud Detected */}
        <div
          onClick={() => onNavigate('fraud')}
          className="glass-card kpi-card-red p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group hover:border-red-300 transition"
        >
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h3 className="text-slate-500 font-medium text-[10.5px] uppercase tracking-wider">
                Fraud Intercepted
              </h3>
              <p className="text-[10.5px] text-slate-400">FY 2026 YTD</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-[#ef4444] shadow-2xs">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="text-lg sm:text-xl font-bold text-[#00008b] tracking-tight tabular-nums">
                {metrics.kpis.fraudCount}
              </span>
              <span className="text-xs text-[#ef4444] font-semibold">
                ({metrics.kpis.amountSavedDisplay} saved)
              </span>
            </div>
            <div className="flex items-center text-emerald-600 text-[11px] font-medium">
              <ArrowDown className="w-3 h-3 mr-0.5" />
              <span>-5% vs Sep 2026</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Predicted Claims */}
        <div
          onClick={() => onNavigate('prediction')}
          className="glass-card kpi-card-purple p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group hover:border-purple-300 transition"
        >
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h3 className="text-slate-500 font-medium text-[10.5px] uppercase tracking-wider">
                Predicted Claims
              </h3>
              <p className="text-[10.5px] text-slate-400">Nov 2026 Forecast</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-[#a855f7] shadow-2xs">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-[#00008b] tracking-tight tabular-nums mb-0.5">
              {metrics.kpis.predictedClaims.toLocaleString()}
            </div>
            <div className="flex items-center text-emerald-600 text-[11px] font-medium">
              <ArrowUp className="w-3 h-3 mr-0.5" />
              <span>+8% vs Oct 2026</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Risk Score */}
        <div
          onClick={() => onNavigate('fraud')}
          className="glass-card kpi-card-yellow p-3 sm:p-3.5 flex flex-col justify-between cursor-pointer group hover:border-amber-300 transition"
        >
          <div className="flex justify-between items-start mb-1.5">
            <div>
              <h3 className="text-slate-500 font-medium text-[10.5px] uppercase tracking-wider">
                Risk Score
              </h3>
              <p className="text-[10.5px] text-slate-400">2026 Portfolio</p>
            </div>
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-[#eab308] shadow-2xs">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-lg sm:text-xl font-bold text-[#00008b] tracking-tight tabular-nums">
                {metrics.kpis.systemRiskScore}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ 10</span>
            </div>
            <div className="flex items-center text-slate-500 text-[11px] font-medium">
              <Equal className="w-3 h-3 mr-0.5" />
              <span>Stable in 2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section Grid with compact heights & reduced headers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-3">
        {/* Chart 1: Claims Distribution Doughnut */}
        <div className="lg:col-span-5 glass-card p-3 sm:p-3.5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#00008b] tracking-tight">
                Claims Distribution (FY 2026)
              </h3>
              <p className="text-[10.5px] text-slate-500">By business line breakdown</p>
            </div>
            <span className="text-[11px] font-mono font-semibold text-[#00008b] bg-blue-50/90 px-1.5 py-0.5 rounded border border-blue-200/80 shadow-2xs">
              Total: $34.8M
            </span>
          </div>

          <ClaimsDistributionChart
            onCategoryClick={(cat) => {
              if (onFilterCategory) onFilterCategory(cat);
              onNavigate('claims');
            }}
          />

          {/* Category Breakdown Badges */}
          <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-200/70 text-xs">
            {metrics.categoryDistribution.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  if (onFilterCategory) onFilterCategory(item.name);
                  onNavigate('claims');
                }}
                className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/70 border border-slate-200/70 shadow-2xs hover:bg-white transition text-left"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 text-[10.5px] truncate">
                  {item.name} <strong className="text-slate-900 ml-0.5">{item.percentage}%</strong>
                </span>
              </button>
            ))}

            <button
              onClick={() => onNavigate('claims')}
              className="flex items-center justify-center text-[10px] text-[#00008b] font-semibold hover:underline"
            >
              Drilldown →
            </button>
          </div>
        </div>

        {/* Chart 2: Claims Trend Line Chart */}
        <div className="lg:col-span-7 glass-card p-3 sm:p-3.5 flex flex-col justify-between">
          <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#00008b] tracking-tight">
                Claims Trend &amp; Velocity
              </h3>
              <p className="text-[10.5px] text-slate-500">{trendData.subtitle}</p>
            </div>

            {/* Granularity Switcher */}
            <div className="flex items-center bg-white/80 p-0.5 rounded-lg border border-slate-200/70 text-xs shadow-2xs">
              {(['monthly', 'weekly', 'quarterly'] as const).map((gran) => (
                <button
                  key={gran}
                  onClick={() => onGranularityChange(gran)}
                  className={`px-2 py-0.5 rounded capitalize transition text-[10.5px] ${
                    trendGranularity === gran
                      ? 'bg-[#00008b] text-white font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 font-medium'
                  }`}
                >
                  {gran}
                </button>
              ))}
            </div>
          </div>

          <ClaimsTrendChart
            labels={trendData.labels}
            data={trendData.actual}
            labelName={trendData.label}
          />

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/70 mt-1.5">
            <span className="flex items-center gap-1.5 text-[10.5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00008b]"></span>
              <span className="font-medium text-slate-700">{trendData.label}</span>
            </span>
            <span className="text-emerald-600 font-mono font-semibold text-[10.5px]">
              {trendData.metric}
            </span>
          </div>
        </div>
      </div>

      {/* Chart 3: Actual vs Predicted Claims */}
      <div className="glass-card p-3 sm:p-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#00008b] tracking-tight">
              Actual vs Predicted Claims (FY 2025 – 2026)
            </h3>
            <p className="text-[10.5px] text-slate-500">Actuarial predictive model comparison with full annual baseline</p>
          </div>

          <div className="flex items-center gap-2.5 text-xs">
            <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-slate-200/70 shadow-2xs">
              <span className="w-2 h-2 rounded bg-[#00008b]"></span>
              <span className="text-slate-700 font-medium text-[10.5px]">Actual Claims</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded border border-slate-200/70 shadow-2xs">
              <span className="w-2 h-2 rounded bg-[#3b82f6]"></span>
              <span className="text-slate-700 font-medium text-[10.5px]">Predicted Claims</span>
            </div>
          </div>
        </div>

        <ActualVsPredictedChart
          labels={trendData.labels}
          actual={trendData.actual}
          predicted={trendData.predicted}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="glass-card p-3 sm:p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-[#00008b] tracking-tight">
              Recent Activity &amp; Audit Logs (2026)
            </h3>
            <p className="text-[10.5px] text-slate-500">System audit and claims intake ledger events for FY 2026</p>
          </div>
          <button
            onClick={() => onNavigate('reports')}
            className="text-xs font-semibold text-[#00008b] hover:underline flex items-center gap-1"
          >
            <span>View All 2026 Logs</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Event 1 */}
          <div
            onClick={() => onNavigate('upload')}
            className="p-2.5 rounded-lg bg-white/80 border border-slate-200/70 hover:bg-white transition flex items-start space-x-2.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-[#00008b] shrink-0">
              <Upload className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                New dataset uploaded
              </p>
              <p className="text-[10.5px] text-slate-500 truncate">Auto claims loss runs for Q3 2026</p>
              <span className="inline-block text-[9.5px] font-mono text-slate-400 mt-0.5">
                2 hours ago · Oct 2026
              </span>
            </div>
          </div>

          {/* Event 2 */}
          <div
            onClick={() => onNavigate('fraud')}
            className="p-2.5 rounded-lg bg-white/80 border border-slate-200/70 hover:bg-white transition flex items-start space-x-2.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-red-50 border border-red-100 flex items-center justify-center text-[#ef4444] shrink-0">
              <ShieldAlert className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Potential fraud detected
              </p>
              <p className="text-[10.5px] text-slate-500 truncate">Claim #CA-2026-1245 flagged</p>
              <span className="inline-block text-[9.5px] font-mono text-slate-400 mt-0.5">
                5 hours ago · Oct 2026
              </span>
            </div>
          </div>

          {/* Event 3 */}
          <div
            onClick={() => onNavigate('settings')}
            className="p-2.5 rounded-lg bg-white/80 border border-slate-200/70 hover:bg-white transition flex items-start space-x-2.5 shadow-2xs cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-md bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                Model weights calibrated
              </p>
              <p className="text-[10.5px] text-slate-500 truncate">Actuarial Core v3.2 (2026 Release)</p>
              <span className="inline-block text-[9.5px] font-mono text-slate-400 mt-0.5">
                Yesterday · 2026
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
