import type { Project, FormOptions, ROIResult } from '../../types'

interface ReviewForecastProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  roiResult: ROIResult | null
  onNext: () => void
  onBack: () => void
  onSubmit: () => void
  onExportCSV: () => void
  onExportPDF: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function ReviewForecast({
  project,
  formOptions,
  roiResult,
  onBack,
  onSubmit,
  onExportCSV,
  onExportPDF,
}: ReviewForecastProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getServiceLabel = (id: string) => {
    const all = [
      ...(formOptions?.serviceOfferings.marketing_advertising.offerings || []),
      ...(formOptions?.serviceOfferings.technology_data.offerings || []),
    ]
    return all.find(s => s.id === id)?.label || id
  }

  const getOptionLabel = (options: { id: string; label: string }[] | undefined, id: string) => {
    return options?.find(o => o.id === id)?.label || id
  }

  return (
    <div>
      <h2>Review & Forecast</h2>

      {/* Project Summary */}
      <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Project Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <strong>Project:</strong> {project.projectName}
          </div>
          <div>
            <strong>Client:</strong> {project.clientName}
          </div>
          <div>
            <strong>Primary Service:</strong> {getServiceLabel(project.primaryServiceOffering || '')}
          </div>
          <div>
            <strong>Industry:</strong> {getOptionLabel(formOptions?.industryVerticals, project.industryVertical || '')}
          </div>
          <div>
            <strong>Company Size:</strong> {getOptionLabel(formOptions?.companySizes, project.companySize || '')}
          </div>
          <div>
            <strong>Engagement Type:</strong> {getOptionLabel(formOptions?.engagementTypes, project.engagementType || '')}
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Investment Summary</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>Credera Fee</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(project.crederaEngagementFee || 0)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>Client Costs</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{formatCurrency(project.clientImplementationCosts || 0)}</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-secondary)' }}>Total Investment</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--primary-color)' }}>
              {formatCurrency((project.crederaEngagementFee || 0) + (project.clientImplementationCosts || 0))}
            </div>
          </div>
        </div>
      </div>

      {/* Outcomes Summary */}
      <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Expected Outcomes ({project.outcomes?.length || 0})</h3>
        {project.outcomes?.map((outcome, index) => (
          <div key={outcome.id} style={{ padding: '0.75rem 0', borderBottom: index < (project.outcomes?.length || 0) - 1 ? '1px solid var(--border-color)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{outcome.metricName}</strong>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ({getOptionLabel(formOptions?.outcomeCategories, outcome.outcomeCategory)})
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: outcome.confidenceLevel === 'high' ? '#dcfce7' : outcome.confidenceLevel === 'medium' ? '#fef3c7' : '#fee2e2', borderRadius: '4px' }}>
                {outcome.confidenceLevel} confidence
              </span>
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {outcome.baselineValue} {outcome.baselineUnit} → {outcome.targetValue} {outcome.targetUnit}
              <span style={{ marginLeft: '0.5rem' }}>({outcome.yearOneAchievement}% Year 1 achievement)</span>
            </div>
          </div>
        ))}
      </div>

      {/* ROI Forecast */}
      {roiResult && (
        <div style={{ background: 'linear-gradient(135deg, var(--primary-color), #3b82f6)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', opacity: 0.9 }}>ROI Forecast</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{roiResult.scenarios.conservative.roi.toFixed(0)}%</div>
              <div style={{ opacity: 0.9 }}>Conservative</div>
            </div>
            <div style={{ transform: 'scale(1.1)' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{roiResult.scenarios.base.roi.toFixed(0)}%</div>
              <div style={{ opacity: 0.9 }}>Base Case</div>
            </div>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>{roiResult.scenarios.optimistic.roi.toFixed(0)}%</div>
              <div style={{ opacity: 0.9 }}>Optimistic</div>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.875rem', opacity: 0.9 }}>
            <span>Payback: {roiResult.summary.paybackPeriodMonths.toFixed(0)} months</span>
            <span>Year 1 Value: {formatCurrency(roiResult.summary.yearOneValue)}</span>
          </div>
        </div>
      )}

      {/* Multi-Year Projections */}
      {roiResult && (
        <div style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Multi-Year Value Projections</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(roiResult.projections.year1)}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Year 1</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(roiResult.projections.year2)}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Year 2</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600 }}>{formatCurrency(roiResult.projections.year3)}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Year 3</div>
            </div>
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {(project.riskFactors?.length || 0) > 0 && (
        <div style={{ background: '#fef3c7', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <strong>Risk Factors Identified:</strong>
          <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
            {project.riskFactors?.map(risk => (
              <li key={risk}>{getOptionLabel(formOptions?.riskFactors, risk)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Export Actions */}
      <div className="export-actions" style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={onExportCSV}>
          Export CSV
        </button>
        <button className="btn btn-secondary" onClick={onExportPDF}>
          Export PDF
        </button>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-success" onClick={onSubmit}>
          Save Project
        </button>
      </div>
    </div>
  )
}
