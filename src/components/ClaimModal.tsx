import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Sparkles,
  User,
  DollarSign,
  AlertTriangle,
  Building,
  Gauge,
  MessageSquare,
  Send,
  Bot,
} from 'lucide-react';
import { ClaimItem } from '../types';

interface ClaimModalProps {
  claim: ClaimItem | null;
  onClose: () => void;
  onApprove: (claimId: string) => void;
  onEscalateSIU: (claimId: string) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({
  claim,
  onClose,
  onApprove,
  onEscalateSIU,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'copilot'>('details');
  const [aiReport, setAiReport] = useState<string | null>(claim?.aiAnalysis || null);
  const [aiSource, setAiSource] = useState<string>('gemini-3.8-flash');
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);

  // Copilot Q&A state
  const [copilotQuestion, setCopilotQuestion] = useState('');
  const [isAskingCopilot, setIsAskingCopilot] = useState(false);
  const [copilotChat, setCopilotChat] = useState<Array<{ q: string; a: string; source: string }>>([]);

  if (!claim) return null;

  const handleRunAIAnalysis = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/analyze-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId: claim.id }),
      });
      const data = await res.json();
      setAiReport(data.analysis);
      setAiSource(data.source);
      setActiveTab('ai');
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleAskCopilot = async (overrideQ?: string) => {
    const q = overrideQ || copilotQuestion;
    if (!q.trim()) return;

    setIsAskingCopilot(true);
    try {
      const res = await fetch('/api/ai/claim-copilot-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId: claim.id, question: q }),
      });
      const data = await res.json();
      setCopilotChat((prev: Array<{ q: string; a: string; source: string }>) => [
        { q, a: data.answer, source: data.source },
        ...prev,
      ]);
      setCopilotQuestion('');
    } catch (err) {
      console.error('Error asking copilot:', err);
    } finally {
      setIsAskingCopilot(false);
    }
  };

  const getStatusStyle = (status: ClaimItem['status']) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Review':
        return 'bg-blue-100 text-[#00008b] border-blue-200';
      case 'Flagged':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Frozen':
        return 'bg-slate-200 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-2xl border border-white/90 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Claim Badges */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-[#00008b]">
            #{claim.id}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyle(
              claim.status
            )}`}
          >
            {claim.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
          {claim.claimant}
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          {claim.line} • Incurred Loss Notice • Policy #{claim.policyNumber}
        </p>

        {/* Tab switch between Details, AI Forensic Analysis, and Copilot Q&A */}
        <div className="flex border-b border-slate-200 mb-3.5 flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 ${
              activeTab === 'details'
                ? 'border-[#00008b] text-[#00008b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Claim Dossier
          </button>
          <button
            onClick={() => {
              setActiveTab('ai');
              if (!aiReport && !isLoadingAI) {
                handleRunAIAnalysis();
              }
            }}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'border-[#00008b] text-[#00008b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#00008b]" />
            <span>AI Forensic Audit</span>
          </button>
          <button
            onClick={() => setActiveTab('copilot')}
            className={`pb-2 px-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 ${
              activeTab === 'copilot'
                ? 'border-[#00008b] text-[#00008b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Adjuster Copilot</span>
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 mb-4 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Claim Amount:</span>
              <span className="font-bold font-mono text-slate-900 text-sm">
                ${claim.claimAmount.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Incident Date:</span>
              <span className="font-mono text-slate-800">{claim.incidentDate}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Assigned Adjuster:</span>
              <span className="font-medium text-slate-800">{claim.adjuster}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Jurisdiction:</span>
              <span className="font-medium text-slate-800">{claim.jurisdiction}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="text-slate-500">Forensic Risk Score:</span>
              <span
                className={`font-bold ${
                  claim.fraudRiskScore >= 75
                    ? 'text-red-600'
                    : claim.fraudRiskScore >= 40
                    ? 'text-amber-600'
                    : 'text-emerald-600'
                }`}
              >
                {claim.fraudRiskScore}%{' '}
                {claim.fraudRiskScore >= 75
                  ? '— High Suspense'
                  : claim.fraudRiskScore >= 40
                  ? '— Moderate Risk'
                  : '— Within acceptable tolerance'}
              </span>
            </div>

            {claim.telematicsScore !== undefined && (
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-500">Telematics Sensor:</span>
                <span className="font-bold font-mono text-slate-800">
                  {claim.telematicsScore} / 100
                </span>
              </div>
            )}

            <div className="pt-1">
              <span className="text-slate-500 block mb-1">Description:</span>
              <p className="text-slate-700 bg-slate-50 p-2 rounded-lg text-[11px] leading-relaxed">
                {claim.description}
              </p>
            </div>

            {claim.flags && claim.flags.length > 0 && (
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Triggered Forensic Flags:</span>
                <div className="flex flex-wrap gap-1">
                  {claim.flags.map((flag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded text-[10px] bg-red-50 text-red-700 border border-red-200"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 mb-4 text-xs space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100 mb-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#00008b]" />
                Forensic Intelligence Dossier
              </span>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-[#00008b]">
                {aiSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Actuarial Engine'}
              </span>
            </div>

            {isLoadingAI ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-2">
                <Sparkles className="w-6 h-6 text-[#00008b] animate-spin" />
                <p className="text-xs text-slate-600 font-medium">
                  Querying Gemini 3.8 Flash Actuarial Engine...
                </p>
              </div>
            ) : aiReport ? (
              <div className="max-h-64 overflow-y-auto pr-1 text-slate-800 text-[11.5px] whitespace-pre-line leading-relaxed space-y-2">
                {aiReport}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-slate-500 text-xs mb-3">
                  Generate an instant forensic report with loss reserve recommendations.
                </p>
                <button
                  onClick={handleRunAIAnalysis}
                  className="px-4 py-2 rounded-xl bg-[#00008b] text-white text-xs font-bold hover:bg-[#000070] transition flex items-center gap-1.5 mx-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Run Gemini Actuarial Analysis</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'copilot' && (
          <div className="p-3.5 rounded-xl bg-white/80 border border-slate-200/80 mb-4 text-xs space-y-2.5">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5 text-xs">
                <Bot className="w-3.5 h-3.5 text-[#00008b]" />
                Interactive Adjuster Copilot
              </span>
              <span className="text-[10px] text-slate-400">Ask any question on this file</span>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'EUO deposition strategy?',
                'Subrogation recovery potential?',
                'Should we offer 50% settlement?',
                'Explain telematics delta',
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleAskCopilot(chip)}
                  disabled={isAskingCopilot}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-[#00008b] text-[10px] text-slate-600 border border-slate-200 transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Copilot Chat Log */}
            <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
              {copilotChat.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-3 text-center">
                  Select a prompt chip above or type a specific question about policy coverage, fraud signals, or subrogation.
                </p>
              ) : (
                copilotChat.map((item: { q: string; a: string; source: string }, idx: number) => (
                  <div key={idx} className="space-y-1 text-[11px]">
                    <div className="p-2 rounded-lg bg-blue-50 text-[#00008b] font-medium">
                      Q: {item.q}
                    </div>
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-700 whitespace-pre-line leading-relaxed border border-slate-100">
                      {item.a}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskCopilot();
              }}
              className="flex items-center gap-1.5 pt-1 border-t border-slate-100"
            >
              <input
                type="text"
                value={copilotQuestion}
                onChange={(e) => setCopilotQuestion(e.target.value)}
                placeholder="Ask Copilot about coverage, fraud, or reserves..."
                className="flex-1 text-xs px-3 py-1.5 rounded-xl border border-slate-200 outline-none focus:ring-1 focus:ring-[#00008b] bg-white"
              />
              <button
                type="submit"
                disabled={isAskingCopilot || !copilotQuestion.trim()}
                className="p-2 rounded-xl bg-[#00008b] text-white hover:bg-[#000070] disabled:opacity-50 transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Modal Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              onApprove(claim.id);
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approve Claim</span>
          </button>

          <button
            onClick={() => {
              onEscalateSIU(claim.id);
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-[#ef4444] hover:bg-red-700 text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Escalate to SIU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
