interface Step {
  id: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export default function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="step-indicator">
      {steps.map((step) => (
        <div
          key={step.id}
          className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
          onClick={() => onStepClick(step.id)}
          style={{ cursor: 'pointer' }}
        >
          <div className="step-number">
            {currentStep > step.id ? '✓' : step.id}
          </div>
          <span className="step-label">{step.label}</span>
        </div>
      ))}
    </div>
  )
}
