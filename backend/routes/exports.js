import express from 'express';
import PDFDocument from 'pdfkit';
import { calculateROI } from '../services/roiCalculator.js';
import { getServiceProfile, getIndustryBenchmark } from '../services/knowledgeBase.js';

const router = express.Router();

// Export to CSV
router.post('/csv', async (req, res) => {
  try {
    const { project } = req.body;
    const result = calculateROI(project, 'base');

    const csvLines = [
      'ROI Forecast Report',
      `Generated: ${new Date().toISOString()}`,
      '',
      'Project Information',
      `Project Name,${project.projectName || 'N/A'}`,
      `Client Name,${project.clientName || 'N/A'}`,
      `Primary Service,${project.primaryServiceOffering || 'N/A'}`,
      `Industry,${project.industryVertical || 'N/A'}`,
      `Company Size,${project.companySize || 'N/A'}`,
      '',
      'Investment Summary',
      `Credera Engagement Fee,$${result.summary.totalInvestment * 0.7}`,
      `Client Implementation Costs,$${result.summary.totalInvestment * 0.3}`,
      `Total Investment,$${result.summary.totalInvestment}`,
      '',
      'ROI Summary',
      `Year 1 Value (Base Case),$${result.summary.yearOneValue.toFixed(2)}`,
      `ROI,${result.summary.roi.toFixed(1)}%`,
      `Payback Period,${result.summary.paybackPeriodMonths.toFixed(1)} months`,
      '',
      'Value Breakdown',
      `Revenue Impact,$${result.valueBreakdown.revenueImpact.toFixed(2)}`,
      `Cost Savings,$${result.valueBreakdown.costSavings.toFixed(2)}`,
      `Efficiency Gains,$${result.valueBreakdown.efficiencyGains.toFixed(2)}`,
      '',
      'Scenarios',
      `Conservative ROI,${result.scenarios.conservative.roi.toFixed(1)}%`,
      `Base Case ROI,${result.scenarios.base.roi.toFixed(1)}%`,
      `Optimistic ROI,${result.scenarios.optimistic.roi.toFixed(1)}%`,
      '',
      'Multi-Year Projections',
      `Year 1,$${result.projections.year1.toFixed(2)}`,
      `Year 2,$${result.projections.year2.toFixed(2)}`,
      `Year 3,$${result.projections.year3.toFixed(2)}`,
      '',
      'Applied Modifiers'
    ];

    result.modifiers.forEach(mod => {
      csvLines.push(`${mod.name},${mod.factor.toFixed(2)},${mod.description}`);
    });

    const csv = csvLines.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="roi-forecast-${project.projectName || 'project'}.csv"`);
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export to PDF
router.post('/pdf', async (req, res) => {
  try {
    const { project } = req.body;
    const result = calculateROI(project, 'base');
    const serviceProfile = getServiceProfile(project.primaryServiceOffering);
    const industryBenchmark = getIndustryBenchmark(project.industryVertical);

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="roi-forecast-${project.projectName || 'project'}.pdf"`);

    doc.pipe(res);

    // Title
    doc.fontSize(24).text('ROI Forecast Report', { align: 'center' });
    doc.moveDown();

    // Project Info
    doc.fontSize(16).text('Project Information', { underline: true });
    doc.fontSize(12);
    doc.text(`Project Name: ${project.projectName || 'N/A'}`);
    doc.text(`Client: ${project.clientName || 'N/A'}`);
    doc.text(`Primary Service: ${serviceProfile?.name || project.primaryServiceOffering || 'N/A'}`);
    doc.text(`Industry: ${industryBenchmark?.name || project.industryVertical || 'N/A'}`);
    doc.text(`Company Size: ${project.companySize || 'N/A'}`);
    doc.text(`Engagement Type: ${project.engagementType || 'N/A'}`);
    doc.moveDown();

    // Investment Summary
    doc.fontSize(16).text('Investment Summary', { underline: true });
    doc.fontSize(12);
    doc.text(`Total Investment: $${result.summary.totalInvestment.toLocaleString()}`);
    doc.moveDown();

    // ROI Summary
    doc.fontSize(16).text('ROI Summary', { underline: true });
    doc.fontSize(12);
    doc.text(`Year 1 Value (Base Case): $${result.summary.yearOneValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    doc.text(`Return on Investment: ${result.summary.roi.toFixed(1)}%`);
    doc.text(`Payback Period: ${result.summary.paybackPeriodMonths.toFixed(1)} months`);
    doc.moveDown();

    // Value Breakdown
    doc.fontSize(16).text('Value Breakdown', { underline: true });
    doc.fontSize(12);
    if (result.valueBreakdown.revenueImpact > 0) {
      doc.text(`Revenue Impact: $${result.valueBreakdown.revenueImpact.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    }
    if (result.valueBreakdown.costSavings > 0) {
      doc.text(`Cost Savings: $${result.valueBreakdown.costSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    }
    if (result.valueBreakdown.efficiencyGains > 0) {
      doc.text(`Efficiency Gains: $${result.valueBreakdown.efficiencyGains.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    }
    doc.moveDown();

    // Scenarios
    doc.fontSize(16).text('Scenario Analysis', { underline: true });
    doc.fontSize(12);
    doc.text(`Conservative: ${result.scenarios.conservative.roi.toFixed(1)}% ROI ($${result.scenarios.conservative.yearOneValue.toLocaleString(undefined, { maximumFractionDigits: 0 })})`);
    doc.text(`Base Case: ${result.scenarios.base.roi.toFixed(1)}% ROI ($${result.scenarios.base.yearOneValue.toLocaleString(undefined, { maximumFractionDigits: 0 })})`);
    doc.text(`Optimistic: ${result.scenarios.optimistic.roi.toFixed(1)}% ROI ($${result.scenarios.optimistic.yearOneValue.toLocaleString(undefined, { maximumFractionDigits: 0 })})`);
    doc.moveDown();

    // Multi-Year Projections
    doc.fontSize(16).text('Multi-Year Projections', { underline: true });
    doc.fontSize(12);
    doc.text(`Year 1: $${result.projections.year1.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    doc.text(`Year 2: $${result.projections.year2.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    doc.text(`Year 3: $${result.projections.year3.toLocaleString(undefined, { maximumFractionDigits: 0 })}`);
    doc.moveDown();

    // Applied Modifiers
    if (result.modifiers.length > 0) {
      doc.fontSize(16).text('Applied Adjustments', { underline: true });
      doc.fontSize(12);
      result.modifiers.forEach(mod => {
        doc.text(`${mod.name}: ${(mod.factor * 100).toFixed(0)}% (${mod.description})`);
      });
      doc.moveDown();
    }

    // Benchmarks
    if (serviceProfile) {
      doc.fontSize(16).text('Industry Benchmarks', { underline: true });
      doc.fontSize(12);
      doc.text(`Typical ROI Range: ${serviceProfile.typicalRoiRange.min}-${serviceProfile.typicalRoiRange.max}%`);
      doc.text(`Time to Value: ${serviceProfile.timeToValue.min}-${serviceProfile.timeToValue.max} ${serviceProfile.timeToValue.unit}`);
      doc.text(`Implementation Complexity: ${serviceProfile.implementationComplexity}/10`);
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.text('Credera ROI Forecasting Tool', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export executive summary (1-pager)
router.post('/executive-summary', async (req, res) => {
  try {
    const { project } = req.body;
    const result = calculateROI(project, 'base');
    const serviceProfile = getServiceProfile(project.primaryServiceOffering);

    const summary = {
      projectName: project.projectName,
      clientName: project.clientName,
      primaryService: serviceProfile?.name || project.primaryServiceOffering,
      totalInvestment: result.summary.totalInvestment,
      yearOneValue: result.summary.yearOneValue,
      roi: result.summary.roi,
      paybackPeriodMonths: result.summary.paybackPeriodMonths,
      scenarios: result.scenarios,
      keyInsights: [
        `Expected ROI of ${result.summary.roi.toFixed(0)}% within first year`,
        `Payback period of ${result.summary.paybackPeriodMonths.toFixed(0)} months`,
        result.modifiers.length > 0
          ? `${result.modifiers.length} adjustment factors applied based on project context`
          : null,
        serviceProfile
          ? `Industry benchmark ROI: ${serviceProfile.typicalRoiRange.min}-${serviceProfile.typicalRoiRange.max}%`
          : null
      ].filter(Boolean)
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
