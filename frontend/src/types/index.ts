export interface Project {
  id?: string;
  // Project Metadata
  projectName: string;
  clientName: string;
  industryVertical: string;
  companySize: string;
  geographicRegions: string[];
  projectStartDate: string;
  projectDuration: number;
  primaryServiceOffering: string;
  secondaryServiceOfferings: string[];
  engagementType: string;

  // Business Context
  currentAnnualRevenue?: number;
  currentOperatingMargin?: number;
  primaryBusinessChallenge: string;
  organizationalMaturity: string;
  technologyStack: string[];
  relevantTeamSize?: number;

  // Investment
  crederaEngagementFee: number;
  clientImplementationCosts: number;
  projectPhases?: ProjectPhase[];
  keyCostDrivers?: string;

  // Outcomes
  outcomes: ProjectOutcome[];

  // Assumptions & Risks
  keyBusinessAssumptions?: string;
  organizationalConstraints?: string;
  technologyAssumptions?: string;
  marketAssumptions?: string;
  riskFactors: string[];

  // Metadata
  status?: 'draft' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectPhase {
  name: string;
  cost: number;
  durationMonths: number;
}

export interface ProjectOutcome {
  id: string;
  outcomeCategory: string;
  metricName: string;
  baselineValue: number;
  baselineUnit: string;
  targetValue: number;
  targetUnit: string;
  yearOneAchievement: number;
  confidenceLevel: 'high' | 'medium' | 'low';
  supportingRationale: string;
}

export interface ROIResult {
  summary: {
    totalInvestment: number;
    yearOneValue: number;
    roi: number;
    paybackPeriodMonths: number;
    forecastMode: string;
  };
  valueBreakdown: {
    revenueImpact: number;
    costSavings: number;
    efficiencyGains: number;
    riskMitigation: number;
    customerExperience: number;
    marketShare: number;
    other: number;
  };
  projections: {
    year1: number;
    year2: number;
    year3: number;
  };
  modifiers: Modifier[];
  benchmarks: {
    serviceProfile: ServiceProfile | null;
    industryBenchmark: IndustryBenchmark | null;
  };
  scenarios: {
    conservative: { yearOneValue: number; roi: number };
    base: { yearOneValue: number; roi: number };
    optimistic: { yearOneValue: number; roi: number };
  };
}

export interface Modifier {
  name: string;
  factor: number;
  description: string;
}

export interface ServiceProfile {
  id: string;
  name: string;
  domain: string;
  typicalRoiRange: { min: number; max: number };
  implementationComplexity: number;
  timeToValue: { min: number; max: number; unit: string };
  commonSuccessMetrics: string[];
  typicalInvestmentRange: { min: number; max: number };
  riskProfile: string[];
  prerequisiteCapabilities: string[];
  integrationDependencies: string[];
  caseStudies: { industry: string; outcomes: string }[];
}

export interface IndustryBenchmark {
  id: string;
  name: string;
  successRateModifier: number;
  avgSuccessRate: number;
  typicalTimelineModifier: number;
  keyValueDrivers: string[];
  performanceMetrics: Record<string, { benchmark: number; unit: string }>;
  regulatoryContext: string[];
  implementationNorms: {
    avgProjectDuration: number;
    changeManagementIntensity: string;
  };
}

export interface FormOptions {
  industryVerticals: { id: string; label: string }[];
  companySizes: { id: string; label: string }[];
  geographicRegions: { id: string; label: string }[];
  engagementTypes: { id: string; label: string }[];
  maturityLevels: { id: string; label: string }[];
  technologyStacks: { id: string; label: string }[];
  outcomeCategories: { id: string; label: string }[];
  confidenceLevels: { id: string; label: string }[];
  riskFactors: { id: string; label: string }[];
  serviceOfferings: {
    marketing_advertising: {
      domain: string;
      offerings: { id: string; label: string }[];
    };
    technology_data: {
      domain: string;
      offerings: { id: string; label: string }[];
    };
  };
}

export interface KnowledgeBaseInsight {
  type: 'service' | 'industry' | 'synergy';
  title: string;
  content: string;
  details: Record<string, unknown>;
}
