import type { Project, FormOptions } from '../../types'

interface ProjectOverviewProps {
  project: Partial<Project>
  updateProject: (updates: Partial<Project>) => void
  formOptions: FormOptions | null
  onNext: () => void
  onBack: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

export default function ProjectOverview({
  project,
  updateProject,
  formOptions,
  onNext,
  isFirstStep,
}: ProjectOverviewProps) {
  const allServiceOfferings = formOptions
    ? [
        ...formOptions.serviceOfferings.marketing_advertising.offerings,
        ...formOptions.serviceOfferings.technology_data.offerings,
      ]
    : []

  const handleSecondaryChange = (id: string) => {
    const current = project.secondaryServiceOfferings || []
    if (current.includes(id)) {
      updateProject({ secondaryServiceOfferings: current.filter(s => s !== id) })
    } else if (current.length < 3) {
      updateProject({ secondaryServiceOfferings: [...current, id] })
    }
  }

  const handleRegionChange = (id: string) => {
    const current = project.geographicRegions || []
    if (current.includes(id)) {
      updateProject({ geographicRegions: current.filter(r => r !== id) })
    } else {
      updateProject({ geographicRegions: [...current, id] })
    }
  }

  const canProceed = project.projectName && project.clientName && project.primaryServiceOffering

  return (
    <div>
      <h2>Project Overview</h2>

      <div className="form-row">
        <div className="form-group">
          <label>
            Project Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={project.projectName || ''}
            onChange={e => updateProject({ projectName: e.target.value })}
            placeholder="Enter project name"
          />
        </div>

        <div className="form-group">
          <label>
            Client Name <span className="required">*</span>
          </label>
          <input
            type="text"
            value={project.clientName || ''}
            onChange={e => updateProject({ clientName: e.target.value })}
            placeholder="Enter client name"
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          Primary Service Offering <span className="required">*</span>
        </label>
        <select
          value={project.primaryServiceOffering || ''}
          onChange={e => updateProject({ primaryServiceOffering: e.target.value })}
        >
          <option value="">Select a service offering</option>
          {formOptions && (
            <>
              <optgroup label={formOptions.serviceOfferings.marketing_advertising.domain}>
                {formOptions.serviceOfferings.marketing_advertising.offerings.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label={formOptions.serviceOfferings.technology_data.domain}>
                {formOptions.serviceOfferings.technology_data.offerings.map(opt => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </select>
      </div>

      <div className="form-group">
        <label>Secondary Service Offerings (up to 3)</label>
        <div className="multi-select">
          {allServiceOfferings
            .filter(opt => opt.id !== project.primaryServiceOffering)
            .map(opt => (
              <button
                key={opt.id}
                type="button"
                className={`multi-select-option ${project.secondaryServiceOfferings?.includes(opt.id) ? 'selected' : ''}`}
                onClick={() => handleSecondaryChange(opt.id)}
              >
                {opt.label}
              </button>
            ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Industry Vertical</label>
          <select
            value={project.industryVertical || ''}
            onChange={e => updateProject({ industryVertical: e.target.value })}
          >
            <option value="">Select industry</option>
            {formOptions?.industryVerticals?.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Company Size</label>
          <select
            value={project.companySize || ''}
            onChange={e => updateProject({ companySize: e.target.value })}
          >
            <option value="">Select company size</option>
            {formOptions?.companySizes?.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Geographic Regions</label>
        <div className="multi-select">
          {formOptions?.geographicRegions?.map(opt => (
            <button
              key={opt.id}
              type="button"
              className={`multi-select-option ${project.geographicRegions?.includes(opt.id) ? 'selected' : ''}`}
              onClick={() => handleRegionChange(opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Engagement Type</label>
          <select
            value={project.engagementType || ''}
            onChange={e => updateProject({ engagementType: e.target.value })}
          >
            <option value="">Select engagement type</option>
            {formOptions?.engagementTypes?.map(opt => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Project Duration (months)</label>
          <input
            type="number"
            min="1"
            value={project.projectDuration || ''}
            onChange={e => updateProject({ projectDuration: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Project Start Date</label>
        <input
          type="date"
          value={project.projectStartDate || ''}
          onChange={e => updateProject({ projectStartDate: e.target.value })}
        />
      </div>

      <div className="form-actions">
        <div />
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Next: Business Context
        </button>
      </div>
    </div>
  )
}
