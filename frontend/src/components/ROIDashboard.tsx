import type { ROIResult } from '../types'

interface ROIDashboardProps {
  roiResult: ROIResult | null
  forecastMode: 'conservative' | 'base' | 'optimistic'
  onForecastModeChange: (mode: 'conservative' | 'base' | 'optimistic') => void
  totalInvestment: number
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toFixed(0)}`
}

export default function ROIDashboard({
  roiResult,
  forecastMode,
  onForecastModeChange,
  totalInvestment,
}: ROIDashboardProps) {
  if (!roiResult) {
    return (
      <div className="roi-dashboard">
        <h3>ROI Summary</h3>
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
          <p>Complete the form to see your ROI forecast</p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
            Start by selecting a service offering and adding outcomes
          </p>
        </div>
      </div>
    )
  }

  const currentScenario = roiResult.scenarios[forecastMode]

  return (
    <div className="roi-dashboard">
      <h3>ROI Summary</h3>

      <div className="roi-highlight">
        <div className="roi-highlight-value">
          {currentScenario.roi > 0 ? '+' : ''}{currentScenario.roi.toFixed(0)}%
        </div>
        <div className="roi-highlight-label">
          Projected ROI ({forecastMode.charAt(0).toUpperCase() + forecastMode.slice(1)})
        </div>
      </div>

      <div className="scenarios">
        <button
          className={`scenario-btn ${forecastMode === 'conservative' ? 'active' : ''}`}
          onClick={() => onForecastModeChange('conservative')}
        >
          <span className="scenario-btn-label">Conservative</span>
          <span className="scenario-btn-value">{roiResult.scenarios.conservative.roi.toFixed(0)}%</span>
        </button>
        <button
          className={`scenario-btn ${forecastMode === 'base' ? 'active' : ''}`}
          onClick={() => onForecastModeChange('base')}
        >
          <span className="scenario-btn-label">Base</span>
          <span className="scenario-btn-value">{roiResult.scenarios.base.roi.toFixed(0)}%</span>
        </button>
        <button
          className={`scenario-btn ${forecastMode === 'optimistic' ? 'active' : ''}`}
          onClick={() => onForecastModeChange('optimistic')}
        >
          <span className="scenario-btn-label">Optimistic</span>
          <span className="scenario-btn-value">{roiResult.scenarios.optimistic.roi.toFixed(0)}%</span>
        </button>
      </div>

      <div className="roi-summary">
        <div className="roi-metric">
          <span className="roi-metric-label">Total Investment</span>
          <span className="roi-metric-value">{formatCurrency(totalInvestment)}</span>
        </div>
        <div className="roi-metric">
          <span className="roi-metric-label">Year 1 Value</span>
          <span className={`roi-metric-value ${currentScenario.yearOneValue > 0 ? 'positive' : ''}`}>
            {formatCurrency(currentScenario.yearOneValue)}
          </span>
        </div>
        <div className="roi-metric">
          <span className="roi-metric-label">Payback Period</span>
          <span className="roi-metric-value">
            {roiResult.summary.paybackPeriodMonths === Infinity
              ? 'N/A'
              : `${roiResult.summary.paybackPeriodMonths.toFixed(0)} months`}
          </span>
        </div>
      </div>

      <h3 style={{ marginTop: '1rem' }}>Value Breakdown</h3>
      <div className="roi-summary">
        {roiResult.valueBreakdown.revenueImpact > 0 && (
          <div className="roi-metric">
            <span className="roi-metric-label">Revenue Impact</span>
            <span className="roi-metric-value positive">
              {formatCurrency(roiResult.valueBreakdown.revenueImpact)}
            </span>
          </div>
        )}
        {roiResult.valueBreakdown.costSavings > 0 && (
          <div className="roi-metric">
            <span className="roi-metric-label">Cost Savings</span>
            <span className="roi-metric-value positive">
              {formatCurrency(roiResult.valueBreakdown.costSavings)}
            </span>
          </div>
        )}
        {roiResult.valueBreakdown.efficiencyGains > 0 && (
          <div className="roi-metric">
            <span className="roi-metric-label">Efficiency Gains</span>
            <span className="roi-metric-value positive">
              {formatCurrency(roiResult.valueBreakdown.efficiencyGains)}
            </span>
          </div>
        )}
      </div>

      {roiResult.modifiers.length > 0 && (
        <>
          <h3 style={{ marginTop: '1rem' }}>Applied Adjustments</h3>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {roiResult.modifiers.map((mod, index) => (
              <div key={index} style={{ padding: '0.25rem 0' }}>
                {mod.name}: {((mod.factor - 1) * 100).toFixed(0)}%
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
