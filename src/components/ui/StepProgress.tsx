interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fb-progress-bar mb-6">
      <div
        className="fb-step-indicator bg-primary"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
