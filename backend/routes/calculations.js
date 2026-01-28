import express from 'express';
import { calculateROI } from '../services/roiCalculator.js';

const router = express.Router();

// Calculate ROI for a project
router.post('/roi', async (req, res) => {
  try {
    const { project, forecastMode = 'base' } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Project data is required' });
    }

    const result = calculateROI(project, forecastMode);
    res.json(result);
  } catch (error) {
    console.error('ROI calculation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Calculate ROI for all three scenarios
router.post('/roi/scenarios', async (req, res) => {
  try {
    const { project } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Project data is required' });
    }

    const scenarios = {
      conservative: calculateROI(project, 'conservative'),
      base: calculateROI(project, 'base'),
      optimistic: calculateROI(project, 'optimistic')
    };

    res.json(scenarios);
  } catch (error) {
    console.error('ROI scenarios calculation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quick estimate based on service offering and investment
router.post('/quick-estimate', async (req, res) => {
  try {
    const {
      primaryServiceOffering,
      totalInvestment,
      industryVertical,
      companySize
    } = req.body;

    // Create a minimal project for quick calculation
    const minimalProject = {
      primaryServiceOffering,
      industryVertical: industryVertical || 'other',
      companySize: companySize || 'midmarket_250_1000',
      crederaEngagementFee: totalInvestment * 0.7,
      clientImplementationCosts: totalInvestment * 0.3,
      outcomes: [
        {
          outcomeCategory: 'efficiency',
          baselineValue: 0,
          targetValue: totalInvestment * 0.3,
          yearOneAchievement: 80,
          confidenceLevel: 'medium'
        }
      ]
    };

    const result = calculateROI(minimalProject, 'base');
    res.json({
      estimatedRoi: result.summary.roi,
      typicalRoiRange: result.benchmarks.serviceProfile?.typicalRoiRange,
      message: 'This is a rough estimate. Complete the full form for accurate projections.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
