import { useCallback, useState, useRef, type DragEvent } from "react";
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL } from "@/utils/constants";
import UploadInstructionsModal from "@/components/ui/UploadInstructionsModal";

interface FileUploadProps {
  label: string;
  sublabel?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  error?: string;
  accept?: string[];
  maxSize?: number;
  showInstructions?: boolean;
  documentType?: "id" | "passport";
}

export default function FileUpload({
  label,
  sublabel,
  onChange,
  value,
  error,
  accept = ACCEPTED_FILE_TYPES,
  maxSize = MAX_FILE_SIZE,
  showInstructions = false,
  documentType = "id",
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!accept.includes(file.type)) {
        return `Invalid file type. Accepted: PDF, JPG, PNG`;
      }
      if (file.size > maxSize) {
        return `File too large. Maximum size: ${MAX_FILE_SIZE_LABEL}`;
      }
      return null;
    },
    [accept, maxSize]
  );

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        onChange(null);
        setPreview(null);
        return;
      }

      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 20;
        });
      }, 200);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }

      onChange(file);
    },
    [onChange, validateFile]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    onChange(null);
    setPreview(null);
    setUploadProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleZoneClick = () => {
    if (showInstructions && !value) {
      setShowModal(true);
    } else {
      inputRef.current?.click();
    }
  };

  const handleInstructionsContinue = () => {
    setShowModal(false);
    inputRef.current?.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-1.5">
      <label className="fb-label">{label}</label>
      {sublabel && <p className="text-xs text-muted-foreground mb-2">{sublabel}</p>}

      {!value ? (
        <div
          className={`fb-upload-zone ${isDragging ? "fb-upload-zone-active" : ""}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleZoneClick}
          role="button"
          tabIndex={0}
          aria-label={`Upload ${label}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleZoneClick();
            }
          }}
        >
          <Upload className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">
            Choose a file or drag it here
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Supported files: PDF and JPG, PNG ({MAX_FILE_SIZE_LABEL} maximum size)
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-3 animate-fade-in">
          <div className="flex items-start gap-3">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-12 h-12 object-cover rounded border border-border"
              />
            ) : (
              <div className="w-12 h-12 bg-primary/10 rounded flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {value.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(value.size)}
              </p>
              {uploadProgress !== null && uploadProgress < 100 && (
                <div className="fb-progress-bar mt-2">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}
              {uploadProgress === 100 && (
                <div className="flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                  <span className="text-xs text-success">Upload complete</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={removeFile}
              className="p-1 hover:bg-muted rounded transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept.join(",")}
        onChange={handleInputChange}
        aria-hidden="true"
      />

      {error && (
        <div className="flex items-center gap-1.5 mt-1">
          <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
          <p className="fb-error mt-0">{error}</p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Document must be clear, legible and genuine. Upload original file.
      </p>

      <UploadInstructionsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onContinue={handleInstructionsContinue}
        documentType={documentType}
      />
    </div>
  );
}
