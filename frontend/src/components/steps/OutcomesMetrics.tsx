import { useState } from 'react'
import type { Project, FormOptions, ProjectOutcome } from '../../types'

interface OutcomesMetricsProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

const emptyOutcome: Omit<ProjectOutcome, 'id'> = {
  outcomeCategory: '',
  metricName: '',
  baselineValue: 0,
  baselineUnit: '',
  targetValue: 0,
  targetUnit: '',
  yearOneAchievement: 80,
  confidenceLevel: 'medium',
  supportingRationale: '',
}

export default function OutcomesMetrics({
  project,
  updateProject,
  formOptions,
  onNext,
  onBack,
}: OutcomesMetricsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const outcomes = project.outcomes || []

  const addOutcome = () => {
    const newOutcome: ProjectOutcome = {
      ...emptyOutcome,
      id: generateId(),
    }
    updateProject({ outcomes: [...outcomes, newOutcome] })
    setExpandedId(newOutcome.id)
  }

  const updateOutcome = (id: string, updates: Partial<ProjectOutcome>) => {
    updateProject({
      outcomes: outcomes.map(o => (o.id === id ? { ...o, ...updates } : o)),
    })
  }

  const removeOutcome = (id: string) => {
    updateProject({ outcomes: outcomes.filter(o => o.id !== id) })
    if (expandedId === id) {
      setExpandedId(null)
    }
  }

  const calculateImpact = (outcome: ProjectOutcome) => {
    const baseline = outcome.baselineValue || 0
    const target = outcome.targetValue || 0
    const achievement = (outcome.yearOneAchievement || 0) / 100

    if (outcome.outcomeCategory === 'cost_reduction') {
      return (baseline - target) * achievement
    }
    return (target - baseline) * achievement
  }

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value.toFixed(0)}`
  }

  const canProceed = outcomes.length >= 3

  return (
    <div>
      <h2>Outcomes & Metrics</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Define 3-5 key expected outcomes with quantifiable metrics.
      </p>

      <div className="outcome-cards">
        {outcomes.map((outcome, index) => (
          <div key={outcome.id} className="outcome-card">
            <div className="outcome-card-header">
              <h4>
                Outcome {index + 1}: {outcome.metricName || 'New Outcome'}
              </h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => setExpandedId(expandedId === outcome.id ? null : outcome.id)}
                >
                  {expandedId === outcome.id ? 'Collapse' : 'Expand'}
                </button>
                <button
                  className="btn btn-danger"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                  onClick={() => removeOutcome(outcome.id)}
                >
                  Remove
                </button>
              </div>
            </div>

            {expandedId === outcome.id ? (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label>Outcome Category</label>
                    <select
                      value={outcome.outcomeCategory}
                      onChange={e => updateOutcome(outcome.id, { outcomeCategory: e.target.value })}
                    >
                      <option value="">Select category</option>
                      {formOptions?.outcomeCategories?.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Metric Name</label>
                    <input
                      type="text"
                      value={outcome.metricName}
                      onChange={e => updateOutcome(outcome.id, { metricName: e.target.value })}
                      placeholder="e.g., Marketing Automation Deployment Time"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Baseline Value</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="number"
                        value={outcome.baselineValue || ''}
                        onChange={e => updateOutcome(outcome.id, { baselineValue: parseFloat(e.target.value) || 0 })}
                        placeholder="Current value"
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        value={outcome.baselineUnit}
                        onChange={e => updateOutcome(outcome.id, { baselineUnit: e.target.value })}
                        placeholder="Unit"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Target Value</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input
                        type="number"
                        value={outcome.targetValue || ''}
                        onChange={e => updateOutcome(outcome.id, { targetValue: parseFloat(e.target.value) || 0 })}
                        placeholder="Target value"
                        style={{ flex: 2 }}
                      />
                      <input
                        type="text"
                        value={outcome.targetUnit}
                        onChange={e => updateOutcome(outcome.id, { targetUnit: e.target.value })}
                        placeholder="Unit"
                        style={{ flex: 1 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Year 1 Achievement (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={outcome.yearOneAchievement || ''}
                      onChange={e => updateOutcome(outcome.id, { yearOneAchievement: parseInt(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Confidence Level</label>
                    <div className="multi-select">
                      {formOptions?.confidenceLevels?.map(opt => (
                        <button
                          key={opt.id}
                          type="button"
                          className={`multi-select-option ${outcome.confidenceLevel === opt.id ? 'selected' : ''}`}
                          onClick={() => updateOutcome(outcome.id, { confidenceLevel: opt.id as 'high' | 'medium' | 'low' })}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Supporting Rationale</label>
                  <textarea
                    value={outcome.supportingRationale}
                    onChange={e => updateOutcome(outcome.id, { supportingRationale: e.target.value })}
                    placeholder="Explain why this target is achievable (100-300 words)"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Category: {formOptions?.outcomeCategories?.find(c => c.id === outcome.outcomeCategory)?.label || '-'}</span>
                  <span>Confidence: {outcome.confidenceLevel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    {outcome.baselineValue} {outcome.baselineUnit} → {outcome.targetValue} {outcome.targetUnit}
                  </span>
                  <span style={{ fontWeight: 500, color: 'var(--success-color)' }}>
                    Est. Impact: {formatCurrency(calculateImpact(outcome))}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        {outcomes.length < 5 && (
          <button className="add-outcome-btn" onClick={addOutcome}>
            + Add Outcome ({outcomes.length}/5)
          </button>
        )}
      </div>

      {outcomes.length < 3 && (
        <p style={{ color: 'var(--warning-color)', fontSize: '0.875rem', marginTop: '1rem' }}>
          Please add at least 3 outcomes to proceed.
        </p>
      )}

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext} disabled={!canProceed}>
          Next: Assumptions & Risks
        </button>
      </div>
    </div>
  )
}
