import { useState, useEffect, useCallback } from "react";
import InputField from "@/components/form/InputField";
import OTPInput from "@/components/form/OTPInput";
import Loader from "@/components/ui/Loader";
import ResultModal from "@/components/ui/ResultModal";
import { CheckCircle2 } from "lucide-react";
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
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState({ phone: "", email: "" });
  const [resendTimer, setResendTimer] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);

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

  const handleVerifyOTP = useCallback(async (otpValue: string[]) => {
    const code = otpValue.join("");
    if (code.length !== OTP_LENGTH) return;
    setOtpError("");
    setLoading(true);
    const result = await verifyOTP(accountNumber, code);
    setLoading(false);
    if (!result.success) {
      setOtpError("The OTP Code inputed is wrong or invalid.");
      return;
    }
    setOtpVerified(true);
    setTimeout(() => onVerified(accountNumber), 1000);
  }, [accountNumber, onVerified]);

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
    <div className="animate-fade-in w-full max-w-2xl mx-auto">
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
            <div className="flex flex-col lg:flex-row lg:items-end gap-3">
              <OTPInput
                value={otp}
                onChange={(v) => {
                  setOtp(v);
                  if (otpError) setOtpError("");
                  if (v.join("").length === OTP_LENGTH) {
                    handleVerifyOTP(v);
                  }
                }}
                error={otpError}
              />

              <div className="flex items-center gap-2 text-xs lg:pb-2">
                <span className="text-muted-foreground">Didn't receive OTP?</span>
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0}
                  className="fb-link disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendTimer > 0
                    ? `Resend in 0.${String(resendTimer).padStart(2, "0")} secs`
                    : "Resend OTP"}
                </button>
              </div>
            </div>

            {otpVerified && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-fade-in">
                <CheckCircle2 className="w-5 h-5" />
                <span>OTP verified successfully</span>
              </div>
            )}

            {otpError && (
              <div className="text-sm text-red-600 animate-fade-in">
                {otpError}{" "}
                <button
                  onClick={() => setShowErrorModal(true)}
                  className="font-semibold underline text-red-700 hover:text-red-900"
                >
                  Cancel Request
                </button>
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Kindly input the 6-digit OTP sent to your registered phone number{" "}
              <span className="font-medium text-foreground">{contactInfo.phone}</span> and email
              address{" "}
              <span className="font-medium text-foreground">{contactInfo.email}</span>
            </p>
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
        message="Your phone number validation failed."
        secondaryAction={{ label: "Close", onClick: () => setShowErrorModal(false) }}
        primaryAction={{ label: "Cancel request", onClick: () => setShowErrorModal(false) }}
      />
    </div>
  );
}
