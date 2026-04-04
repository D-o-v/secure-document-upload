import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { type ReactNode } from "react";

type ModalVariant = "success" | "error" | "warning" | "info";

interface ResultModalProps {
  open: boolean;
  onClose: () => void;
  variant: ModalVariant;
  title: string;
  message: string;
  primaryAction?: { label: string; onClick: () => void };
  secondaryAction?: { label: string; onClick: () => void };
}

const ICONS: Record<ModalVariant, ReactNode> = {
  success: <CheckCircle2 className="w-12 h-12 text-success" />,
  error: <XCircle className="w-12 h-12 text-destructive" />,
  warning: <AlertTriangle className="w-12 h-12 text-primary" />,
  info: <Info className="w-12 h-12 text-secondary" />,
};

export default function ResultModal({
  open,
  onClose,
  variant,
  title,
  message,
  primaryAction,
  secondaryAction,
}: ResultModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative bg-card rounded-xl shadow-xl max-w-sm w-full p-6 animate-fade-in text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-muted rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="flex justify-center mb-4">{ICONS[variant]}</div>
        <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>

        <div className="flex gap-3 justify-center">
          {secondaryAction && (
            <button onClick={secondaryAction.onClick} className="fb-btn-outline min-w-[100px]">
              {secondaryAction.label}
            </button>
          )}
          {primaryAction && (
            <button onClick={primaryAction.onClick} className="fb-btn-primary min-w-[100px]">
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
