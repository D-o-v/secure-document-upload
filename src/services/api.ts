import type { APIResponse, SubmissionOutcome } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VALID_ACCOUNTS = ["1234567890", "1111111111", "2222222222"];

export async function verifyAccount(accountNumber: string): Promise<APIResponse<{ phone: string; email: string }>> {
  await delay(1500);
  if (!VALID_ACCOUNTS.includes(accountNumber)) {
    return { success: false, message: "Account not found. Please check your account number." };
  }
  return {
    success: true,
    message: "OTP sent successfully",
    data: {
      phone: "+2348*****19",
      email: "ab****@gmail.com",
    },
  };
}

export async function verifyOTP(accountNumber: string, otp: string): Promise<APIResponse> {
  await delay(1200);
  if (otp !== "123456") {
    return { success: false, message: "The OTP code entered is wrong or expired." };
  }
  return { success: true, message: "OTP verified successfully" };
}

export async function submitIDUpdate(formData: FormData): Promise<APIResponse<{ outcome: SubmissionOutcome }>> {
  await delay(2500);
  const accountNumber = formData.get("accountNumber") as string;

  if (accountNumber === "1111111111") {
    return {
      success: false,
      message: "Your update request is failed. Kindly visit the nearest branch.",
      data: { outcome: "failure" },
    };
  }

  if (accountNumber === "2222222222") {
    return {
      success: true,
      message: "Please proceed to update information on your account.",
      data: { outcome: "additional-info" },
    };
  }

  // Default (e.g. 1234567890): direct success
  return {
    success: true,
    message: "Your update request is in progress. It will be treated within 24 hours.",
    data: { outcome: "success" },
  };
}

export async function submitAccountUpgrade(formData: FormData): Promise<APIResponse> {
  await delay(2500);
  const shouldFail = Math.random() < 0.15;
  if (shouldFail) {
    return { success: false, message: "Your account upgrade request failed. Kindly check the reason and resubmit." };
  }
  return { success: true, message: "Your account upgrade request is in progress, it will be updated within 24 hours." };
}

export async function submitAdditionalInfo(formData: FormData): Promise<APIResponse> {
  await delay(2000);
  return {
    success: true,
    message: "Your update request is in progress. It will be treated within 24 hours.",
  };
}

export async function uploadFile(
  file: File,
  onProgress: (progress: number) => void
): Promise<APIResponse<{ url: string }>> {
  const totalSteps = 10;
  for (let i = 1; i <= totalSteps; i++) {
    await delay(200);
    onProgress(Math.round((i / totalSteps) * 100));
  }
  return {
    success: true,
    message: "File uploaded successfully",
    data: { url: URL.createObjectURL(file) },
  };
}
