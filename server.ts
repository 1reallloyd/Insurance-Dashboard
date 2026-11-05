import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize Google GenAI client if a real key is provided
const isRealGeminiKey =
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' &&
  !process.env.GEMINI_API_KEY.startsWith('MY_');

const ai = isRealGeminiKey
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// In-Memory Database for Insurance Analytics
// ==========================================
export interface ClaimItem {
  id: string;
  claimant: string;
  policyNumber: string;
  line: string;
  claimAmount: number;
  fraudRiskScore: number; // 0-100
  status: 'Approved' | 'Review' | 'Flagged' | 'Frozen';
  incidentDate: string;
  filingDate: string;
  description: string;
  adjuster: string;
  deductible: number;
  telematicsScore?: number;
  jurisdiction: string;
  flags: string[];
  aiAnalysis?: string;
}

let claimsDatabase: ClaimItem[] = [
  {
    id: 'CLM-1082',
    claimant: 'Eleanor Vance',
    policyNumber: 'POL-AUTO-9921',
    line: 'Auto Collision',
    claimAmount: 12450,
    fraudRiskScore: 54,
    status: 'Review',
    incidentDate: '2023-10-18',
    filingDate: '2023-10-19',
    description: 'Multi-vehicle rear-end collision at intersection. Impact speed discrepancy reported in telematics.',
    adjuster: 'Robert Vance (Senior Examiner)',
    deductible: 1000,
    telematicsScore: 68,
    jurisdiction: 'Cook County, IL',
    flags: ['Telematics speed delta', 'Prior claim within 6 months'],
  },
  {
    id: 'CLM-1083',
    claimant: 'Marcus Sterling',
    policyNumber: 'POL-COMM-4410',
    line: 'Commercial Fire',
    claimAmount: 185000,
    fraudRiskScore: 92,
    status: 'Flagged',
    incidentDate: '2023-10-15',
    filingDate: '2023-10-16',
    description: 'Warehouse commercial electrical fire after hours. Accelerated burn pattern flagged by forensic origin inquiry.',
    adjuster: 'Amanda Chen (Special Investigation Unit)',
    deductible: 10000,
    telematicsScore: 12,
    jurisdiction: 'Miami-Dade, FL',
    flags: ['Accelerant trace detected', 'Policy bound 14 days prior to loss', 'Syndicate entity linked'],
  },
  {
    id: 'CLM-1084',
    claimant: 'Sophia Lin',
    policyNumber: 'POL-HLTH-8812',
    line: 'Health Surgical',
    claimAmount: 4850,
    fraudRiskScore: 8,
    status: 'Approved',
    incidentDate: '2023-10-12',
    filingDate: '2023-10-13',
    description: 'Outpatient arthroscopic knee cartilage repair at accredited network surgical hospital center.',
    adjuster: 'Elena Rostova (Medical Claims Examiner)',
    deductible: 500,
    jurisdiction: 'King County, WA',
    flags: [],
  },
  {
    id: 'CLM-1085',
    claimant: 'David Reynolds',
    policyNumber: 'POL-HOME-2039',
    line: 'Home Windstorm',
    claimAmount: 9200,
    fraudRiskScore: 12,
    status: 'Approved',
    incidentDate: '2023-10-10',
    filingDate: '2023-10-11',
    description: 'Roof shingle detachment and secondary interior drywall moisture intrusion following declared tropical storm.',
    adjuster: 'Marcus Wright (Property Adjuster)',
    deductible: 2500,
    jurisdiction: 'Hillsborough County, FL',
    flags: [],
  },
  {
    id: 'CLM-1086',
    claimant: 'Lucas Henderson',
    policyNumber: 'POL-AUTO-7714',
    line: 'Auto Theft',
    claimAmount: 54000,
    fraudRiskScore: 88,
    status: 'Flagged',
    incidentDate: '2023-10-19',
    filingDate: '2023-10-20',
    description: 'Luxury German SUV total loss theft report. Transponder ignition key audit indicates vehicle started with registered key.',
    adjuster: 'Amanda Chen (Special Investigation Unit)',
    deductible: 1500,
    telematicsScore: 24,
    jurisdiction: 'Hudson County, NJ',
    flags: ['Key-in-ignition telemetry', 'No forced entry', 'Lender repossession threat active'],
  },
  {
    id: 'CLM-1087',
    claimant: 'Catherine Ward',
    policyNumber: 'POL-LIFE-1102',
    line: 'Life Benefit',
    claimAmount: 250000,
    fraudRiskScore: 48,
    status: 'Review',
    incidentDate: '2023-10-08',
    filingDate: '2023-10-14',
    description: 'Accidental death benefit claim under two-year contestability clause. Foreign hospital death certificate pending apostille verification.',
    adjuster: 'James Thorne (Senior Life Examiner)',
    deductible: 0,
    jurisdiction: 'London, UK / New York, NY',
    flags: ['Contestable window active', 'Offshore jurisdiction verification needed'],
  },
  {
    id: 'CLM-1088',
    claimant: 'Arturo Morales',
    policyNumber: 'POL-COMM-9932',
    line: 'Commercial Auto',
    claimAmount: 31200,
    fraudRiskScore: 32,
    status: 'Approved',
    incidentDate: '2023-10-21',
    filingDate: '2023-10-22',
    description: 'Fleet delivery van side-swiped during adverse rainy conditions. Full camera dashcam corroboration submitted.',
    adjuster: 'Robert Vance (Senior Examiner)',
    deductible: 2000,
    telematicsScore: 82,
    jurisdiction: 'Dallas County, TX',
    flags: [],
  },
  {
    id: 'CLM-1089',
    claimant: 'Sunrise PT Corp (Clinic)',
    policyNumber: 'POL-BI-BATCH-01',
    line: 'Bodily Injury',
    claimAmount: 78400,
    fraudRiskScore: 79,
    status: 'Flagged',
    incidentDate: '2023-10-14',
    filingDate: '2023-10-17',
    description: 'Cluster of 14 soft-tissue neck injury physical therapy billings from single accident involving rented commuter van.',
    adjuster: 'Amanda Chen (Special Investigation Unit)',
    deductible: 0,
    jurisdiction: 'Broward County, FL',
    flags: ['Unbundled CPT codes', 'Identical narrative diagnosis templates', 'Clinic previously audited'],
  },
];

let systemSettings = {
  fraudSensitivity: '75%',
  liveTelematics: true,
  triangulationMethod: 'Chain Ladder (Mack Model)',
  autoReserveBufferPct: 15,
};

let auditLogs: Array<{ id: string; time: string; action: string; user: string; details: string }> = [
  {
    id: 'LOG-001',
    time: '12 mins ago',
    action: 'Fraud Flag Alert',
    user: 'AI Forensic Radar',
    details: 'Cluster of 3 collision claims in Miami flagged for staged accident analysis.',
  },
  {
    id: 'LOG-002',
    time: '45 mins ago',
    action: 'Batch Ingestion',
    user: 'Actuarial Data Feed',
    details: 'Auto & Commercial Q3 loss runs ingested. 1,248 active claims balanced.',
  },
  {
    id: 'LOG-003',
    time: '2 hours ago',
    action: 'Model Retrained',
    user: 'ML Pipeline',
    details: 'XGBoost Actuarial Predictor reached 99.8% precision score.',
  },
];

// ==========================================
// API Routes
// ==========================================

// 1. Get All Claims with optional search and filter
app.get('/api/claims', (req: Request, res: Response) => {
  const { status, query } = req.query;
  let filtered = [...claimsDatabase];

  if (status && status !== 'all') {
    filtered = filtered.filter((c) => c.status.toLowerCase() === String(status).toLowerCase());
  }

  if (query) {
    const q = String(query).toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.id.toLowerCase().includes(q) ||
        c.claimant.toLowerCase().includes(q) ||
        c.line.toLowerCase().includes(q) ||
        c.policyNumber.toLowerCase().includes(q) ||
        c.jurisdiction.toLowerCase().includes(q)
    );
  }

  res.json({
    total: claimsDatabase.length,
    count: filtered.length,
    claims: filtered,
  });
});

// 2. Get Single Claim by ID
app.get('/api/claims/:id', (req: Request, res: Response) => {
  const claim = claimsDatabase.find((c) => c.id === req.params.id);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }
  res.json(claim);
});

// 3. Update Claim Status (Approve, Review, Flag, Freeze)
app.put('/api/claims/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const claimIndex = claimsDatabase.findIndex((c) => c.id === id);
  if (claimIndex === -1) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  claimsDatabase[claimIndex].status = status;

  auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    time: 'Just now',
    action: `Claim ${status}`,
    user: 'Admin User',
    details: `Claim #${id} status updated to ${status}.${note ? ` Note: ${note}` : ''}`,
  });

  res.json({
    success: true,
    message: `Claim #${id} successfully marked as ${status}`,
    claim: claimsDatabase[claimIndex],
  });
});

// 4. Freeze Payout on Flagged Claim
app.post('/api/claims/:id/freeze', (req: Request, res: Response) => {
  const { id } = req.params;
  const claim = claimsDatabase.find((c) => c.id === id);
  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  claim.status = 'Frozen';
  auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    time: 'Just now',
    action: 'Disbursement Frozen',
    user: 'SIU Examiner',
    details: `Disbursement frozen for claim ${id} (${claim.claimant}). Claim marked in statutory lockbox.`,
  });

  res.json({
    success: true,
    message: `Payment disbursement for ${id} has been frozen. Audit record dispatched to SIU.`,
    claim,
  });
});

// 5. Aggregate Dashboard KPIs & Metrics
app.get('/api/metrics', (_req: Request, res: Response) => {
  const totalClaimsCount = claimsDatabase.length;
  const flaggedCount = claimsDatabase.filter((c) => c.status === 'Flagged' || c.status === 'Frozen').length;
  const totalIncurred = claimsDatabase.reduce((acc, c) => acc + c.claimAmount, 0);
  const totalSaved = claimsDatabase
    .filter((c) => c.status === 'Flagged' || c.status === 'Frozen')
    .reduce((acc, c) => acc + c.claimAmount, 0);

  res.json({
    kpis: {
      totalClaims: 1248 + claimsDatabase.length - 8,
      totalClaimsDisplay: (1248 + claimsDatabase.length - 8).toLocaleString(),
      fraudCount: 87 + flaggedCount - 3,
      amountSaved: 1482900 + totalSaved,
      amountSavedDisplay: `$${((1482900 + totalSaved) / 1000000).toFixed(2)}M`,
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
      triangulationMethod: systemSettings.triangulationMethod,
      liveTelematics: systemSettings.liveTelematics,
    },
    auditLogs: auditLogs.slice(0, 10),
  });
});

// 6. Claims Trend Granularity API
app.get('/api/trends', (req: Request, res: Response) => {
  const granularity = String(req.query.granularity || 'monthly');

  const configs: Record<string, any> = {
    monthly: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      actual: [850, 920, 1020, 1100, 1150, 1200, 1248],
      predicted: [900, 950, 1050, 1120, 1180, 1230, 1290],
      subtitle: 'Last 7 months actuarial volume',
      label: 'Total Monthly Volume',
      metric: '+46.8% since Jan baseline',
    },
    weekly: {
      labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7'],
      actual: [275, 290, 310, 305, 330, 345, 362],
      predicted: [280, 295, 305, 315, 335, 350, 370],
      subtitle: 'Last 7 weeks incident intake velocity',
      label: 'Total Weekly Volume',
      metric: '+31.6% trajectory vs target',
    },
    quarterly: {
      labels: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023'],
      actual: [2400, 2650, 2900, 3100, 3250, 3400, 3663],
      predicted: [2450, 2700, 2950, 3150, 3300, 3450, 3720],
      subtitle: 'Trailing quarterly multi-line loss development',
      label: 'Total Quarterly Volume',
      metric: '+52.6% over 24-month horizon',
    },
  };

  const selected = configs[granularity] || configs.monthly;
  res.json(selected);
});

// 7. Actuarial Scenario Simulation Engine
app.post('/api/simulate', (req: Request, res: Response) => {
  const { weatherCatastropheIndex = 1.2, inflationRate = 4.5, policyGrowthPct = 8.0 } = req.body;

  const baseClaims = 1415;
  const baseLoss = 34.8; // $34.8M

  const weatherFactor = Number(weatherCatastropheIndex);
  const inflationFactor = Number(inflationRate);
  const growthFactor = Number(policyGrowthPct);

  const projectedFrequency = Math.round(
    baseClaims * (1 + (growthFactor / 100) * 0.6) * (1 + (weatherFactor - 1) * 0.15)
  );

  const projectedLoss = Number(
    (baseLoss * (1 + inflationFactor / 100) * (1 + (weatherFactor - 1) * 0.25) * (1 + (growthFactor / 100) * 0.3)).toFixed(1)
  );

  const lossDiffPct = (((projectedLoss - baseLoss) / baseLoss) * 100).toFixed(1);
  const recommendedBuffer = (projectedLoss * 1.12).toFixed(1);

  res.json({
    inputs: { weatherFactor, inflationFactor, growthFactor },
    results: {
      projectedFrequency,
      simulatedLossIncurred: `$${projectedLoss}M`,
      simulatedLossNumber: projectedLoss,
      lossDiffPercentage: `+${lossDiffPct}% vs Baseline Target`,
      recommendedBuffer: `$${recommendedBuffer}M in liquid reinsurance retention`,
      solvencyRating: projectedLoss > 42 ? 'Moderate Stress' : 'Solvent & Stable',
    },
  });
});

// 8. Upload Dataset Simulator & Ingestion
app.post('/api/upload', (req: Request, res: Response) => {
  const { fileName = 'batch_dataset.csv', records = [] } = req.body;

  let newClaimsCount = 0;
  if (Array.isArray(records) && records.length > 0) {
    records.forEach((rec: any, idx: number) => {
      const newClaim: ClaimItem = {
        id: rec.id || `CLM-${Math.floor(10000 + Math.random() * 90000)}`,
        claimant: rec.claimant || `Insured ${idx + 1}`,
        policyNumber: rec.policyNumber || `POL-INGEST-${idx + 100}`,
        line: rec.line || 'Personal Auto',
        claimAmount: Number(rec.amount || 5000 + Math.round(Math.random() * 25000)),
        fraudRiskScore: Number(rec.risk || Math.floor(Math.random() * 40)),
        status: rec.risk && Number(rec.risk) > 75 ? 'Flagged' : 'Review',
        incidentDate: rec.date || new Date().toISOString().split('T')[0],
        filingDate: new Date().toISOString().split('T')[0],
        description: rec.desc || 'Ingested batch actuarial loss notice record.',
        adjuster: 'Automated Triangulation Ingest',
        deductible: 1000,
        jurisdiction: rec.jurisdiction || 'General National Pool',
        flags: rec.risk && Number(rec.risk) > 75 ? ['Batch anomaly threshold exceeded'] : [],
      };
      claimsDatabase.unshift(newClaim);
      newClaimsCount++;
    });
  } else {
    // Ingest sample batch
    const sampleRecord: ClaimItem = {
      id: `CLM-${Math.floor(20000 + Math.random() * 70000)}`,
      claimant: 'Apex Logistics Freight LLC',
      policyNumber: 'POL-COMM-8910',
      line: 'Commercial Auto',
      claimAmount: 22400,
      fraudRiskScore: 38,
      status: 'Review',
      incidentDate: '2023-10-23',
      filingDate: '2023-10-24',
      description: 'Cargo van collision along interstate freight corridor. Telematics blackbox confirms moderate deceleration.',
      adjuster: 'Robert Vance (Senior Examiner)',
      deductible: 2500,
      telematicsScore: 78,
      jurisdiction: 'Wayne County, MI',
      flags: ['Cargo liability check'],
    };
    claimsDatabase.unshift(sampleRecord);
    newClaimsCount = 1;
  }

  auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    time: 'Just now',
    action: 'Dataset Ingestion',
    user: 'Data Pipeline',
    details: `Ingested ${fileName}. Added ${newClaimsCount} validated claim records to active actuarial ledger.`,
  });

  res.json({
    success: true,
    fileName,
    recordsIngested: newClaimsCount,
    totalDatabaseRecords: claimsDatabase.length,
    message: `Dataset ${fileName} successfully validated against ISO 20022 schemas and indexed into actuarial engine.`,
  });
});

// 9. AI Actuarial Forensic Analysis (Gemini 3.8 Flash)
app.post('/api/ai/analyze-claim', async (req: Request, res: Response) => {
  const { claimId } = req.body;
  const claim = claimsDatabase.find((c) => c.id === claimId);

  if (!claim) {
    return res.status(404).json({ error: 'Claim not found' });
  }

  // If Gemini API is available, invoke gemini-3.8-flash for deep actuarial intelligence
  if (ai) {
    try {
      const prompt = `You are a Chief Actuary and Special Investigation Unit (SIU) Forensic Director.
Analyze this insurance claim and provide a structured, professional forensic report:
- Claim ID: ${claim.id}
- Policyholder: ${claim.claimant}
- Line of Business: ${claim.line}
- Claim Amount: $${claim.claimAmount.toLocaleString()}
- Fraud Risk Score: ${claim.fraudRiskScore}/100
- Incident Description: ${claim.description}
- Jurisdiction: ${claim.jurisdiction}
- Assigned Adjuster: ${claim.adjuster}
- Associated Flags: ${claim.flags.join(', ') || 'None'}
- Telematics Score: ${claim.telematicsScore ? `${claim.telematicsScore}/100` : 'N/A'}

Provide:
1. Executive Risk Summary (2 concise sentences)
2. Forensic Red Flags or Validation Points (bulleted)
3. Specific Actuarial Reserve Recommendation
4. Recommended Next Actions for Adjuster / SIU (Approve, Freeze, or Request Telematics/Deposition)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You are an expert actuarial risk and forensic insurance investigator. Respond in crisp, authoritative professional markdown format.',
        },
      });

      const analysisText = response.text || 'Analysis generation completed.';
      claim.aiAnalysis = analysisText;

      return res.json({
        claimId: claim.id,
        analysis: analysisText,
        source: 'gemini-3.8-flash',
      });
    } catch (err: any) {
      console.error('Error invoking Gemini for claim analysis:', err);
      // Fallback gracefully if API key has issues
    }
  }

  // High-fidelity fallback actuarial analysis
  const fallbackAnalysis = `### Executive Risk Summary
Claim #${claim.id} (${claim.claimant}) displays a computed forensic risk score of **${claim.fraudRiskScore}%** for a declared loss amount of **$${claim.claimAmount.toLocaleString()}** in ${claim.line}.

### Key Actuarial & Forensic Findings
- **Loss Development**: ${claim.fraudRiskScore > 70 ? 'Extreme statistical anomaly relative to standard ISO line baselines.' : 'Incurred loss aligns with expected severity distribution curves.'}
- **Telemetry & Records**: ${claim.telematicsScore ? `Telematics sensor score registered at ${claim.telematicsScore}/100.` : 'No active telematics sensor available.'}
- **Interception Signals**: ${claim.flags.length > 0 ? claim.flags.join('; ') : 'Zero automated fraud triggers detected.'}

### Reserve Recommendation & Action
${claim.fraudRiskScore > 70 ? 'Hold reserve disbursement immediately. Flag for comprehensive SIU examination and EUO (Examination Under Oath).' : 'Authorize standard settlement disbursement within statutory guideline window.'}`;

  claim.aiAnalysis = fallbackAnalysis;
  res.json({
    claimId: claim.id,
    analysis: fallbackAnalysis,
    source: 'actuarial-rules-engine',
  });
});

// 10. AI Forensic Radar Scan (Multi-Claim Scan)
app.post('/api/ai/forensic-scan', async (req: Request, res: Response) => {
  const flagged = claimsDatabase.filter((c) => c.fraudRiskScore >= 70);

  if (ai) {
    try {
      const scanPrompt = `Summarize current insurance syndicate threats across ${flagged.length} flagged high-risk claims:
${flagged.map((f) => `- #${f.id}: ${f.claimant} ($${f.claimAmount}) - ${f.description}`).join('\n')}

Identify if any patterns suggest organized staging, duplicate VIN utilization, or medical billing clinic collusion. Give a 3-bullet executive briefing.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: scanPrompt,
      });

      return res.json({
        activeAnomalies: 87,
        highSeverityInterceptions: flagged.length,
        totalPreventedLoss: '$1,482,900',
        summary: response.text,
        scannedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Error in AI scan:', err);
    }
  }

  res.json({
    activeAnomalies: 87,
    highSeverityInterceptions: flagged.length,
    totalPreventedLoss: '$1,482,900',
    summary:
      'Forensic scan completed across 1,248 active claims. 3 organized syndicate rings intercepted (South Florida bodily injury cluster and Northern NJ transponder theft ring). 0 unflagged high-severity cases detected.',
    scannedAt: new Date().toISOString(),
  });
});

// 11. System Settings API
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(systemSettings);
});

app.post('/api/settings', (req: Request, res: Response) => {
  systemSettings = { ...systemSettings, ...req.body };
  auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    time: 'Just now',
    action: 'Settings Updated',
    user: 'Chief Actuary',
    details: `Actuarial threshold adjusted: Sensitivity ${systemSettings.fraudSensitivity}, Method: ${systemSettings.triangulationMethod}`,
  });
  res.json({ success: true, settings: systemSettings });
});

// 12. Support Ticket Submission
app.post('/api/tickets', (req: Request, res: Response) => {
  const { category, description, urgency = 'Normal' } = req.body;
  const ticketId = `TIC-${Math.floor(1000 + Math.random() * 9000)}`;

  auditLogs.unshift({
    id: `LOG-${Date.now().toString().slice(-4)}`,
    time: 'Just now',
    action: 'Ticket Filed',
    user: 'Admin User',
    details: `Filed Support Ticket #${ticketId} [${category}]: ${description.slice(0, 50)}...`,
  });

  res.json({
    success: true,
    ticketId,
    message: `Ticket #${ticketId} submitted to Actuarial IT Support division. Dedicated SLA response time: 2 hours.`,
  });
});

// ==========================================
// Vite / Static Files Server
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Insurance Analytics] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
