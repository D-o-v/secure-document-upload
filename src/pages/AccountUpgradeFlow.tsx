import { useState, useCallback, lazy, Suspense } from "react";
import AppLayout from "@/components/layout/AppLayout";
import StepProgress from "@/components/ui/StepProgress";
import Loader from "@/components/ui/Loader";
import ResultModal from "@/components/ui/ResultModal";
import { ArrowLeft } from "lucide-react";
import type { FlowStep } from "@/types";
import type { AccountUpgradeFormValues } from "@/components/flow/AccountUpgradeFormStep";
import { submitAccountUpgrade } from "@/services/api";

const ConsentStep = lazy(() => import("@/components/flow/ConsentStep"));
const VerificationStep = lazy(() => import("@/components/flow/VerificationStep"));
const AccountUpgradeFormStep = lazy(() => import("@/components/flow/AccountUpgradeFormStep"));
const TermsStep = lazy(() => import("@/components/flow/TermsStep"));

interface AccountUpgradeFlowProps {
  onBack: () => void;
}

const STEPS: FlowStep[] = ["consent", "verification", "form", "terms", "complete"];
const STEP_INDEX: Record<FlowStep, number> = {
  consent: 1,
  verification: 2,
  otp: 2,
  form: 3,
  terms: 4,
  "additional-info": 5,
  complete: 5,
};

export default function AccountUpgradeFlow({ onBack }: AccountUpgradeFlowProps) {
  const [step, setStep] = useState<FlowStep>("consent");
  const [accountNumber, setAccountNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<AccountUpgradeFormValues | null>(null);
  const [modal, setModal] = useState<{
    open: boolean;
    variant: "success" | "error";
    title: string;
    message: string;
  }>({ open: false, variant: "success", title: "", message: "" });

  const handleVerified = useCallback((acctNum: string) => {
    setAccountNumber(acctNum);
    setStep("form");
  }, []);

  const handleFormSubmitCapture = useCallback((data: AccountUpgradeFormValues) => {
    setFormData(data);
    setStep("terms");
  }, []);

  const handleTermsAccepted = useCallback(async () => {
    if (!formData) return;
    setIsSubmitting(true);
    const fd = new FormData();
    fd.append("accountNumber", accountNumber);
    fd.append("upgradeTier", formData.upgradeTier);
    fd.append("bvn", formData.bvn);
    fd.append("nin", formData.nin);
    fd.append("idDocumentType", formData.idDocumentType);
    fd.append("idDocumentNumber", formData.idDocumentNumber);
    if (formData.proofOfIdentityFile) fd.append("proofOfIdentity", formData.proofOfIdentityFile);

    const result = await submitAccountUpgrade(fd);
    setIsSubmitting(false);

    if (result.success) {
      setModal({
        open: true,
        variant: "success",
        title: "Upgrade request submitted",
        message: result.message,
      });
    } else {
      setModal({
        open: true,
        variant: "error",
        title: "Upgrade request failed",
        message: result.message,
      });
    }
  }, [formData, accountNumber]);

  const handleGoBack = useCallback(() => {
    const idx = STEPS.indexOf(step);
    if (idx <= 0) {
      onBack();
    } else {
      setStep(STEPS[idx - 1]);
    }
  }, [step, onBack]);

  return (
    <AppLayout>
      <div className="w-full max-w-2xl mx-auto mb-4">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Account Upgrade
        </button>
      </div>

      <StepProgress currentStep={STEP_INDEX[step]} totalSteps={5} />

      {isSubmitting ? (
        <Loader text="Submitting your upgrade request..." size="lg" />
      ) : (
        <Suspense fallback={<Loader text="Loading..." />}>
          {step === "consent" && (
            <ConsentStep
              onAccept={() => setStep("verification")}
              onReject={onBack}
            />
          )}
          {step === "verification" && (
            <VerificationStep
              onVerified={handleVerified}
              serviceTitle="Account Upgrade"
            />
          )}
          {step === "form" && (
            <AccountUpgradeFormStep
              accountNumber={accountNumber}
              onSubmit={handleFormSubmitCapture}
              isSubmitting={isSubmitting}
            />
          )}
          {step === "terms" && (
            <TermsStep
              onAccept={handleTermsAccepted}
              onReject={() => setStep("form")}
            />
          )}
        </Suspense>
      )}

      <ResultModal
        open={modal.open}
        onClose={() => {
          setModal((m) => ({ ...m, open: false }));
          if (modal.variant === "success") onBack();
        }}
        variant={modal.variant}
        title={modal.title}
        message={modal.message}
        secondaryAction={{
          label: "Close",
          onClick: () => {
            setModal((m) => ({ ...m, open: false }));
            if (modal.variant === "success") onBack();
          },
        }}
        primaryAction={{ label: "Home", onClick: onBack }}
      />
    </AppLayout>
  );
}
