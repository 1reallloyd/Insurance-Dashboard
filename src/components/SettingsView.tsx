import React, { useState, useEffect } from 'react';
import { Settings2, Save, RotateCcw, Check, Sliders } from 'lucide-react';

interface SettingsViewProps {
  onSettingsSaved: (msg: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSettingsSaved }) => {
  const [fraudSensitivity, setFraudSensitivity] = useState('75% (Standard)');
  const [liveTelematics, setLiveTelematics] = useState(true);
  const [triangulationMethod, setTriangulationMethod] = useState('Chain Ladder (Mack Model)');
  const [autoBuffer, setAutoBuffer] = useState('15%');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.fraudSensitivity) setFraudSensitivity(data.fraudSensitivity);
        if (typeof data.liveTelematics === 'boolean') setLiveTelematics(data.liveTelematics);
        if (data.triangulationMethod) setTriangulationMethod(data.triangulationMethod);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fraudSensitivity,
          liveTelematics,
          triangulationMethod,
        }),
      });
      onSettingsSaved('Actuarial system configuration successfully saved!');
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFraudSensitivity('75% (Standard)');
    setLiveTelematics(true);
    setTriangulationMethod('Chain Ladder (Mack Model)');
    setAutoBuffer('15%');
    onSettingsSaved('Default actuarial parameters restored.');
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-5">
        <div className="border-b border-slate-200/70 pb-3 mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#00008b]">
            System Configuration &amp; Actuarial Engine
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Configure threshold sensitivity, telematics streaming, and mathematical triangulation methods.
          </p>
        </div>

        <div className="space-y-4 max-w-2xl">
          {/* Setting 1: Fraud Sensitivity */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/75 border border-white/90 gap-2.5">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Fraud Auto-Flagging Sensitivity Threshold
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Claims with anomaly confidence above this number are instantly locked from settlement.
              </p>
            </div>
            <select
              value={fraudSensitivity}
              onChange={(e) => setFraudSensitivity(e.target.value)}
              className="text-xs font-mono font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 text-[#00008b] outline-none shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <option value="85% (Strict)">85% (Strict)</option>
              <option value="75% (Standard)">75% (Standard)</option>
              <option value="65% (Sensitive)">65% (Sensitive)</option>
            </select>
          </div>

          {/* Setting 2: Live Telematics */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/75 border border-white/90">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">Live Telematics Sync</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Stream real-time vehicular telemetry into the loss triangle pipeline.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-3">
              <input
                type="checkbox"
                checked={liveTelematics}
                onChange={(e) => setLiveTelematics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00008b]"></div>
            </label>
          </div>

          {/* Setting 3: Triangulation Method */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/75 border border-white/90 gap-2.5">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Actuarial Loss Triangulation Method
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Algorithm applied to unresolved long-tail claims reserving.
              </p>
            </div>
            <select
              value={triangulationMethod}
              onChange={(e) => setTriangulationMethod(e.target.value)}
              className="text-xs font-semibold bg-slate-100 border-none rounded-lg px-3 py-1.5 text-slate-800 outline-none shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <option value="Chain Ladder (Mack Model)">Chain Ladder (Mack Model)</option>
              <option value="Bornhuetter-Ferguson">Bornhuetter-Ferguson</option>
              <option value="Cape Cod Method">Cape Cod Method</option>
            </select>
          </div>

          {/* Setting 4: Capital Reserve Buffer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-white/75 border border-white/90 gap-2.5">
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Statutory Capital Solvency Cushion
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mandatory surplus capital retention ratio above estimated ultimate loss.
              </p>
            </div>
            <select
              value={autoBuffer}
              onChange={(e) => setAutoBuffer(e.target.value)}
              className="text-xs font-mono font-bold bg-slate-100 border-none rounded-lg px-3 py-1.5 text-[#00008b] outline-none shadow-2xs self-start sm:self-auto cursor-pointer"
            >
              <option value="10%">10% (Minimal)</option>
              <option value="15%">15% (Recommended)</option>
              <option value="20%">20% (Conservative)</option>
            </select>
          </div>

          <div className="pt-3 flex gap-2.5">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#00008b] text-white text-xs font-bold hover:bg-[#000070] transition shadow-xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save System Settings'}</span>
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition shadow-2xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
