import { forwardRef, type SelectHTMLAttributes } from "react";
import type { FieldError } from "react-hook-form";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly Option[];
  error?: FieldError;
  placeholder?: string;
}

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, error, placeholder = "Select an option", id, ...props }, ref) => {
    const selectId = id || label.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="space-y-1.5">
        <label htmlFor={selectId} className="fb-label">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`fb-select pr-10 ${error ? "border-destructive focus:ring-destructive" : ""}`}
            aria-invalid={!!error}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        </div>
        {error && (
          <p className="fb-error" role="alert">{error.message}</p>
        )}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
export default SelectField;
