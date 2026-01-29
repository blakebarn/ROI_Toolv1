import type { Project, FormOptions } from '../../types'

interface AssumptionsRisksProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function AssumptionsRisks({
  project,
  updateProject,
  formOptions,
  onNext,
  onBack,
}: AssumptionsRisksProps) {
  const handleRiskChange = (id: string) => {
    const current = project.riskFactors || []
    if (current.includes(id)) {
      updateProject({ riskFactors: current.filter(r => r !== id) })
    } else {
      updateProject({ riskFactors: [...current, id] })
    }
  }

  return (
    <div>
      <h2>Assumptions & Risks</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Document key assumptions and risk factors that may impact ROI realization.
      </p>

      <div className="form-group">
        <label>Key Business Assumptions</label>
        <textarea
          value={project.keyBusinessAssumptions || ''}
          onChange={e => updateProject({ keyBusinessAssumptions: e.target.value })}
          placeholder="What must be true for the ROI to be realized? (bullet format recommended)"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Organizational Constraints</label>
        <textarea
          value={project.organizationalConstraints || ''}
          onChange={e => updateProject({ organizationalConstraints: e.target.value })}
          placeholder="Budget limits, timeline pressures, stakeholder alignment challenges"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Technology/Infrastructure Assumptions</label>
        <textarea
          value={project.technologyAssumptions || ''}
          onChange={e => updateProject({ technologyAssumptions: e.target.value })}
          placeholder="Existing capabilities that impact implementation"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Market Assumptions</label>
        <textarea
          value={project.marketAssumptions || ''}
          onChange={e => updateProject({ marketAssumptions: e.target.value })}
          placeholder="External factors like customer demand, competitive landscape"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label>Risk Factors</label>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          Select all that apply. Each risk factor reduces projected achievement by approximately 3-9%.
        </p>
        <div className="multi-select">
          {formOptions?.riskFactors?.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`multi-select-option ${project.riskFactors?.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => handleRiskChange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {(project.riskFactors?.length || 0) > 0 && (
          <p style={{ fontSize: '0.75rem', color: 'var(--warning-color)', marginTop: '0.5rem' }}>
            {project.riskFactors?.length} risk factor(s) selected - this will reduce projected ROI by approximately{' '}
            {Math.min((project.riskFactors?.length || 0) * 3, 30)}%
          </p>
        )}
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Next: Review & Forecast
        </button>
      </div>
    </div>
  )
}
