import { getServiceProfile, getIndustryBenchmark, getModifiers, getSynergies } from './knowledgeBase.js';

/**
 * Confidence level multipliers
 */
const CONFIDENCE_WEIGHTS = {
  high: 1.0,
  medium: 0.75,
  low: 0.5
};

/**
 * Forecast mode multipliers
 */
const FORECAST_MODES = {
  conservative: 0.6,
  base: 0.8,
  optimistic: 1.0
};

/**
 * Calculate the total value from outcomes
 */
function calculateOutcomeValue(outcome) {
  const baselineValue = parseFloat(outcome.baselineValue) || 0;
  const targetValue = parseFloat(outcome.targetValue) || 0;
  const achievementPercent = (parseFloat(outcome.yearOneAchievement) || 0) / 100;
  const confidenceWeight = CONFIDENCE_WEIGHTS[outcome.confidenceLevel?.toLowerCase()] || 0.75;

  // Calculate the delta (improvement)
  let annualImpact = 0;

  if (outcome.outcomeCategory === 'cost_reduction') {
    // Cost reduction: baseline - target = savings
    annualImpact = (baselineValue - targetValue) * achievementPercent * confidenceWeight;
  } else if (outcome.outcomeCategory === 'revenue_growth') {
    // Revenue growth: target - baseline = gain
    annualImpact = (targetValue - baselineValue) * achievementPercent * confidenceWeight;
  } else if (outcome.outcomeCategory === 'efficiency') {
    // Efficiency: convert to dollar value if possible, otherwise use target - baseline
    annualImpact = (targetValue - baselineValue) * achievementPercent * confidenceWeight;
  } else {
    // Default: assume higher is better
    annualImpact = Math.abs(targetValue - baselineValue) * achievementPercent * confidenceWeight;
  }

  return annualImpact;
}

/**
 * Apply knowledge base modifiers to the calculation
 */
function applyModifiers(baseValue, project, knowledgeBase) {
  let modifiedValue = baseValue;
  const appliedModifiers = [];

  // 1. Service Offering Modifier
  const serviceProfile = getServiceProfile(project.primaryServiceOffering);
  if (serviceProfile) {
    const complexityPenalty = 1 - (serviceProfile.implementationComplexity - 5) * 0.02;
    modifiedValue *= complexityPenalty;
    appliedModifiers.push({
      name: 'Service Complexity',
      factor: complexityPenalty,
      description: `${serviceProfile.name} complexity adjustment`
    });
  }

  // 2. Industry Vertical Modifier
  const industryBenchmark = getIndustryBenchmark(project.industryVertical);
  if (industryBenchmark) {
    modifiedValue *= industryBenchmark.successRateModifier || 1;
    appliedModifiers.push({
      name: 'Industry',
      factor: industryBenchmark.successRateModifier || 1,
      description: `${project.industryVertical} industry adjustment`
    });
  }

  // 3. Company Size/Maturity Modifier
  const modifiers = getModifiers();
  const sizeModifier = modifiers.companySize[project.companySize];
  if (sizeModifier) {
    modifiedValue *= sizeModifier.achievementModifier || 1;
    appliedModifiers.push({
      name: 'Company Size',
      factor: sizeModifier.achievementModifier || 1,
      description: `${project.companySize} size adjustment`
    });
  }

  const maturityModifier = modifiers.maturityLevel[project.organizationalMaturity];
  if (maturityModifier) {
    modifiedValue *= maturityModifier.achievementModifier || 1;
    appliedModifiers.push({
      name: 'Maturity',
      factor: maturityModifier.achievementModifier || 1,
      description: `${project.organizationalMaturity} maturity adjustment`
    });
  }

  // 4. Engagement Type Modifier
  const engagementModifier = modifiers.engagementType[project.engagementType];
  if (engagementModifier) {
    modifiedValue *= engagementModifier.valueModifier || 1;
    appliedModifiers.push({
      name: 'Engagement Type',
      factor: engagementModifier.valueModifier || 1,
      description: `${project.engagementType} engagement adjustment`
    });
  }

  // 5. Cross-Service Synergy Bonus
  if (project.secondaryServiceOfferings?.length > 0) {
    const synergies = getSynergies();
    let synergyBonus = 1;

    project.secondaryServiceOfferings.forEach(secondary => {
      const synergy = synergies.find(
        s => s.primary === project.primaryServiceOffering && s.secondary === secondary
      );
      if (synergy) {
        synergyBonus *= synergy.multiplier;
      }
    });

    if (synergyBonus > 1) {
      modifiedValue *= synergyBonus;
      appliedModifiers.push({
        name: 'Service Synergies',
        factor: synergyBonus,
        description: 'Cross-service synergy bonus'
      });
    }
  }

  // 6. Risk Factor Adjustment
  if (project.riskFactors?.length > 0) {
    const riskPenalty = 1 - (project.riskFactors.length * 0.03);
    modifiedValue *= Math.max(riskPenalty, 0.7);
    appliedModifiers.push({
      name: 'Risk Factors',
      factor: Math.max(riskPenalty, 0.7),
      description: `${project.riskFactors.length} risk factor(s) identified`
    });
  }

  return { modifiedValue, appliedModifiers };
}

/**
 * Main ROI calculation function
 */
export function calculateROI(project, forecastMode = 'base') {
  const outcomes = project.outcomes || [];

  // Calculate raw value from outcomes by category
  const valueByCategory = {
    revenue_growth: 0,
    cost_reduction: 0,
    efficiency: 0,
    risk_mitigation: 0,
    customer_experience: 0,
    market_share: 0,
    other: 0
  };

  outcomes.forEach(outcome => {
    const value = calculateOutcomeValue(outcome);
    const category = outcome.outcomeCategory || 'other';
    valueByCategory[category] = (valueByCategory[category] || 0) + value;
  });

  const totalRawValue = Object.values(valueByCategory).reduce((sum, val) => sum + val, 0);

  // Apply knowledge base modifiers
  const { modifiedValue, appliedModifiers } = applyModifiers(totalRawValue, project, null);

  // Apply forecast mode
  const forecastMultiplier = FORECAST_MODES[forecastMode] || FORECAST_MODES.base;
  const yearOneValue = modifiedValue * forecastMultiplier;

  // Calculate investment
  const crederaFee = parseFloat(project.crederaEngagementFee) || 0;
  const clientCosts = parseFloat(project.clientImplementationCosts) || 0;
  const totalInvestment = crederaFee + clientCosts;

  // Calculate ROI metrics
  const roi = totalInvestment > 0 ? ((yearOneValue - totalInvestment) / totalInvestment) * 100 : 0;
  const paybackPeriod = yearOneValue > 0 ? (totalInvestment / (yearOneValue / 12)) : Infinity;

  // Multi-year projections
  const projections = {
    year1: yearOneValue * 0.8,  // Conservative first year (ramp-up)
    year2: yearOneValue * 1.05, // Full value + some compounding
    year3: yearOneValue * 1.0   // Sustained value
  };

  // Get service profile for context
  const serviceProfile = getServiceProfile(project.primaryServiceOffering);
  const industryBenchmark = getIndustryBenchmark(project.industryVertical);

  return {
    summary: {
      totalInvestment,
      yearOneValue,
      roi: Math.round(roi * 10) / 10,
      paybackPeriodMonths: Math.round(paybackPeriod * 10) / 10,
      forecastMode
    },
    valueBreakdown: {
      revenueImpact: valueByCategory.revenue_growth,
      costSavings: valueByCategory.cost_reduction,
      efficiencyGains: valueByCategory.efficiency,
      riskMitigation: valueByCategory.risk_mitigation,
      customerExperience: valueByCategory.customer_experience,
      marketShare: valueByCategory.market_share,
      other: valueByCategory.other
    },
    projections,
    modifiers: appliedModifiers,
    benchmarks: {
      serviceProfile: serviceProfile ? {
        name: serviceProfile.name,
        typicalRoiRange: serviceProfile.typicalRoiRange,
        timeToValue: serviceProfile.timeToValue,
        implementationComplexity: serviceProfile.implementationComplexity
      } : null,
      industryBenchmark: industryBenchmark ? {
        name: industryBenchmark.name,
        avgSuccessRate: industryBenchmark.avgSuccessRate
      } : null
    },
    scenarios: {
      conservative: {
        yearOneValue: modifiedValue * FORECAST_MODES.conservative,
        roi: totalInvestment > 0 ? (((modifiedValue * FORECAST_MODES.conservative) - totalInvestment) / totalInvestment) * 100 : 0
      },
      base: {
        yearOneValue: modifiedValue * FORECAST_MODES.base,
        roi: totalInvestment > 0 ? (((modifiedValue * FORECAST_MODES.base) - totalInvestment) / totalInvestment) * 100 : 0
      },
      optimistic: {
        yearOneValue: modifiedValue * FORECAST_MODES.optimistic,
        roi: totalInvestment > 0 ? (((modifiedValue * FORECAST_MODES.optimistic) - totalInvestment) / totalInvestment) * 100 : 0
      }
    }
  };
}

export default { calculateROI };
