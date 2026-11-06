import React, { useState, useEffect } from 'react';
import {
  Calculator,
  FileUp,
  RefreshCw,
  TrendingUp,
  CloudLightning,
  Percent,
  TrendingDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { SimulationResult } from '../types';

interface PredictionViewProps {
  onExportORSA: () => void;
}

export const PredictionView: React.FC<PredictionViewProps> = ({ onExportORSA }) => {
  const [weatherIndex, setWeatherIndex] = useState(1.2);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [growthPct, setGrowthPct] = useState(8);

  const [simResult, setSimResult] = useState<SimulationResult['results']>({
    projectedFrequency: 1415,
    simulatedLossIncurred: 'GH₵37.2M',
    simulatedLossNumber: 37.2,
    lossDiffPercentage: '+6.9% vs Baseline Target',
    recommendedBuffer: 'GH₵41.5M in liquid reinsurance retention',
    solvencyRating: 'Solvent & Stable',
  });

  // Call simulation endpoint or calculate dynamically
  useEffect(() => {
    const runSimulation = async () => {
      try {
        const res = await fetch('/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            weatherCatastropheIndex: weatherIndex,
            inflationRate,
            policyGrowthPct: growthPct,
          }),
        });
        const data = await res.json();
        if (data.results) {
          setSimResult(data.results);
        }
      } catch (err) {
        // Fallback local formula
        const baseClaims = 1415;
        const baseLoss = 34.8;
        const projFreq = Math.round(
          baseClaims * (1 + (growthPct / 100) * 0.6) * (1 + (weatherIndex - 1) * 0.15)
        );
        const projLoss = Number(
          (
            baseLoss *
            (1 + inflationRate / 100) *
            (1 + (weatherIndex - 1) * 0.25) *
            (1 + (growthPct / 100) * 0.3)
          ).toFixed(1)
        );
        const diff = (((projLoss - baseLoss) / baseLoss) * 100).toFixed(1);
        setSimResult({
          projectedFrequency: projFreq,
          simulatedLossIncurred: `GH₵${projLoss}M`,
          simulatedLossNumber: projLoss,
          lossDiffPercentage: `+${diff}% vs Baseline Target`,
          recommendedBuffer: `GH₵${(projLoss * 1.12).toFixed(1)}M in liquid reinsurance retention`,
          solvencyRating: projLoss > 42 ? 'Moderate Stress' : 'Solvent & Stable',
        });
      }
    };

    runSimulation();
  }, [weatherIndex, inflationRate, growthPct]);

  const handleResetDefaults = () => {
    setWeatherIndex(1.2);
    setInflationRate(4.5);
    setGrowthPct(8);
  };

  const [isGeneratingNarrative, setIsGeneratingNarrative] = useState(false);
  const [scenarioNarrative, setScenarioNarrative] = useState<string | null>(null);
  const [narrativeSource, setNarrativeSource] = useState<string | null>(null);

  const handleGenerateAINarrative = async () => {
    setIsGeneratingNarrative(true);
    try {
      const res = await fetch('/api/ai/scenario-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weatherFactor: weatherIndex,
          inflationFactor: inflationRate,
          growthFactor: growthPct,
          simulatedLoss: simResult.simulatedLossIncurred,
          frequency: simResult.projectedFrequency,
        }),
      });
      const data = await res.json();
      setScenarioNarrative(data.narrative);
      setNarrativeSource(data.source);
    } catch (err) {
      console.error('Failed to generate AI scenario narrative:', err);
    } finally {
      setIsGeneratingNarrative(false);
    }
  };

  return (
    <section className="space-y-2.5 sm:space-y-3">
      <div className="glass-card p-3 sm:p-3.5">
        <div className="border-b border-slate-200/70 pb-2.5 mb-3 sm:mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#00008b]">
                Actuarial Loss Forecaster &amp; Scenario Simulator (FY 2026 – 2027)
              </h2>
              <p className="text-slate-600 text-xs mt-0.5">
                Simulate loss reserves under varying macro-economic and catastrophe stress conditions for FY 2026 / 2027.
              </p>
            </div>
            <button
              onClick={handleGenerateAINarrative}
              disabled={isGeneratingNarrative}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00008b] to-blue-700 text-white text-xs font-semibold hover:opacity-95 transition shadow-2xs flex items-center gap-1.5 self-start sm:self-auto active:scale-[0.98]"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGeneratingNarrative ? 'animate-spin' : ''}`} />
              <span>{isGeneratingNarrative ? 'Evaluating Models...' : 'AI Stress Assessment'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Controls / Sliders (Left) */}
          <div className="lg:col-span-5 space-y-3 bg-white/60 p-3 sm:p-3.5 rounded-lg border border-slate-200/80">
            <h4 className="text-[11px] font-semibold text-[#00008b] uppercase tracking-wider">
              Actuarial Stress Parameters (2026 Base)
            </h4>

            {/* Slider 1: Weather Catastrophe */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <CloudLightning className="w-3.5 h-3.5 text-blue-600" />
                  Weather Catastrophe Severity
                </span>
                <span className="font-mono text-[#00008b] font-bold">
                  {weatherIndex.toFixed(1)}x {weatherIndex > 1.8 ? '(Severe)' : '(Normal)'}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={weatherIndex}
                onChange={(e) => setWeatherIndex(parseFloat(e.target.value))}
                className="w-full accent-[#00008b] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>0.5x (Calm)</span>
                <span>1.2x (2026 Baseline)</span>
                <span>3.0x (Catastrophic)</span>
              </div>
            </div>

            {/* Slider 2: Inflation Rate */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-amber-600" />
                  Medical &amp; Parts Inflation Rate
                </span>
                <span className="font-mono text-[#00008b] font-bold">
                  {inflationRate.toFixed(1)}%
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="15.0"
                step="0.5"
                value={inflationRate}
                onChange={(e) => setInflationRate(parseFloat(e.target.value))}
                className="w-full accent-[#00008b] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>1.0% (Deflationary)</span>
                <span>4.5% (2026 Target)</span>
                <span>15.0% (Stress)</span>
              </div>
            </div>

            {/* Slider 3: Policy Exposure Growth */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  Policy Exposure Growth
                </span>
                <span className="font-mono text-[#00008b] font-bold">
                  {growthPct >= 0 ? '+' : ''}
                  {growthPct}%
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="30"
                step="1"
                value={growthPct}
                onChange={(e) => setGrowthPct(parseInt(e.target.value))}
                className="w-full accent-[#00008b] cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>-10% (Run-off)</span>
                <span>+8% (2026 Target)</span>
                <span>+30% (Aggressive)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <button
                onClick={handleResetDefaults}
                className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3 text-slate-500" />
                <span>Reset 2026 Baseline Defaults</span>
              </button>
            </div>
          </div>

          {/* Simulated Projections Output (Right) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="glass-panel p-3 rounded-lg border border-slate-200/70">
                <span className="text-[10.5px] text-slate-500 font-medium block">
                  Simulated Loss Incurred (2026/2027)
                </span>
                <div className="text-base sm:text-lg font-bold text-[#00008b] mt-0.5 tabular-nums">
                  {simResult.simulatedLossIncurred}
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
                  {simResult.lossDiffPercentage}
                </span>
              </div>

              <div className="glass-panel p-3 rounded-lg border border-slate-200/70">
                <span className="text-[10.5px] text-slate-500 font-medium block">
                  Projected Claim Frequency
                </span>
                <div className="text-base sm:text-lg font-bold text-[#00008b] mt-0.5 tabular-nums">
                  {simResult.projectedFrequency.toLocaleString()}
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Expected Nov 2026 intake
                </span>
              </div>
            </div>

            {/* AI Generated Scenario Narrative (if requested) */}
            {scenarioNarrative ? (
              <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200/90 text-xs text-slate-800 animate-in fade-in duration-200">
                <div className="flex items-center justify-between font-bold text-[#00008b] mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#00008b]" />
                    AI Actuarial Stress Evaluation
                  </span>
                  <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-[#00008b] border border-blue-200">
                    {narrativeSource === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Actuarial Model Engine'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {scenarioNarrative}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-blue-50/75 border border-blue-200/90 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-[#00008b] flex items-center gap-1.5 text-xs">
                  <Calculator className="w-3.5 h-3.5 text-[#00008b]" />
                  Actuarial Reserve Recommendation:
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Based on Monte Carlo iterations (N=10,000), capital buffer recommends maintaining{' '}
                  <strong className="text-slate-900">{simResult.recommendedBuffer}</strong> to satisfy
                  statutory NAIC/Solvency II thresholds.
                </p>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={onExportORSA}
                className="px-4 py-2 rounded-xl bg-[#00008b] hover:bg-[#000070] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <FileUp className="w-3.5 h-3.5" />
                <span>Export Scenario Model to ORSA Filing</span>
              </button>

              {!scenarioNarrative && (
                <button
                  onClick={handleGenerateAINarrative}
                  disabled={isGeneratingNarrative}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-[#00008b] text-[#00008b] text-xs font-semibold transition flex items-center justify-center gap-1.5 w-full sm:w-auto"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingNarrative ? 'Analyzing...' : 'Run Copilot Commentary'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
