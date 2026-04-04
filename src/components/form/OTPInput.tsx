import { useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";
import { OTP_LENGTH } from "@/utils/constants";

interface OTPInputProps {
  value: string[];
  onChange: (otp: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export default function OTPInput({ value, onChange, error, disabled }: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      if (!/^\d*$/.test(inputValue)) return;
      const newOtp = [...value];
      newOtp[index] = inputValue.slice(-1);
      onChange(newOtp);
      if (inputValue && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [value, onChange]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [value]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
      const newOtp = [...value];
      pasted.split("").forEach((char, i) => {
        newOtp[i] = char;
      });
      onChange(newOtp);
      const nextIndex = Math.min(pasted.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    },
    [value, onChange]
  );

  return (
    <div className="space-y-1.5">
      <label className="fb-label">Phone number verification</label>
      <div className="flex gap-2" role="group" aria-label="OTP input">
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            disabled={disabled}
            className={`w-10 h-12 text-center text-lg font-semibold border rounded-md focus:outline-none focus:ring-2 transition-colors
              ${error ? "border-destructive focus:ring-destructive" : "border-border focus:ring-ring"}
              ${disabled ? "opacity-50 cursor-not-allowed bg-muted" : "bg-card"}`}
            aria-label={`Digit ${i + 1}`}
          />
        ))}
      </div>
      {error && (
        <p className="fb-error" role="alert">{error}</p>
      )}
    </div>
  );
}
