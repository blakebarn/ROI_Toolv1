import type { Project, FormOptions, ProjectOutcome } from '../../types'

interface InvestmentOutcomesProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const OUTCOME_CATEGORIES = [
  { id: 'revenue_growth', label: 'Revenue Growth' },
  { id: 'cost_reduction', label: 'Cost Reduction' },
  { id: 'efficiency', label: 'Efficiency' },
  { id: 'risk_mitigation', label: 'Risk Mitigation' },
  { id: 'customer_experience', label: 'Customer Experience' },
  { id: 'market_share', label: 'Market Share' },
  { id: 'other', label: 'Other' },
]

const CONFIDENCE_LEVELS = [
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

export default function InvestmentOutcomes({
  project,
  updateProject,
  onNext,
  onBack,
}: InvestmentOutcomesProps) {
  const outcomes = project.outcomes || []
  const totalInvestment = (project.crederaEngagementFee || 0) + (project.clientImplementationCosts || 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const addOutcome = () => {
    const newOutcome: ProjectOutcome = {
      id: generateId(),
      outcomeCategory: 'cost_reduction',
      metricName: '',
      baselineValue: 0,
      baselineUnit: 'USD',
      targetValue: 0,
      targetUnit: 'USD',
      yearOneAchievement: 80,
      confidenceLevel: 'medium',
      supportingRationale: '',
    }
    updateProject({ outcomes: [...outcomes, newOutcome] })
  }

  const updateOutcome = (id: string, field: keyof ProjectOutcome, value: string | number) => {
    const updated = outcomes.map(o => {
      if (o.id === id) {
        return { ...o, [field]: value }
      }
      return o
    })
    updateProject({ outcomes: updated })
  }

  const removeOutcome = (id: string) => {
    updateProject({ outcomes: outcomes.filter(o => o.id !== id) })
  }

  const calculateImpact = (outcome: ProjectOutcome) => {
    const baseline = Number(outcome.baselineValue) || 0
    const target = Number(outcome.targetValue) || 0
    const achievement = (Number(outcome.yearOneAchievement) || 0) / 100

    if (outcome.outcomeCategory === 'cost_reduction') {
      return (baseline - target) * achievement
    }
    return (target - baseline) * achievement
  }

  const canProceed = totalInvestment > 0 && outcomes.length >= 1

  return (
    <div>
      <h2>Investment & Expected Outcomes</h2>

      {/* Investment Section */}
      <div style={{
        background: 'var(--background)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        marginBottom: '2rem',
        border: '1px solid var(--border-color)'
      }}>
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: 'var(--text-primary)' }}>
          Investment Profile
        </h3>

        <div className="form-row">
          <div className="form-group">
            <label>
              Credera Engagement Fee (USD) <span className="required">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              value={project.crederaEngagementFee || ''}
              onChange={e => updateProject({ crederaEngagementFee: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 500000"
            />
          </div>

          <div className="form-group">
            <label>
              Client Implementation Costs (USD)
            </label>
            <input
              type="number"
              min="0"
              step="10000"
              value={project.clientImplementationCosts || ''}
              onChange={e => updateProject({ clientImplementationCosts: parseFloat(e.target.value) || 0 })}
              placeholder="Technology, staffing, training"
            />
          </div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          background: 'white',
          borderRadius: 'var(--radius-sm)',
          marginTop: '0.5rem'
        }}>
          <span style={{ fontWeight: 500 }}>Total Investment:</span>
          <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {formatCurrency(totalInvestment)}
          </span>
        </div>
      </div>

      {/* Outcomes Section */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', margin: 0 }}>
              Expected Outcomes
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
              Add at least 1 outcome with quantifiable metrics
            </p>
          </div>
          <button
            className="btn btn-primary"
            onClick={addOutcome}
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
          >
            + Add Outcome
          </button>
        </div>

        {outcomes.length === 0 ? (
          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <p>No outcomes added yet.</p>
            <button className="btn btn-secondary" onClick={addOutcome}>
              Add Your First Outcome
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {outcomes.map((outcome, index) => (
              <div
                key={outcome.id}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  background: 'white'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Outcome {index + 1}
                  </span>
                  <button
                    className="btn btn-danger"
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                    onClick={() => removeOutcome(outcome.id)}
                  >
                    Remove
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Category</label>
                    <select
                      value={outcome.outcomeCategory || ''}
                      onChange={e => updateOutcome(outcome.id, 'outcomeCategory', e.target.value)}
                    >
                      {OUTCOME_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Metric Name</label>
                    <input
                      type="text"
                      value={outcome.metricName || ''}
                      onChange={e => updateOutcome(outcome.id, 'metricName', e.target.value)}
                      placeholder="e.g., Marketing Stack Costs"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>
                      Baseline Value ({outcome.outcomeCategory === 'cost_reduction' ? 'Current Cost' : 'Current'})
                    </label>
                    <input
                      type="number"
                      value={outcome.baselineValue || ''}
                      onChange={e => updateOutcome(outcome.id, 'baselineValue', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 2300000"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>
                      Target Value ({outcome.outcomeCategory === 'cost_reduction' ? 'Target Cost' : 'Target'})
                    </label>
                    <input
                      type="number"
                      value={outcome.targetValue || ''}
                      onChange={e => updateOutcome(outcome.id, 'targetValue', parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 1800000"
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Year 1 Achievement %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={outcome.yearOneAchievement || ''}
                      onChange={e => updateOutcome(outcome.id, 'yearOneAchievement', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label style={{ fontSize: '0.75rem' }}>Confidence</label>
                    <select
                      value={outcome.confidenceLevel || 'medium'}
                      onChange={e => updateOutcome(outcome.id, 'confidenceLevel', e.target.value)}
                    >
                      {CONFIDENCE_LEVELS.map(level => (
                        <option key={level.id} value={level.id}>{level.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'var(--background)',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Estimated Annual Impact:
                  </span>
                  <span style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: calculateImpact(outcome) >= 0 ? 'var(--success-color)' : 'var(--danger-color)'
                  }}>
                    {formatCurrency(calculateImpact(outcome))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      {outcomes.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-color), #3b82f6)',
          color: 'white',
          padding: '1.5rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Total Expected Annual Value</div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                {formatCurrency(outcomes.reduce((sum, o) => sum + calculateImpact(o), 0))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Quick ROI Estimate</div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                {totalInvestment > 0
                  ? `${Math.round(((outcomes.reduce((sum, o) => sum + calculateImpact(o), 0) - totalInvestment) / totalInvestment) * 100)}%`
                  : '--%'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next: Assumptions & Risks
        </button>
      </div>

      {!canProceed && (
        <p style={{ color: 'var(--warning-color)', fontSize: '0.875rem', marginTop: '1rem', textAlign: 'center' }}>
          {totalInvestment <= 0 && 'Please enter investment amounts. '}
          {outcomes.length < 1 && 'Please add at least 1 outcome.'}
        </p>
      )}
    </div>
  )
}
