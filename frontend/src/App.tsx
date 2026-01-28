import { useState, useEffect, useCallback } from 'react'
import type { Project, ROIResult, FormOptions, KnowledgeBaseInsight } from './types'
import { knowledgeBaseApi, calculationsApi, projectsApi, exportsApi } from './services/api'
import StepIndicator from './components/StepIndicator'
import ProjectOverview from './components/steps/ProjectOverview'
import BusinessContext from './components/steps/BusinessContext'
import InvestmentProfile from './components/steps/InvestmentProfile'
import OutcomesMetrics from './components/steps/OutcomesMetrics'
import AssumptionsRisks from './components/steps/AssumptionsRisks'
import ReviewForecast from './components/steps/ReviewForecast'
import ROIDashboard from './components/ROIDashboard'
import InsightsPanel from './components/InsightsPanel'

const STEPS = [
  { id: 1, label: 'Project Overview', component: ProjectOverview },
  { id: 2, label: 'Business Context', component: BusinessContext },
  { id: 3, label: 'Investment', component: InvestmentProfile },
  { id: 4, label: 'Outcomes', component: OutcomesMetrics },
  { id: 5, label: 'Risks', component: AssumptionsRisks },
  { id: 6, label: 'Review', component: ReviewForecast },
]

const initialProject: Partial<Project> = {
  projectName: '',
  clientName: '',
  industryVertical: '',
  companySize: '',
  geographicRegions: [],
  projectStartDate: '',
  projectDuration: 6,
  primaryServiceOffering: '',
  secondaryServiceOfferings: [],
  engagementType: '',
  currentAnnualRevenue: undefined,
  currentOperatingMargin: undefined,
  primaryBusinessChallenge: '',
  organizationalMaturity: '',
  technologyStack: [],
  relevantTeamSize: undefined,
  crederaEngagementFee: 0,
  clientImplementationCosts: 0,
  projectPhases: [],
  keyCostDrivers: '',
  outcomes: [],
  keyBusinessAssumptions: '',
  organizationalConstraints: '',
  technologyAssumptions: '',
  marketAssumptions: '',
  riskFactors: [],
}

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [project, setProject] = useState<Partial<Project>>(initialProject)
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null)
  const [roiResult, setRoiResult] = useState<ROIResult | null>(null)
  const [insights, setInsights] = useState<KnowledgeBaseInsight[]>([])
  const [forecastMode, setForecastMode] = useState<'conservative' | 'base' | 'optimistic'>('base')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Load form options on mount
  useEffect(() => {
    async function loadFormOptions() {
      try {
        const options = await knowledgeBaseApi.getFormOptions()
        setFormOptions(options)
      } catch (error) {
        console.error('Failed to load form options:', error)
      } finally {
        setLoading(false)
      }
    }
    loadFormOptions()
  }, [])

  // Calculate ROI when project data changes
  const calculateROI = useCallback(async () => {
    if (!project.primaryServiceOffering || project.outcomes?.length === 0) {
      return
    }

    try {
      const result = await calculationsApi.calculateROI(project, forecastMode)
      setRoiResult(result)
    } catch (error) {
      console.error('Failed to calculate ROI:', error)
    }
  }, [project, forecastMode])

  // Fetch insights when relevant fields change
  const fetchInsights = useCallback(async () => {
    if (!project.primaryServiceOffering) {
      return
    }

    try {
      const { insights: newInsights } = await knowledgeBaseApi.getInsights({
        primaryServiceOffering: project.primaryServiceOffering,
        industryVertical: project.industryVertical,
        companySize: project.companySize,
        organizationalMaturity: project.organizationalMaturity,
        secondaryServiceOfferings: project.secondaryServiceOfferings,
      })
      setInsights(newInsights)
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    }
  }, [project.primaryServiceOffering, project.industryVertical, project.companySize, project.organizationalMaturity, project.secondaryServiceOfferings])

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateROI()
    }, 500)
    return () => clearTimeout(timer)
  }, [calculateROI])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  // Auto-save draft
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (project.projectName) {
        setSaving(true)
        try {
          await projectsApi.saveDraft(project)
          setLastSaved(new Date())
        } catch (error) {
          console.error('Failed to save draft:', error)
        } finally {
          setSaving(false)
        }
      }
    }, 30000)
    return () => clearTimeout(timer)
  }, [project])

  const updateProject = (updates: Partial<Project>) => {
    setProject(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleStepClick = (step: number) => {
    setCurrentStep(step)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await projectsApi.saveDraft(project)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    try {
      await projectsApi.create({ ...project, status: 'completed' })
      alert('Project saved successfully!')
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('Failed to save project')
    }
  }

  const handleExportCSV = async () => {
    await exportsApi.downloadCSV(project)
  }

  const handleExportPDF = async () => {
    await exportsApi.downloadPDF(project)
  }

  if (loading) {
    return (
      <div className="app" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    )
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className="app">
      <header className="header">
        <h1>ROI Forecasting Tool</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {lastSaved && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {saving ? 'Saving...' : `Last saved: ${lastSaved.toLocaleTimeString()}`}
            </span>
          )}
          <button className="btn btn-secondary" onClick={handleSave} disabled={saving}>
            Save Draft
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="wizard-container">
          <StepIndicator
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={handleStepClick}
          />

          <div className="form-card">
            <CurrentStepComponent
              project={project}
              updateProject={updateProject}
              formOptions={formOptions}
              roiResult={roiResult}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={handleSubmit}
              onExportCSV={handleExportCSV}
              onExportPDF={handleExportPDF}
              isFirstStep={currentStep === 1}
              isLastStep={currentStep === STEPS.length}
            />
          </div>
        </div>

        <aside className="sidebar">
          <ROIDashboard
            roiResult={roiResult}
            forecastMode={forecastMode}
            onForecastModeChange={setForecastMode}
            totalInvestment={(project.crederaEngagementFee || 0) + (project.clientImplementationCosts || 0)}
          />
          <InsightsPanel insights={insights} />
        </aside>
      </main>
    </div>
  )
}

export default App
