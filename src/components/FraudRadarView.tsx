import React, { useState } from 'react';
import {
  Radar,
  ShieldAlert,
  UserCheck,
  Stethoscope,
  Car,
  Lock,
  FileSearch,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { ClaimItem } from '../types';

interface FraudRadarViewProps {
  onInspectClaim: (claim: ClaimItem) => void;
  onFreezePayout: (claimId: string) => void;
}

export const FraudRadarView: React.FC<FraudRadarViewProps> = ({
  onInspectClaim,
  onFreezePayout,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    summary?: string;
    scannedAt?: string;
  } | null>(null);

  const sampleFlaggedClaims: ClaimItem[] = [
    {
      id: 'CA-2023-1245',
      claimant: 'Marcus Sterling',
      policyNumber: 'POL-COMM-4410',
      line: 'Commercial Fire',
      claimAmount: 185000,
      fraudRiskScore: 92,
      status: 'Flagged',
      incidentDate: '2023-10-15',
      filingDate: '2023-10-16',
      description:
        'Vehicle VIN reported in 3 simultaneous collision claims within 48 hours across separate jurisdictions.',
      adjuster: 'Amanda Chen (Special Investigation Unit)',
      deductible: 10000,
      telematicsScore: 12,
      jurisdiction: 'Miami-Dade, FL',
      flags: ['Duplicate VIN collision', 'Accelerant traces', 'Syndicate entity linked'],
    },
    {
      id: 'SPT-9921',
      claimant: 'Sunrise Physical Therapy Corp',
      policyNumber: 'POL-BI-BATCH-01',
      line: 'Bodily Injury Batch',
      claimAmount: 78400,
      fraudRiskScore: 79,
      status: 'Flagged',
      incidentDate: '2023-10-14',
      filingDate: '2023-10-17',
      description:
        'Excessive billing codes for duplicate soft-tissue ultrasound treatments without prior clinical referral.',
      adjuster: 'Amanda Chen (Special Investigation Unit)',
      deductible: 0,
      jurisdiction: 'Broward County, FL',
      flags: ['Unbundled CPT codes', 'Duplicate ultrasound billing', 'No referring physician'],
    },
    {
      id: 'CLM-1086',
      claimant: 'Lucas Henderson',
      policyNumber: 'POL-AUTO-7714',
      line: 'Auto Theft Total Loss',
      claimAmount: 54000,
      fraudRiskScore: 88,
      status: 'Flagged',
      incidentDate: '2023-10-19',
      filingDate: '2023-10-20',
      description:
        'Luxury German SUV total loss theft. Transponder ignition key audit indicates vehicle started with registered key while lender repossession threat was active.',
      adjuster: 'Amanda Chen (Special Investigation Unit)',
      deductible: 1500,
      telematicsScore: 24,
      jurisdiction: 'Hudson County, NJ',
      flags: ['Key-in-ignition transponder', 'No broken glass', 'Lender repossession warning active'],
    },
  ];

  const handleRunScan = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/ai/forensic-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-5">
        {/* Header & Scan Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#ef4444]">
                Neural Syndicate Radar v2
              </span>
              <span className="text-[10.5px] text-slate-400">87 Flagged In Suspense</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00008b] tracking-tight">
              AI Fraud Detection &amp; Forensic Audit
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Automated pattern matching, duplicate collision rings, and ghost clinic detection.
            </p>
          </div>

          <button
            onClick={handleRunScan}
            disabled={isScanning}
            className="px-3.5 py-2 rounded-xl bg-[#ef4444] hover:bg-red-700 text-white text-xs font-bold shadow-sm shadow-red-500/20 flex items-center gap-2 transition self-start md:self-auto active:scale-[0.98]"
          >
            <Radar className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning Actuarial Ledger...' : 'Run Full Forensic Scan'}</span>
          </button>
        </div>

        {/* Scan Results Banner (if available) */}
        {scanResult && (
          <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200 text-xs text-slate-800 animate-in fade-in duration-300">
            <div className="flex items-center justify-between font-bold text-[#00008b] mb-1.5 flex-wrap gap-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#00008b]" />
                AI Syndicate &amp; Forensic Audit Completed
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-[#00008b] border border-blue-200">
                  {(scanResult as any).source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'SIU Rules Engine'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-normal">
                  {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
            <div className="text-slate-700 text-[11.5px] whitespace-pre-line leading-relaxed space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {scanResult.summary}
            </div>
          </div>
        )}

        {/* 3 Fraud Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <div className="p-3.5 rounded-xl bg-red-50/80 border border-red-200/90">
            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
              Loss Prevention Prevented
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#ef4444] mt-0.5 tabular-nums">
              $1,482,900
            </div>
            <p className="text-[10.5px] text-slate-600 mt-0.5">
              Saved across 87 intercepted false claims this month.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/90">
            <span className="text-[10px] text-[#a855f7] font-bold uppercase tracking-wider">
              Organized Syndicate Rings
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#a855f7] mt-0.5 tabular-nums">
              3 Rings Identified
            </div>
            <p className="text-[10.5px] text-slate-600 mt-0.5">
              Recurrent bodily injury clinics identified in South FL &amp; NJ.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/90">
            <span className="text-[10px] text-[#00008b] font-bold uppercase tracking-wider">
              False Positive Rate
            </span>
            <div className="text-xl sm:text-2xl font-extrabold text-[#00008b] mt-0.5 tabular-nums">
              0.42%
            </div>
            <p className="text-[10.5px] text-slate-600 mt-0.5">
              Validated by third-party Special Investigation Unit.
            </p>
          </div>
        </div>

        {/* Priority Interception Queue */}
        <h4 className="text-xs font-bold text-[#00008b] uppercase tracking-wider mb-2.5">
          Priority Interception Queue
        </h4>

        <div className="space-y-2.5">
          {sampleFlaggedClaims.map((claim) => (
            <div
              key={claim.id}
              className="p-3.5 rounded-xl bg-white/85 border border-slate-200/80 hover:border-red-200 flex flex-col md:flex-row md:items-center justify-between gap-3 transition shadow-2xs"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                    claim.fraudRiskScore >= 90
                      ? 'bg-red-100 text-[#ef4444]'
                      : 'bg-amber-100 text-[#eab308]'
                  }`}
                >
                  {claim.line.includes('Fire') || claim.line.includes('Commercial') ? (
                    <Car className="w-4 h-4" />
                  ) : claim.line.includes('Bodily') ? (
                    <Stethoscope className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {claim.claimant} — Claim #{claim.id}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded-full text-[9.5px] font-extrabold ${
                        claim.fraudRiskScore >= 90
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.fraudRiskScore}% Risk Score
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Reason: {claim.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => onFreezePayout(claim.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#ef4444] hover:bg-red-700 text-white font-bold text-[11px] transition flex items-center gap-1 shadow-2xs"
                >
                  <Lock className="w-3 h-3" />
                  <span>Freeze Payout</span>
                </button>

                <button
                  onClick={() => onInspectClaim(claim)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-50 transition flex items-center gap-1 shadow-2xs"
                >
                  <FileSearch className="w-3 h-3 text-slate-500" />
                  <span>SIU Dossier</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
