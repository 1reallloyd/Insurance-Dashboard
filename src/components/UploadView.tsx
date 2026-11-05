import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface UploadViewProps {
  onDatasetUploaded: (fileName: string, recordCount: number) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onDatasetUploaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [recentUploads, setRecentUploads] = useState([
    {
      id: '#CLM-98214',
      line: 'Commercial Auto',
      date: '2023-10-18',
      amount: '$14,800.00',
      deductible: '$1,000.00',
      telematics: '89 / 100',
      telematicsColor: 'text-emerald-600',
      validation: 'Passed',
      validationType: 'success',
    },
    {
      id: '#CLM-98215',
      line: 'Homeowners Fire',
      date: '2023-10-19',
      amount: '$82,450.00',
      deductible: '$2,500.00',
      telematics: 'N/A',
      telematicsColor: 'text-slate-400',
      validation: 'Passed',
      validationType: 'success',
    },
    {
      id: '#CLM-98216',
      line: 'Personal Auto',
      date: '2023-10-21',
      amount: '$6,120.00',
      deductible: '$500.00',
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
            amount: '$22,400.00',
            deductible: '$2,500.00',
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

  const handleSampleLoad = () => {
    simulateUploadProcess('sample_actuarial_loss_q3_iso20022.csv');
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/70 pb-3.5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100/80 text-[#00008b]">
                Dataset Ingestion Engine
              </span>
              <span className="text-[10.5px] text-slate-400">Schema: Actuarial ISO 20022</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00008b]">
              Upload Actuarial Datasets
            </h2>
            <p className="text-slate-600 text-xs mt-0.5">
              Ingest claims loss runs, exposure matrices, and telematics logs for ML inference.
            </p>
          </div>

          <button
            onClick={handleSampleLoad}
            className="px-3.5 py-1.5 rounded-xl bg-white text-[#00008b] border border-blue-200/90 text-xs font-semibold hover:bg-blue-50 transition shadow-2xs flex items-center gap-1.5 self-start md:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Load Q3 Sample Dataset</span>
          </button>
        </div>

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
                  <th className="p-2.5 sm:p-3">Incurred Loss</th>
                  <th className="p-2.5 sm:p-3">Deductible</th>
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
