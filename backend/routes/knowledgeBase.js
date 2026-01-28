import express from 'express';
import {
  getServiceOfferings,
  getServiceProfile,
  getIndustryBenchmarks,
  getIndustryBenchmark,
  getModifiers,
  getSynergies,
  getFormOptions,
  getFullKnowledgeBase,
  clearCache
} from '../services/knowledgeBase.js';

const router = express.Router();

// Get full knowledge base
router.get('/', (req, res) => {
  try {
    const kb = getFullKnowledgeBase();
    res.json(kb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all service offerings
router.get('/service-offerings', (req, res) => {
  try {
    const offerings = getServiceOfferings();
    res.json(offerings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific service profile
router.get('/service-offerings/:id', (req, res) => {
  try {
    const profile = getServiceProfile(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: 'Service offering not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all industry benchmarks
router.get('/industry-benchmarks', (req, res) => {
  try {
    const benchmarks = getIndustryBenchmarks();
    res.json(benchmarks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific industry benchmark
router.get('/industry-benchmarks/:id', (req, res) => {
  try {
    const benchmark = getIndustryBenchmark(req.params.id);
    if (!benchmark) {
      return res.status(404).json({ error: 'Industry benchmark not found' });
    }
    res.json(benchmark);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all modifiers
router.get('/modifiers', (req, res) => {
  try {
    const modifiers = getModifiers();
    res.json(modifiers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get synergies
router.get('/synergies', (req, res) => {
  try {
    const synergies = getSynergies();
    res.json(synergies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get form options
router.get('/form-options', (req, res) => {
  try {
    const options = getFormOptions();
    res.json(options);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear cache (useful after KB updates)
router.post('/clear-cache', (req, res) => {
  try {
    clearCache();
    res.json({ message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get context insights for a specific project configuration
router.post('/insights', (req, res) => {
  try {
    const { primaryServiceOffering, industryVertical, companySize, organizationalMaturity, secondaryServiceOfferings } = req.body;

    const insights = [];

    // Service profile insights
    const serviceProfile = getServiceProfile(primaryServiceOffering);
    if (serviceProfile) {
      insights.push({
        type: 'service',
        title: `${serviceProfile.name} Insights`,
        content: `This offering typically delivers ${serviceProfile.typicalRoiRange.min}-${serviceProfile.typicalRoiRange.max}% ROI`,
        details: {
          timeToValue: `${serviceProfile.timeToValue.min}-${serviceProfile.timeToValue.max} ${serviceProfile.timeToValue.unit}`,
          complexity: `${serviceProfile.implementationComplexity}/10`,
          typicalInvestment: `$${(serviceProfile.typicalInvestmentRange.min / 1000).toFixed(0)}K - $${(serviceProfile.typicalInvestmentRange.max / 1000000).toFixed(1)}M`
        }
      });
    }

    // Industry insights
    const industryBenchmark = getIndustryBenchmark(industryVertical);
    if (industryBenchmark) {
      insights.push({
        type: 'industry',
        title: `${industryBenchmark.name} Industry`,
        content: `Projects in this industry have a ${industryBenchmark.avgSuccessRate}% success rate`,
        details: {
          keyValueDrivers: industryBenchmark.keyValueDrivers.slice(0, 3),
          avgDuration: `${industryBenchmark.implementationNorms.avgProjectDuration} months typical`
        }
      });
    }

    // Synergy insights
    if (secondaryServiceOfferings?.length > 0) {
      const synergies = getSynergies();
      const relevantSynergies = synergies.filter(
        s => s.primary === primaryServiceOffering && secondaryServiceOfferings.includes(s.secondary)
      );

      if (relevantSynergies.length > 0) {
        const avgMultiplier = relevantSynergies.reduce((sum, s) => sum + s.multiplier, 0) / relevantSynergies.length;
        insights.push({
          type: 'synergy',
          title: 'Service Synergies Detected',
          content: `Combined services could increase value by ${((avgMultiplier - 1) * 100).toFixed(0)}%`,
          details: {
            synergies: relevantSynergies.map(s => s.description)
          }
        });
      }
    }

    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
