interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto mb-6">
      <div className="fb-progress-bar">
        <div
          className="fb-step-indicator bg-primary"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
