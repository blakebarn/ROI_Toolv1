import type { Project, FormOptions } from '../../types'

interface InvestmentProfileProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function InvestmentProfile({
  project,
  updateProject,
  onNext,
  onBack,
}: InvestmentProfileProps) {
  const totalInvestment = (project.crederaEngagementFee || 0) + (project.clientImplementationCosts || 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div>
      <h2>Investment Profile</h2>

      <div className="form-row">
        <div className="form-group">
          <label>
            Credera Engagement Fee (USD) <span className="required">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={project.crederaEngagementFee || ''}
            onChange={e => updateProject({ crederaEngagementFee: parseFloat(e.target.value) || 0 })}
            placeholder="e.g., 500000"
          />
        </div>

        <div className="form-group">
          <label>
            Client Implementation Costs (USD) <span className="required">*</span>
          </label>
          <input
            type="number"
            min="0"
            step="1000"
            value={project.clientImplementationCosts || ''}
            onChange={e => updateProject({ clientImplementationCosts: parseFloat(e.target.value) || 0 })}
            placeholder="Technology, staffing, training costs"
          />
        </div>
      </div>

      <div
        style={{
          background: 'var(--background)',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>Total Investment</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {formatCurrency(totalInvestment)}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          <span>Credera Fee: {formatCurrency(project.crederaEngagementFee || 0)}</span>
          <span>Client Costs: {formatCurrency(project.clientImplementationCosts || 0)}</span>
        </div>
      </div>

      <div className="form-group">
        <label>Key Cost Drivers</label>
        <textarea
          value={project.keyCostDrivers || ''}
          onChange={e => updateProject({ keyCostDrivers: e.target.value })}
          placeholder="Identify the primary investment components (e.g., technology licensing, staffing augmentation, training programs)"
          rows={4}
        />
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={totalInvestment <= 0}
        >
          Next: Outcomes & Metrics
        </button>
      </div>
    </div>
  )
}
