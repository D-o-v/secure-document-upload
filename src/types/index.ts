export type ServiceType =
  | "account-conversion"
  | "account-upgrade"
  | "address-update"
  | "date-of-birth"
  | "dormant-reactivation"
  | "email-update"
  | "identity-document"
  | "phone-number"
  | "bvn-update";

export interface ServiceCard {
  id: ServiceType;
  title: string;
  icon: string;
  requirements: string[];
  actionLabel: string;
}

export type FlowStep =
  | "consent"
  | "verification"
  | "otp"
  | "form"
  | "terms"
  | "additional-info"
  | "complete";

export type SubmissionOutcome = "success" | "failure" | "additional-info";

export interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  status: "uploading" | "complete" | "error";
  id: string;
}

export type IDDocumentType =
  | "voters-card"
  | "national-id"
  | "drivers-license"
  | "international-passport";

export interface IDUpdateFormData {
  accountNumber: string;
  nin: string;
  idDocumentType: IDDocumentType | "";
  idDocumentNumber: string;
  idFrontFile: File | null;
  idBackFile: File | null;
  utilityBillFile: File | null;
}

export interface OTPVerificationData {
  accountNumber: string;
  otp: string[];
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}
