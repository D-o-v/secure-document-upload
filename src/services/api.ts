import type { APIResponse } from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function verifyAccount(accountNumber: string): Promise<APIResponse<{ phone: string; email: string }>> {
  await delay(1500);
  if (accountNumber === "0000000000") {
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

export async function submitIDUpdate(formData: FormData): Promise<APIResponse> {
  await delay(2500);
  const shouldFail = Math.random() < 0.15;
  if (shouldFail) {
    return { success: false, message: "Your submission request is failed. Kindly check the reason and resubmit." };
  }
  return { success: true, message: "Your update request is in progress, it will be updated within 24 hours." };
}

export async function submitAccountUpgrade(formData: FormData): Promise<APIResponse> {
  await delay(2500);
  const shouldFail = Math.random() < 0.15;
  if (shouldFail) {
    return { success: false, message: "Your account upgrade request failed. Kindly check the reason and resubmit." };
  }
  return { success: true, message: "Your account upgrade request is in progress, it will be updated within 24 hours." };
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
