import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import FileUpload from "@/components/form/FileUpload";
import {
  ID_DOCUMENT_TYPES,
  ACCEPTED_FILE_TYPES,
  MAX_FILE_SIZE,
  ACCOUNT_UPGRADE_TIERS,
} from "@/utils/constants";

const accountUpgradeSchema = z.object({
  upgradeTier: z.string().min(1, "Please select an upgrade tier"),
  bvn: z
    .string()
    .min(11, "BVN must be 11 digits")
    .max(11, "BVN must be 11 digits")
    .regex(/^\d+$/, "BVN must contain only digits"),
  nin: z
    .string()
    .min(11, "NIN must be 11 digits")
    .max(11, "NIN must be 11 digits")
    .regex(/^\d+$/, "NIN must contain only digits"),
  idDocumentType: z.string().min(1, "Please select an ID document type"),
  idDocumentNumber: z
    .string()
    .min(1, "Identity document number is required")
    .max(50, "Document number too long"),
  proofOfIdentityFile: z
    .instanceof(File, { message: "Proof of identity is required" })
    .refine((f) => ACCEPTED_FILE_TYPES.includes(f.type), "Invalid file type")
    .refine((f) => f.size <= MAX_FILE_SIZE, "File too large"),
});

export type AccountUpgradeFormValues = z.infer<typeof accountUpgradeSchema>;

interface AccountUpgradeFormStepProps {
  accountNumber: string;
  onSubmit: (data: AccountUpgradeFormValues) => void;
  isSubmitting: boolean;
}

export default function AccountUpgradeFormStep({
  accountNumber,
  onSubmit,
  isSubmitting,
}: AccountUpgradeFormStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AccountUpgradeFormValues>({
    resolver: zodResolver(accountUpgradeSchema),
    defaultValues: {
      upgradeTier: "",
      bvn: "",
      nin: "",
      idDocumentType: "",
      idDocumentNumber: "",
      proofOfIdentityFile: undefined,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in space-y-5 w-full max-w-2xl mx-auto">
      <InputField
        label="Account number"
        value={accountNumber}
        readOnly
        disabled
      />

      <Controller
        name="upgradeTier"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Upgrade Tier"
            options={ACCOUNT_UPGRADE_TIERS}
            placeholder="Select account tier"
            error={errors.upgradeTier}
            {...field}
          />
        )}
      />

      <InputField
        label="BVN"
        placeholder="Enter your BVN"
        {...register("bvn")}
        error={errors.bvn}
        maxLength={11}
        inputMode="numeric"
      />

      <InputField
        label="NIN"
        placeholder="Enter your NIN"
        {...register("nin")}
        error={errors.nin}
        maxLength={11}
        inputMode="numeric"
      />

      <Controller
        name="idDocumentType"
        control={control}
        render={({ field }) => (
          <SelectField
            label="Proof of Identity type"
            options={ID_DOCUMENT_TYPES}
            placeholder="Choose Identity Document type"
            error={errors.idDocumentType}
            {...field}
          />
        )}
      />

      <InputField
        label="Identity Document number"
        placeholder="Enter the Identity Document number"
        {...register("idDocumentNumber")}
        error={errors.idDocumentNumber}
      />

      <Controller
        name="proofOfIdentityFile"
        control={control}
        render={({ field }) => (
          <FileUpload
            label="Upload Proof of Identity"
            onChange={(file) => field.onChange(file)}
            value={field.value}
            error={errors.proofOfIdentityFile?.message}
          />
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="fb-btn-primary w-full sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Upgrade Account"}
      </button>
    </form>
  );
}
