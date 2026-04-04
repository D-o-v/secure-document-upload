import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CONSENT_TEXT } from "@/utils/constants";

interface ConsentStepProps {
  onAccept: () => void;
  onReject: () => void;
}

export default function ConsentStep({ onAccept, onReject }: ConsentStepProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="animate-fade-in">
      <h2 className="text-base font-semibold text-foreground mb-4">
        PERSONAL DATA PROCESSING CONSENT FORM
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Kindly read and accept the following conditions to proceed
      </p>

      <div className="bg-muted/50 rounded-lg p-4 mb-6 max-h-[400px] overflow-y-auto">
        <div className="text-xs text-foreground leading-relaxed whitespace-pre-line">
          {CONSENT_TEXT}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-6">
        <Checkbox
          id="consent"
          checked={accepted}
          onCheckedChange={(checked) => setAccepted(checked === true)}
        />
        <label
          htmlFor="consent"
          className="text-xs text-foreground cursor-pointer leading-relaxed"
        >
          I have read and accepted the terms above
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={onReject} className="fb-btn-outline">
          Reject
        </button>
        <button
          onClick={onAccept}
          disabled={!accepted}
          className="fb-btn-primary"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
