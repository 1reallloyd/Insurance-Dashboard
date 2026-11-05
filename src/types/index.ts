export interface ClaimItem {
  id: string;
  claimant: string;
  policyNumber: string;
  line: string;
  claimAmount: number;
  fraudRiskScore: number;
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

export interface DashboardMetrics {
  kpis: {
    totalClaims: number;
    totalClaimsDisplay: string;
    fraudCount: number;
    amountSaved: number;
    amountSavedDisplay: string;
    predictedClaims: number;
    systemRiskScore: number;
    activeReserveExposure: string;
  };
  categoryDistribution: Array<{
    name: string;
    percentage: number;
    color: string;
    amount: string;
  }>;
  modelHealth: {
    precision: string;
    latencyMs: number;
    triangulationMethod: string;
    liveTelematics: boolean;
  };
  auditLogs: Array<{
    id: string;
    time: string;
    action: string;
    user: string;
    details: string;
  }>;
}

export interface TrendData {
  labels: string[];
  actual: number[];
  predicted: number[];
  subtitle: string;
  label: string;
  metric: string;
}

export interface SimulationResult {
  inputs: {
    weatherFactor: number;
    inflationFactor: number;
    growthFactor: number;
  };
  results: {
    projectedFrequency: number;
    simulatedLossIncurred: string;
    simulatedLossNumber: number;
    lossDiffPercentage: string;
    recommendedBuffer: string;
    solvencyRating: string;
  };
}

export type ViewType =
  | 'dashboard'
  | 'upload'
  | 'claims'
  | 'fraud'
  | 'prediction'
  | 'reports'
  | 'settings'
  | 'help';
