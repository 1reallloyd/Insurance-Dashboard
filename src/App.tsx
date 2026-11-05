import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UploadView } from './components/UploadView';
import { ClaimsView } from './components/ClaimsView';
import { FraudRadarView } from './components/FraudRadarView';
import { PredictionView } from './components/PredictionView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { HelpView } from './components/HelpView';
import { ClaimModal } from './components/ClaimModal';
import { ReportToast } from './components/ReportToast';
import { ClaimItem, DashboardMetrics, TrendData, ViewType } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [trendGranularity, setTrendGranularity] = useState<'monthly' | 'weekly' | 'quarterly'>(
    'monthly'
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; subtext?: string } | null>(null);

  // Initial Metrics State
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    kpis: {
      totalClaims: 1248,
      totalClaimsDisplay: '1,248',
      fraudCount: 87,
      amountSaved: 1482900,
      amountSavedDisplay: '$1.48M',
      predictedClaims: 1415,
      systemRiskScore: 6.8,
      activeReserveExposure: '$34.8M',
    },
    categoryDistribution: [
      { name: 'Auto', percentage: 35, color: '#00008b', amount: '$12.18M' },
      { name: 'Home', percentage: 25, color: '#3b82f6', amount: '$8.70M' },
      { name: 'Health', percentage: 20, color: '#10b981', amount: '$6.96M' },
      { name: 'Life', percentage: 15, color: '#f59e0b', amount: '$5.22M' },
      { name: 'Business', percentage: 5, color: '#ef4444', amount: '$1.74M' },
    ],
    modelHealth: {
      precision: '99.8%',
      latencyMs: 28,
      triangulationMethod: 'Chain Ladder (Mack Model)',
      liveTelematics: true,
    },
    auditLogs: [],
  });

  // Initial Trend State
  const [trendData, setTrendData] = useState<TrendData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    actual: [850, 920, 1020, 1100, 1150, 1200, 1248],
    predicted: [900, 950, 1050, 1120, 1180, 1230, 1290],
    subtitle: 'Last 7 months actuarial volume',
    label: 'Total Monthly Volume',
    metric: '+46.8% since Jan baseline',
  });

  // Claims List State
  const [claims, setClaims] = useState<ClaimItem[]>([]);

  // Fetch metrics from backend
  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/metrics');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (err) {
      console.error('Error fetching metrics:', err);
    }
  }, []);

  // Fetch trend data
  const fetchTrends = useCallback(async (gran: 'monthly' | 'weekly' | 'quarterly') => {
    try {
      const res = await fetch(`/api/trends?granularity=${gran}`);
      if (res.ok) {
        const data = await res.json();
        setTrendData(data);
      }
    } catch (err) {
      console.error('Error fetching trends:', err);
    }
  }, []);

  // Fetch claims list
  const fetchClaims = useCallback(async () => {
    try {
      const res = await fetch('/api/claims');
      if (res.ok) {
        const data = await res.json();
        setClaims(data.claims || []);
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
    fetchTrends(trendGranularity);
    fetchClaims();
  }, [fetchMetrics, fetchTrends, fetchClaims, trendGranularity]);

  // Handle Granularity Switch
  const handleGranularityChange = (gran: 'monthly' | 'weekly' | 'quarterly') => {
    setTrendGranularity(gran);
    fetchTrends(gran);
  };

  // Handle Refresh
  const handleRefreshMetrics = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchMetrics(), fetchTrends(trendGranularity), fetchClaims()]);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Metrics Refreshed', 'Synced with core policy ingestion feeds.');
    }, 600);
  };

  // Handle Claim Status Update (Approve)
  const handleClaimApprove = async (claimId: string) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Approved' }),
      });
      if (res.ok) {
        setClaims((prev) =>
          prev.map((c) => (c.id === claimId ? { ...c, status: 'Approved' } : c))
        );
        fetchMetrics();
        showToast(`Claim #${claimId} Approved`, 'Reserve ledger updated and disbursement queued.');
      }
    } catch (err) {
      console.error('Failed to approve claim:', err);
    }
  };

  // Handle Claim Freeze / Escalate to SIU
  const handleClaimFreeze = async (claimId: string) => {
    try {
      const res = await fetch(`/api/claims/${claimId}/freeze`, {
        method: 'POST',
      });
      if (res.ok) {
        setClaims((prev) =>
          prev.map((c) => (c.id === claimId ? { ...c, status: 'Frozen' } : c))
        );
        fetchMetrics();
        showToast(
          `Claim #${claimId} Frozen`,
          'Disbursement locked. Case dossier dispatched to SIU.'
        );
      }
    } catch (err) {
      console.error('Failed to freeze claim:', err);
    }
  };

  // Toast Helper
  const showToast = (message: string, subtext?: string) => {
    setToast({ message, subtext });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Handle Global Search from Header
  const handleGlobalSearch = (term: string) => {
    const q = term.toLowerCase().trim();
    if (!q) return;

    if (q.includes('claim')) {
      setCurrentView('claims');
      setSearchQuery(term);
    } else if (q.includes('fraud') || q.includes('risk') || q.includes('vin')) {
      setCurrentView('fraud');
    } else if (q.includes('upload') || q.includes('data') || q.includes('csv')) {
      setCurrentView('upload');
    } else if (q.includes('predict') || q.includes('model') || q.includes('scenario')) {
      setCurrentView('prediction');
    } else if (q.includes('report') || q.includes('solvency')) {
      setCurrentView('reports');
    } else if (q.includes('setting') || q.includes('config')) {
      setCurrentView('settings');
    } else if (q.includes('help') || q.includes('faq')) {
      setCurrentView('help');
    } else {
      setSearchQuery(term);
      setCurrentView('claims');
    }
  };

  return (
    <div className="glass-bg min-h-screen text-slate-800 flex flex-col h-screen overflow-hidden">
      {/* Frosted Glass Header */}
      <Header
        currentView={currentView}
        onNavigate={setCurrentView}
        onToggleMobileNav={() => setIsMobileNavOpen((prev) => !prev)}
        onGlobalSearch={handleGlobalSearch}
      />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onNavigate={setCurrentView}
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
          claimsCount={metrics.kpis.totalClaims}
          fraudCount={metrics.kpis.fraudCount}
        />

        {/* Dynamic Main Viewport with Relative Scaling */}
        <main className="flex-1 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6">
          <div className="max-w-7xl mx-auto w-full">
            {currentView === 'dashboard' && (
              <DashboardView
                metrics={metrics}
                trendData={trendData}
                trendGranularity={trendGranularity}
                onGranularityChange={handleGranularityChange}
                onRefreshMetrics={handleRefreshMetrics}
                isRefreshing={isRefreshing}
                onExportReport={(name) => showToast(`${name} Generated`, 'Compiled and saved to device.')}
                onNavigate={setCurrentView}
                onFilterCategory={(cat) => {
                  setSearchQuery(cat);
                  setCurrentView('claims');
                }}
              />
            )}

            {currentView === 'upload' && (
              <UploadView
                onDatasetUploaded={(fileName, count) => {
                  fetchMetrics();
                  fetchClaims();
                  showToast(
                    'Dataset Ingested Successfully',
                    `Parsed ${count} record(s) from ${fileName}.`
                  );
                }}
              />
            )}

            {currentView === 'claims' && (
              <ClaimsView
                claims={claims}
                onInspectClaim={(claim) => setSelectedClaim(claim)}
                initialSearchQuery={searchQuery}
                initialStatusFilter="all"
              />
            )}

            {currentView === 'fraud' && (
              <FraudRadarView
                onInspectClaim={(claim) => setSelectedClaim(claim)}
                onFreezePayout={handleClaimFreeze}
              />
            )}

            {currentView === 'prediction' && (
              <PredictionView
                onExportORSA={() =>
                  showToast(
                    'Scenario Model Exported',
                    'Dispatched to Enterprise Risk Management (ERM) system.'
                  )
                }
              />
            )}

            {currentView === 'reports' && (
              <ReportsView
                onDownloadReport={(name) =>
                  showToast(`${name} Downloaded`, 'Verified statutory ledger package ready.')
                }
              />
            )}

            {currentView === 'settings' && (
              <SettingsView
                onSettingsSaved={(msg) => showToast('Configuration Saved', msg)}
              />
            )}

            {currentView === 'help' && (
              <HelpView
                onTicketSubmitted={(msg) => showToast('Support Ticket Received', msg)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Claim Inspection / SIU Dossier Modal */}
      {selectedClaim && (
        <ClaimModal
          claim={selectedClaim}
          onClose={() => setSelectedClaim(null)}
          onApprove={handleClaimApprove}
          onEscalateSIU={handleClaimFreeze}
        />
      )}

      {/* Report / Action Toast Notification */}
      {toast && (
        <ReportToast
          message={toast.message}
          subtext={toast.subtext}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
