import type { ServiceCard } from "@/types";

export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILE_SIZE_LABEL = "10 MB";
export const OTP_LENGTH = 6;
export const OTP_RESEND_TIMEOUT = 30;
export const ACCOUNT_NUMBER_LENGTH = 10;

export const ID_DOCUMENT_TYPES = [
  { value: "voters-card", label: "Voters Card" },
  { value: "national-id", label: "National ID" },
  { value: "drivers-license", label: "Driver's License" },
  { value: "international-passport", label: "International Passport" },
] as const;

export const ACCOUNT_UPGRADE_TIERS = [
  { value: "tier-1", label: "Tier 1" },
  { value: "tier-2", label: "Tier 2" },
] as const;

export const SERVICES: ServiceCard[] = [
  {
    id: "account-conversion",
    title: "Account Conversion/ Migration",
    icon: "repeat",
    requirements: ["BVN", "NIN", "Proof of Identity (National ID applicable)", "Proof of Address (National ID applicable)"],
    actionLabel: "Convert your account",
  },
  {
    id: "account-upgrade",
    title: "Account Upgrade (Tier 1 and 2)",
    icon: "trending-up",
    requirements: ["BVN", "NIN", "Proof of Identity"],
    actionLabel: "Upgrade Tier 1 or Tier 2 account",
  },
  {
    id: "address-update",
    title: "Address Update",
    icon: "map-pin",
    requirements: ["BVN", "Proof of Identity", "Proof of Address"],
    actionLabel: "Update address",
  },
  {
    id: "date-of-birth",
    title: "Date of Birth Update",
    icon: "calendar",
    requirements: ["BVN", "Valid ID Card", "Proof of Identity or Court Affidavit"],
    actionLabel: "Update your date of birth",
  },
  {
    id: "dormant-reactivation",
    title: "Dormant Account Reactivation",
    icon: "refresh-cw",
    requirements: ["BVN", "Proof of Identity (National ID applicable)", "Proof of Address (National ID applicable)"],
    actionLabel: "Reactivate an account",
  },
  {
    id: "email-update",
    title: "Email Update",
    icon: "mail",
    requirements: ["BVN", "NIN"],
    actionLabel: "Update your email address",
  },
  {
    id: "identity-document",
    title: "Identity Document Update",
    icon: "file-text",
    requirements: ["BVN", "NIN", "Proof of Identity"],
    actionLabel: "Update identification document",
  },
  {
    id: "phone-number",
    title: "Phone Number Update",
    icon: "phone",
    requirements: ["BVN"],
    actionLabel: "Update your phone number",
  },
  {
    id: "bvn-update",
    title: "BVN Update",
    icon: "shield",
    requirements: ["Proof of Identity", "Affidavit"],
    actionLabel: "Update your BVN",
  },
];

export const CONSENT_TEXT = `I agree that FirstBank and its affiliates in the FBN Holdings Plc Group to collect, record, store, use, share, process and disclose all information including Personal Data and Sensitive Personal Data as defined in the Nigeria Data Protection Act, 2023 and similar data protection laws/regulations relating to you, your account, the products, the services of FirstBank, any related purpose and/or any communication you have with FirstBank, as provided by you or from third parties including, but not limited to, the following:

• To further to FirstBank and its affiliates in the FBN Holdings Plc Group to use your information to manage and administer your account(s), to inform your information with service providers, debt purchase agencies, credit reference agencies, debt collectors, governmental or regulatory bodies, credit reference and financial information verification vendors for verification.

• You acknowledge and agree that any such sharing or transfer of information will be on a confidential basis and according to the provisions of the Nigerian Data Protection Act, 2023. For more information on our privacy policy, please visit https://www.firstbanknigeria.com/privacy-policy/.

If you wish to withdraw your consent to Data processing relating to the processing of your personal information, you may do so at any time by calling us through FirstContact@FirstBankGroup.com or contact@FirstBankNigeria.com. Note that we will process your concerns. On those, of course, we will review them.

You hereby confirm that you have read and understand the content of this consent form. You hereby give your consent to FirstBank of Nigeria, or all FBN Holding Plc Group subsidiaries including Keystone Bank and Heritage Bank to use it.`;

export const TERMS_TEXT = `I, [Your Full Name or Legal Entity Name], hereby provide my consent to [Bank's Name] to open the following account(s) on my behalf:

1. Account Type: [e.g., Savings Account/Checking Account]
2. Account Currency: [e.g., USD, EUR]
3. Additional Account (if applicable): [Specify if opening multiple accounts]

I understand and agree to abide by the terms and conditions set forth by [Bank's Name], and I acknowledge receipt of the bank's account agreement and related documents. I confirm that all information provided for the account opening process is true, accurate, and complete to the best of my knowledge.

I authorize the bank to conduct any necessary background checks and verifications to assess my eligibility for opening and maintaining the specified account(s). This includes, but is not limited to, obtaining credit reports, verifying employment details, and contacting references.

I am aware that the account(s) may be subject to applicable fees, charges, and terms as outlined by the bank, and I accept responsibility for any such fees incurred in connection with the account(s).

I understand that the bank may provide electronic statements, notices, and other communications related to my account(s), and I consent to receive such communications electronically.

I acknowledge that the account(s) may be governed by the laws and regulations of the jurisdiction in which the bank operates, and I agree to comply with all applicable laws and regulations.

I understand that the bank may update its terms and conditions from time to time, and I agree to be bound by the revised terms upon notification by the bank.

I further authorize the bank to disclose information related to my account(s) to its affiliates, agents, and regulatory authorities, as required by law or for the purpose of providing banking services.

By signing below, I acknowledge that I have read and understood the contents of this Account Opening Consent Form, and I willingly provide my consent to open the specified account(s) with [Bank's Name].`;
