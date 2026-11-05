import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldAlert, CheckCircle2, Clock, Lock } from 'lucide-react';
import { ClaimItem } from '../types';

interface ClaimsViewProps {
  claims: ClaimItem[];
  onInspectClaim: (claim: ClaimItem) => void;
  initialSearchQuery?: string;
  initialStatusFilter?: string;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({
  claims,
  onInspectClaim,
  initialSearchQuery = '',
  initialStatusFilter = 'all',
}) => {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesStatus =
        statusFilter === 'all' ||
        claim.status.toLowerCase() === statusFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        claim.id.toLowerCase().includes(q) ||
        claim.claimant.toLowerCase().includes(q) ||
        claim.line.toLowerCase().includes(q) ||
        claim.policyNumber.toLowerCase().includes(q) ||
        claim.jurisdiction.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [claims, statusFilter, searchQuery]);

  const flaggedCount = useMemo(() => {
    return claims.filter((c) => c.status === 'Flagged' || c.status === 'Frozen').length;
  }, [claims]);

  const getRiskBadge = (score: number) => {
    if (score >= 80) {
      return (
        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-rose-50 text-[#ef4444] border border-rose-200">
          Critical ({score}%)
        </span>
      );
    }
    if (score >= 50) {
      return (
        <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-amber-50 text-[#eab308] border border-amber-200">
          Moderate ({score}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10.5px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
        Low ({score}%)
      </span>
    );
  };

  const getStatusBadge = (status: ClaimItem['status']) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-700 flex items-center gap-1 w-fit">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'Review':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-100/90 text-[#00008b] flex items-center gap-1 w-fit">
            <Clock className="w-3 h-3" />
            In Review
          </span>
        );
      case 'Flagged':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-rose-100/90 text-rose-700 flex items-center gap-1 w-fit">
            <ShieldAlert className="w-3 h-3" />
            Flagged
          </span>
        );
      case 'Frozen':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-200 text-slate-800 flex items-center gap-1 w-fit">
            <Lock className="w-3 h-3" />
            Frozen Payout
          </span>
        );
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-5">
        {/* Header & Status Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00008b] tracking-tight">
              Claims Management &amp; Adjudication
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Review, investigate, and approve active insurance claims across all lines.
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-slate-500 mr-1 hidden sm:inline">Filter:</span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'all'
                  ? 'bg-[#00008b] text-white shadow-2xs'
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              All ({claims.length})
            </button>
            <button
              onClick={() => setStatusFilter('Approved')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'Approved'
                  ? 'bg-[#00008b] text-white shadow-2xs'
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setStatusFilter('Review')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'Review'
                  ? 'bg-[#00008b] text-white shadow-2xs'
                  : 'bg-white/80 hover:bg-white text-slate-700'
              }`}
            >
              In Review
            </button>
            <button
              onClick={() => setStatusFilter('Flagged')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === 'Flagged'
                  ? 'bg-[#00008b] text-white shadow-2xs'
                  : 'bg-white/80 hover:bg-white text-rose-600'
              }`}
            >
              Flagged ({flaggedCount})
            </button>
          </div>
        </div>

        {/* Search & Counter Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3.5">
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search claim #, policyholder, type..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white/80 border border-white/90 rounded-xl focus:ring-2 focus:ring-[#00008b]/20 outline-none shadow-2xs"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredClaims.length}</span> claims
          </div>
        </div>

        {/* High-density Claims Table */}
        <div className="overflow-x-auto rounded-xl border border-white/90 bg-white/70">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/90 text-slate-600 font-semibold uppercase text-[10.5px] border-b border-slate-200">
              <tr>
                <th className="p-3">Claim ID</th>
                <th className="p-3">Policyholder</th>
                <th className="p-3">Policy Line</th>
                <th className="p-3">Claim Amount</th>
                <th className="p-3">Fraud Risk</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    No insurance claims matched the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-white/90 transition group cursor-pointer"
                    onClick={() => onInspectClaim(claim)}
                  >
                    <td className="p-3 font-bold font-mono text-[#00008b] text-[11.5px]">
                      #{claim.id}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{claim.claimant}</td>
                    <td className="p-3 text-slate-600">{claim.line}</td>
                    <td
                      className={`p-3 font-mono font-bold tabular-nums ${
                        claim.claimAmount > 50000 ? 'text-red-600' : 'text-slate-900'
                      }`}
                    >
                      ${claim.claimAmount.toLocaleString()}
                    </td>
                    <td className="p-3">{getRiskBadge(claim.fraudRiskScore)}</td>
                    <td className="p-3">{getStatusBadge(claim.status)}</td>
                    <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {claim.status === 'Flagged' || claim.status === 'Frozen' ? (
                        <button
                          onClick={() => onInspectClaim(claim)}
                          className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-semibold text-[11px] shadow-2xs transition"
                        >
                          Investigate
                        </button>
                      ) : (
                        <button
                          onClick={() => onInspectClaim(claim)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#00008b] text-[#00008b] font-semibold text-[11px] shadow-2xs transition"
                        >
                          Inspect
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
