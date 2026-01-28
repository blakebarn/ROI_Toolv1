import type { Project, FormOptions } from '../../types'

interface BusinessContextProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function BusinessContext({
  project,
  updateProject,
  formOptions,
  onNext,
  onBack,
}: BusinessContextProps) {
  const handleTechStackChange = (id: string) => {
    const current = project.technologyStack || []
    if (current.includes(id)) {
      updateProject({ technologyStack: current.filter(t => t !== id) })
    } else {
      updateProject({ technologyStack: [...current, id] })
    }
  }

  return (
    <div>
      <h2>Business Context</h2>

      <div className="form-row">
        <div className="form-group">
          <label>Current Annual Revenue (USD millions)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={project.currentAnnualRevenue || ''}
            onChange={e => updateProject({ currentAnnualRevenue: parseFloat(e.target.value) || undefined })}
            placeholder="e.g., 500"
          />
        </div>

        <div className="form-group">
          <label>Current Operating Margin (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={project.currentOperatingMargin || ''}
            onChange={e => updateProject({ currentOperatingMargin: parseFloat(e.target.value) || undefined })}
            placeholder="e.g., 15"
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          Primary Business Challenge <span className="required">*</span>
        </label>
        <textarea
          value={project.primaryBusinessChallenge || ''}
          onChange={e => updateProject({ primaryBusinessChallenge: e.target.value })}
          placeholder="Describe the primary pain point this engagement addresses (200-500 words)"
          rows={6}
        />
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          {(project.primaryBusinessChallenge || '').split(/\s+/).filter(Boolean).length} words
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Organizational Maturity Level</label>
          <select
            value={project.organizationalMaturity || ''}
            onChange={e => updateProject({ organizationalMaturity: e.target.value })}
          >
            <option value="">Select maturity level</option>
            {formOptions?.maturityLevels.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Relevant Team Size (FTEs)</label>
          <input
            type="number"
            min="1"
            value={project.relevantTeamSize || ''}
            onChange={e => updateProject({ relevantTeamSize: parseInt(e.target.value) || undefined })}
            placeholder="Number of FTEs affected"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Technology Stack Context</label>
        <div className="multi-select">
          {formOptions?.technologyStacks.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`multi-select-option ${project.technologyStack?.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => handleTechStackChange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-actions">
        <button className="btn btn-secondary" onClick={onBack}>
          Back
        </button>
        <button className="btn btn-primary" onClick={onNext}>
          Next: Investment Profile
        </button>
      </div>
    </div>
  )
}
