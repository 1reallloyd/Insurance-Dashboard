import React, { useState } from 'react';
import { FileText, ShieldAlert, FileSpreadsheet, Download, Check, Sparkles } from 'lucide-react';

interface ReportsViewProps {
  onDownloadReport: (name: string) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onDownloadReport }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('Year-to-Date (2023)');

  const handleDownload = (reportName: string, ext: string = 'pdf') => {
    // Generate real lightweight downloadable blob for user satisfaction
    const dummyContent = `INSURANCE ANALYTICS PRO - OFFICIAL ACTUARIAL REPORT
==================================================
Report Name: ${reportName}
Period: ${selectedPeriod}
Generated: ${new Date().toISOString()}
Status: Solvency Certified & SIU Audited
--------------------------------------------------
Total Incurred Losses: $34,800,000.00
Fraud Prevention Interceptions: $1,482,900.00
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
    <section className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/70 pb-3 mb-4 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00008b]">
              Actuarial Reports &amp; Insights Repository
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
              Download pre-audited statutory filings, executive board decks, and loss triangles.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs bg-white/80 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 outline-none shadow-2xs font-medium cursor-pointer"
            >
              <option>Year-to-Date (2023)</option>
              <option>Q3 Comprehensive</option>
              <option>Q2 Retrospective</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {/* Report Card 1 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#00008b] flex items-center justify-center text-lg mb-3 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Q3 Actuarial Solvency Report
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Comprehensive capital adequacy, loss reserve triangles, and statutory risk metrics.
              </p>
              <div className="flex items-center gap-2 mt-3 text-[10.5px] text-slate-400 font-mono">
                <span>PDF • 14.8 MB</span>
                <span>• Oct 2023</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('Q3 Actuarial Solvency Report', 'pdf')}
              className="mt-4 w-full py-2 rounded-xl bg-[#00008b] hover:bg-[#000070] text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>

          {/* Report Card 2 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-red-50 text-[#ef4444] flex items-center justify-center text-lg mb-3 shadow-2xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Fraud Interception &amp; SIU Audit
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Detailed forensics on 87 flagged claims with syndicate graph triangulation.
              </p>
              <div className="flex items-center gap-2 mt-3 text-[10.5px] text-slate-400 font-mono">
                <span>PDF • 8.2 MB</span>
                <span>• Oct 2023</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('Fraud Interception & SIU Audit', 'pdf')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-black text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Report Card 3 */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/80 border border-white/90 shadow-2xs hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg mb-3 shadow-2xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Raw Actuarial Loss Run Dump
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Raw tabular dataset with policy numbers, bodily injury, and property damage reserves.
              </p>
              <div className="flex items-center gap-2 mt-3 text-[10.5px] text-slate-400 font-mono">
                <span>CSV • 42.1 MB</span>
                <span>• Live Sync</span>
              </div>
            </div>

            <button
              onClick={() => handleDownload('Raw Actuarial Loss Run Dump', 'csv')}
              className="mt-4 w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-2xs"
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
