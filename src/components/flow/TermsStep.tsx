import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { TERMS_TEXT } from "@/utils/constants";

interface TermsStepProps {
  onAccept: () => void;
  onReject: () => void;
}

export default function TermsStep({ onAccept, onReject }: TermsStepProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto">
      <h2 className="text-base font-semibold text-foreground mb-4">
        Account Maintenance Terms and Conditions
      </h2>

      <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-6 max-h-[350px] sm:max-h-[400px] overflow-y-auto">
        <div className="text-xs text-foreground leading-relaxed whitespace-pre-line">
          {TERMS_TEXT}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-6">
        <Checkbox
          id="terms"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked === true)}
        />
        <label htmlFor="terms" className="text-xs text-foreground cursor-pointer">
          Accept Terms & Conditions
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={onReject} className="fb-btn-outline">
          Reject
        </button>
        <button onClick={onAccept} disabled={!accepted} className="fb-btn-primary">
          I Agree
        </button>
      </div>
    </div>
  );
}
