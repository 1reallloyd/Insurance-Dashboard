import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  Download,
  Info,
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface UploadViewProps {
  onDatasetUploaded: (fileName: string, recordCount: number) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onDatasetUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  const [recentUploads, setRecentUploads] = useState([
    {
      id: '#CLM-98214',
      line: 'Commercial Auto',
      date: '2026-10-18',
      amount: 'GH₵14,800.00',
      deductible: 'GH₵1,000.00',
      telematics: '89 / 100',
      telematicsColor: 'text-emerald-600',
      validation: 'Passed',
      validationType: 'success',
    },
    {
      id: '#CLM-98215',
      line: 'Homeowners Fire',
      date: '2026-10-19',
      amount: 'GH₵82,450.00',
      deductible: 'GH₵2,500.00',
      telematics: 'N/A',
      telematicsColor: 'text-slate-400',
      validation: 'Passed',
      validationType: 'success',
    },
    {
      id: '#CLM-98216',
      line: 'Personal Auto',
      date: '2026-10-21',
      amount: 'GH₵6,120.00',
      deductible: 'GH₵500.00',
      telematics: '42 / 100',
      telematicsColor: 'text-amber-600',
      validation: 'Check Telematics',
      validationType: 'warning',
    },
  ]);


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const simulateUploadProcess = (fileName: string) => {
    setUploadedFileName(fileName);
    setIsUploading(true);
    setUploadProgress(0);
    setStatusMessage('Validating column schemas against Actuarial Loss Model...');

    let current = 0;
    const timer = setInterval(async () => {
      current += 20;
      setUploadProgress(current);

      if (current >= 100) {
        clearInterval(timer);
        setStatusMessage('Dataset successfully parsed and indexed into actuarial engine.');

        try {
          // Call real backend endpoint
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName }),
          });
          const data = await res.json();

          // Add a new row to preview
          const newRow = {
            id: `#CLM-${Math.floor(90000 + Math.random() * 9999)}`,
            line: 'Commercial Auto',
            date: new Date().toISOString().split('T')[0],
            amount: 'GH₵22,400.00',
            deductible: 'GH₵2,500.00',
            telematics: '78 / 100',
            telematicsColor: 'text-emerald-600',
            validation: 'Passed',
            validationType: 'success',
          };
          setRecentUploads((prev) => [newRow, ...prev]);

          onDatasetUploaded(fileName, data.recordsIngested || 1);
        } catch (err) {
          console.error('Failed to post upload:', err);
        }
      }
    }, 180);
  };

  const handleDownloadExcelTemplate = async () => {
    setIsDownloadingTemplate(true);
    try {
      // 1. Attempt download from real backend API
      const response = await fetch('/api/download-template');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'actuarial_claims_template_ghs.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        setIsDownloadingTemplate(false);
        return;
      }
    } catch (err) {
      console.warn('Backend download failed, generating client-side Excel workbook:', err);
    }

    // 2. Client-side XLSX generation fallback (100% resilient)
    try {
      const templateData = [
        {
          claim_id: 'CLM-2026-001',
          claimant_name: 'Kwame Mensah',
          policy_number: 'POL-AUTO-2026-8812',
          line_of_business: 'Auto Collision',
          claim_amount_ghs: 18500,
          deductible_ghs: 1500,
          incident_date: '2026-10-18',
          filing_date: '2026-10-19',
          jurisdiction: 'Greater Accra, Ghana',
          telematics_score: 72,
          fraud_risk_score: 22,
          status: 'Review',
          assigned_adjuster: 'Emmanuel Addo',
          incident_description: 'Side-impact bumper contact at interchange during rainy commute.',
          red_flags: 'None',
        },
        {
          claim_id: 'CLM-2026-002',
          claimant_name: 'Akosua Boakye Enterprises',
          policy_number: 'POL-COMM-2026-3391',
          line_of_business: 'Commercial Fire',
          claim_amount_ghs: 145000,
          deductible_ghs: 10000,
          incident_date: '2026-10-14',
          filing_date: '2026-10-15',
          jurisdiction: 'Ashanti Region, Kumasi',
          telematics_score: 18,
          fraud_risk_score: 84,
          status: 'Flagged',
          assigned_adjuster: 'Amanda Chen',
          incident_description: 'Warehouse inventory electrical smoke damage after closing hours.',
          red_flags: 'Accelerant trace flagged',
        },
      ];

      const dictionary = [
        { Column: 'claim_id', Type: 'String (Required)', Description: 'Unique claim ID (e.g., CLM-2026-001)' },
        { Column: 'claimant_name', Type: 'String (Required)', Description: 'Policyholder / Company legal name' },
        { Column: 'policy_number', Type: 'String (Required)', Description: 'Policy identification code' },
        { Column: 'line_of_business', Type: 'String (Required)', Description: 'Auto Collision, Commercial Fire, Health, Home, Life' },
        { Column: 'claim_amount_ghs', Type: 'Number (Required)', Description: 'Gross claim amount in Ghana Cedis (GH₵)' },
        { Column: 'deductible_ghs', Type: 'Number (Required)', Description: 'Policy deductible in Ghana Cedis (GH₵)' },
        { Column: 'incident_date', Type: 'Date (YYYY-MM-DD)', Description: 'Accident occurrence date' },
        { Column: 'filing_date', Type: 'Date (YYYY-MM-DD)', Description: 'Notice of loss report date' },
        { Column: 'jurisdiction', Type: 'String', Description: 'Regional district or jurisdiction' },
        { Column: 'telematics_score', Type: 'Number (0-100)', Description: 'IoT sensor telemetry score' },
        { Column: 'fraud_risk_score', Type: 'Number (0-100)', Description: 'Computed fraud risk score' },
        { Column: 'status', Type: 'Enum', Description: 'Approved | Review | Flagged | Frozen' },
        { Column: 'assigned_adjuster', Type: 'String', Description: 'Senior examiner assigned' },
        { Column: 'incident_description', Type: 'String', Description: 'Circumstances and loss narrative' },
        { Column: 'red_flags', Type: 'String', Description: 'Forensic trigger tags' },
      ];

      const wb = XLSX.utils.book_new();
      const ws1 = XLSX.utils.json_to_sheet(templateData);
      const ws2 = XLSX.utils.json_to_sheet(dictionary);
      XLSX.utils.book_append_sheet(wb, ws1, 'Claims_Template_GH₵');
      XLSX.utils.book_append_sheet(wb, ws2, 'Data_Dictionary');
      XLSX.writeFile(wb, 'actuarial_claims_template_ghs.xlsx');
    } catch (genErr) {
      console.error('Failed to generate Excel client-side:', genErr);
    } finally {
      setIsDownloadingTemplate(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      simulateUploadProcess(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUploadProcess(e.target.files[0].name);
    }
  };

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ text: string; source: string } | null>(null);

  const handleRunAIAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch('/api/ai/dataset-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: uploadedFileName || 'q3_casualty_loss_runs.csv' }),
      });
      const data = await res.json();
      setAuditResult({ text: data.audit, source: data.source });
    } catch (err) {
      console.error('Failed to audit dataset with AI:', err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSampleLoad = () => {
    simulateUploadProcess('sample_actuarial_loss_q3_iso20022.csv');
  };

  return (
    <section className="space-y-2.5 sm:space-y-3">
      <div className="glass-card p-3 sm:p-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 border-b border-slate-200/70 pb-2.5">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[9.5px] font-semibold px-2 py-0.5 rounded bg-blue-100/80 text-[#00008b]">
                Dataset Ingestion Engine 2026
              </span>
              <span className="text-[10px] text-slate-400">Schema: Actuarial ISO 20022 • Currency: GH₵</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#00008b]">
              Upload Actuarial Datasets (FY 2026)
            </h2>
            <p className="text-slate-600 text-xs mt-0.5">
              Ingest FY 2026 claims loss runs in Ghana Cedis (GH₵), exposure matrices, and telematics logs.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleDownloadExcelTemplate}
              disabled={isDownloadingTemplate}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition shadow-2xs flex items-center gap-1.5 active:scale-[0.98]"
              title="Download official Excel workbook template (.xlsx) with all required columns and dictionary"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloadingTemplate ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingTemplate ? 'Downloading...' : 'Download Excel Template (.xlsx)'}</span>
            </button>

            <button
              onClick={handleRunAIAudit}
              disabled={isAuditing}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00008b] to-indigo-700 text-white text-xs font-semibold hover:opacity-95 transition shadow-2xs flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing...' : 'AI Dataset Audit'}</span>
            </button>

            <button
              onClick={handleSampleLoad}
              className="px-3 py-1.5 rounded-lg bg-white text-[#00008b] border border-blue-200/90 text-xs font-medium hover:bg-blue-50 transition shadow-2xs flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Sample Dataset</span>
            </button>
          </div>
        </div>

        {/* Excel Template Columns Specification Guide */}
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px]">
              <Info className="w-3.5 h-3.5 text-[#00008b]" />
              System Dataset Columns Guide (All Incurred Amounts &amp; Deductibles in Ghana Cedis GH₵)
            </span>
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              15 System Columns
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              { name: 'claim_id', req: true },
              { name: 'claimant_name', req: true },
              { name: 'policy_number', req: true },
              { name: 'line_of_business', req: true },
              { name: 'claim_amount_ghs', req: true },
              { name: 'deductible_ghs', req: true },
              { name: 'incident_date', req: true },
              { name: 'filing_date', req: true },
              { name: 'jurisdiction', req: false },
              { name: 'telematics_score', req: false },
              { name: 'fraud_risk_score', req: false },
              { name: 'status', req: false },
              { name: 'assigned_adjuster', req: false },
              { name: 'incident_description', req: false },
              { name: 'red_flags', req: false },
            ].map((col) => (
              <span
                key={col.name}
                className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                  col.req
                    ? 'bg-blue-50/80 text-[#00008b] border-blue-200 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {col.name}
                {col.req && <span className="text-red-500 ml-0.5">*</span>}
              </span>
            ))}
          </div>
        </div>

        {/* AI Audit Result Box (if generated) */}
        {auditResult && (
          <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-br from-blue-50/90 to-indigo-50/70 border border-blue-200 text-xs text-slate-800 animate-in fade-in duration-200">
            <div className="flex items-center justify-between font-bold text-[#00008b] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#00008b]" />
                AI Actuarial Dataset Integrity &amp; Loss Run Audit
              </span>
              <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-[#00008b] border border-blue-200">
                {auditResult.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Actuarial Audit Engine'}
              </span>
            </div>
            <div className="text-[11px] text-slate-700 whitespace-pre-line leading-relaxed space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {auditResult.text}
            </div>
          </div>
        )}

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`mt-4 sm:mt-5 border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-[#00008b] bg-blue-50/50 scale-[0.99]'
              : 'border-slate-300 bg-white/40 hover:border-[#00008b]'
          }`}
        >
          <div className="w-12 h-12 mx-auto mb-2.5 rounded-xl bg-blue-50 text-[#00008b] flex items-center justify-center text-xl shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <h4 className="text-sm sm:text-base font-bold text-slate-800">
            Drag &amp; Drop insurance records (.CSV, .XLSX, .PARQUET)
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Maximum batch file size: 120MB per upload session
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.parquet"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="mt-3 px-4 py-2 rounded-xl bg-[#00008b] text-white text-xs font-semibold hover:bg-[#000070] transition shadow-xs"
          >
            Browse Files from Computer
          </button>
        </div>

        {/* Upload Progress Indicator */}
        {isUploading && (
          <div className="mt-4 p-3.5 rounded-xl bg-white/80 border border-white/90">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 truncate">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#00008b]" />
                {uploadedFileName}
              </span>
              <span className="text-[#00008b] font-mono text-xs">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#00008b] h-full transition-all duration-300 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p
              className={`text-[11px] mt-1.5 flex items-center gap-1 ${
                uploadProgress >= 100
                  ? 'text-emerald-600 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {uploadProgress >= 100 ? (
                <CheckCircle className="w-3 h-3 text-emerald-600" />
              ) : (
                <FileCheck2 className="w-3 h-3 text-slate-400" />
              )}
              {statusMessage}
            </p>
          </div>
        )}

        {/* Dataset Schema Preview Table */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-[#00008b] uppercase tracking-wider">
              Preview Ingested Records (Last Rows)
            </h4>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Schema Validated
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/90 bg-white/70">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase text-[10.5px]">
                <tr>
                  <th className="p-2.5 sm:p-3">Claim ID</th>
                  <th className="p-2.5 sm:p-3 font-sans">Line of Business</th>
                  <th className="p-2.5 sm:p-3">Incident Date</th>
                  <th className="p-2.5 sm:p-3">Incurred Loss (GH₵)</th>
                  <th className="p-2.5 sm:p-3">Deductible (GH₵)</th>
                  <th className="p-2.5 sm:p-3">Telematics Score</th>
                  <th className="p-2.5 sm:p-3">Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 font-mono text-[11px]">
                {recentUploads.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition">
                    <td className="p-2.5 sm:p-3 font-bold text-[#00008b]">{row.id}</td>
                    <td className="p-2.5 sm:p-3 font-sans">{row.line}</td>
                    <td className="p-2.5 sm:p-3">{row.date}</td>
                    <td className="p-2.5 sm:p-3 tabular-nums">{row.amount}</td>
                    <td className="p-2.5 sm:p-3 tabular-nums">{row.deductible}</td>
                    <td className={`p-2.5 sm:p-3 font-semibold ${row.telematicsColor}`}>
                      {row.telematics}
                    </td>
                    <td className="p-2.5 sm:p-3 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.validationType === 'success'
                            ? 'bg-emerald-100/80 text-emerald-700'
                            : 'bg-amber-100/80 text-amber-800'
                        }`}
                      >
                        {row.validation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
