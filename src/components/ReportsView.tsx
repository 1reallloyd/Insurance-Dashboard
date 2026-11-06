import React, { useState } from 'react';
import { FileText, ShieldAlert, FileSpreadsheet, Download, Check, Sparkles } from 'lucide-react';

interface ReportsViewProps {
  onDownloadReport: (name: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onDownloadReport }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Full Year 2026 (YTD)');

  const handleDownload = (reportName: string, ext: string = 'pdf') => {
    // Generate real lightweight downloadable blob for user satisfaction
    const dummyContent = `INSURANCE ANALYTICS PRO - OFFICIAL ACTUARIAL REPORT
==================================================
Report Name: ${reportName}
Period: ${selectedPeriod}
Generated: ${new Date().toISOString()}
Status: Solvency Certified & SIU Audited (FY 2026)
--------------------------------------------------
Total Incurred Losses: GH₵34,800,000.00
Fraud Prevention Interceptions: GH₵1,482,900.00
Active Reserving Ratio: 112.4% (NAIC Class 1 Compliant)
==================================================`;

    const blob = new Blob([dummyContent], {
      type: ext === 'csv' ? 'text/csv' : 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    onDownloadReport(reportName);
  };

  return (
    <section className="space-y-2.5 sm:space-y-3">
      <div className="glass-card p-3 sm:p-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-slate-200/70 pb-2.5 mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#00008b]">
              Actuarial Reports &amp; Insights Repository (FY 2026)
            </h2>
            <p className="text-slate-600 text-xs mt-0.5">
              Download pre-audited statutory filings, executive board decks, and 2026 loss triangles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs bg-white/80 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none shadow-2xs font-medium cursor-pointer"
            >
              <option>Full Year 2026 (YTD)</option>
              <option>Q3 2026 Comprehensive</option>
              <option>Q2 2026 Retrospective</option>
              <option>FY 2025 Historical Benchmark</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Report Card 1 */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00008b] flex items-center justify-center text-base mb-2 shadow-2xs">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                Q3 2026 Actuarial Solvency Report
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Comprehensive capital adequacy, loss reserve triangles, and statutory risk metrics for FY 2026.
              </p>
              <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-400 font-mono">
                <span>PDF • 14.8 MB</span>
                <span>• Oct 2026</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('Q3 2026 Actuarial Solvency Report', 'pdf')}
              className="mt-3 w-full py-1.5 rounded-lg bg-[#00008b] hover:bg-[#000070] text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Report Card 2 */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#ef4444] flex items-center justify-center text-base mb-2 shadow-2xs">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                Fraud Interception &amp; SIU Audit (2026)
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Detailed forensics on 87 flagged claims with syndicate graph triangulation for 2026.
              </p>
              <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-400 font-mono">
                <span>PDF • 8.2 MB</span>
                <span>• Oct 2026</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('Fraud Interception & SIU Audit (2026)', 'pdf')}
              className="mt-3 w-full py-1.5 rounded-lg bg-slate-800 hover:bg-black text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Report Card 3 */}
          <div className="p-3 sm:p-3.5 rounded-xl bg-white/80 border border-slate-200/80 shadow-2xs hover:shadow-sm transition flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-base mb-2 shadow-2xs">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                Raw Actuarial Loss Run (FY 2026)
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Raw tabular loss ledger with policy numbers, bodily injury, and property damage reserves.
              </p>
              <div className="flex items-center gap-2 mt-2.5 text-[10px] text-slate-400 font-mono">
                <span>CSV • 42.1 MB</span>
                <span>• 2026 Live Sync</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('Raw Actuarial Loss Run Dump (2026)', 'csv')}
              className="mt-3 w-full py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
