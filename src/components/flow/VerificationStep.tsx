import { useState, useEffect, useCallback } from "react";
import InputField from "@/components/form/InputField";
import OTPInput from "@/components/form/OTPInput";
import Loader from "@/components/ui/Loader";
import ResultModal from "@/components/ui/ResultModal";
import { verifyAccount, verifyOTP } from "@/services/api";
import { ACCOUNT_NUMBER_LENGTH, OTP_LENGTH, OTP_RESEND_TIMEOUT } from "@/utils/constants";

interface VerificationStepProps {
  onVerified: (accountNumber: string) => void;
  serviceTitle: string;
}

export default function VerificationStep({ onVerified, serviceTitle }: VerificationStepProps) {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountError, setAccountError] = useState("");
  const [phase, setPhase] = useState<"account" | "otp">("account");
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({ phone: "", email: "" });
  const [resendTimer, setResendTimer] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleSubmitAccount = useCallback(async () => {
    if (accountNumber.length !== ACCOUNT_NUMBER_LENGTH) {
      setAccountError(`Enter your ${ACCOUNT_NUMBER_LENGTH}-digits account number`);
      return;
    }
    setAccountError("");
    setLoading(true);
    const result = await verifyAccount(accountNumber);
    setLoading(false);
    if (!result.success) {
      setAccountError(result.message);
      return;
    }
    setContactInfo(result.data!);
    setPhase("otp");
    setResendTimer(OTP_RESEND_TIMEOUT);
  }, [accountNumber]);

  const handleVerifyOTP = useCallback(async () => {
    const code = otp.join("");
    if (code.length !== OTP_LENGTH) {
      setOtpError("Please enter the complete OTP");
      return;
    }
    setOtpError("");
    setLoading(true);
    const result = await verifyOTP(accountNumber, code);
    setLoading(false);
    if (!result.success) {
      setOtpError(result.message);
      setErrorMessage(result.message);
      setShowErrorModal(true);
      return;
    }
    onVerified(accountNumber);
  }, [otp, accountNumber, onVerified]);

  const handleResendOTP = useCallback(async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    await verifyAccount(accountNumber);
    setLoading(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    setResendTimer(OTP_RESEND_TIMEOUT);
  }, [accountNumber, resendTimer]);

  if (loading) {
    return <Loader text={phase === "account" ? "Verifying account..." : "Verifying OTP..."} />;
  }

  return (
    <div className="animate-fade-in max-w-md">
      <div className="space-y-5">
        <InputField
          label="Account number"
          placeholder={`Enter your ${ACCOUNT_NUMBER_LENGTH}-digits account number`}
          value={accountNumber}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, ACCOUNT_NUMBER_LENGTH);
            setAccountNumber(v);
            if (accountError) setAccountError("");
          }}
          error={accountError ? { message: accountError, type: "manual" } : undefined}
          disabled={phase === "otp"}
          maxLength={ACCOUNT_NUMBER_LENGTH}
          inputMode="numeric"
        />

        {phase === "otp" && (
          <div className="space-y-3 animate-fade-in">
            <OTPInput
              value={otp}
              onChange={(v) => {
                setOtp(v);
                if (otpError) setOtpError("");
              }}
              error={otpError}
            />

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">Didn't receive OTP?</span>
              <button
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className="fb-link disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer} secs` : "Resend OTP"}
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Kindly input the 6-digit OTP sent to your registered phone number{" "}
              <span className="font-medium text-foreground">{contactInfo.phone}</span> and email
              address{" "}
              <span className="font-medium text-foreground">{contactInfo.email}</span>
            </p>

            <button onClick={handleVerifyOTP} className="fb-btn-primary w-full mt-2">
              Verify
            </button>
          </div>
        )}

        {phase === "account" && (
          <button onClick={handleSubmitAccount} className="fb-btn-primary">
            Continue
          </button>
        )}
      </div>

      <ResultModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        variant="warning"
        title="OTP Validation Failed"
        message={errorMessage}
        secondaryAction={{ label: "Close", onClick: () => setShowErrorModal(false) }}
        primaryAction={{ label: "Cancel request", onClick: () => setShowErrorModal(false) }}
      />
    </div>
  );
}
