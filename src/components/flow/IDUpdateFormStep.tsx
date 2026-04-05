import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "@/components/form/InputField";
import SelectField from "@/components/form/SelectField";
import FileUpload from "@/components/form/FileUpload";
import { ID_DOCUMENT_TYPES, ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

const idUpdateSchema = z.object({
  nin: z.string().min(11, "NIN must be 11 digits").max(11, "NIN must be 11 digits").regex(/^\d+$/, "NIN must contain only digits"),
  idDocumentType: z.string().min(1, "Please select an ID document type"),
  idDocumentNumber: z.string().min(1, "Identity document number is required").max(50, "Document number too long"),
  idFrontFile: z
    .instanceof(File, { message: "Front of ID document is required" })
    .refine((f) => ACCEPTED_FILE_TYPES.includes(f.type), "Invalid file type")
    .refine((f) => f.size <= MAX_FILE_SIZE, "File too large"),
  idBackFile: z
    .instanceof(File, { message: "Back of ID document is required" })
    .refine((f) => ACCEPTED_FILE_TYPES.includes(f.type), "Invalid file type")
    .refine((f) => f.size <= MAX_FILE_SIZE, "File too large"),
  utilityBillFile: z
    .instanceof(File, { message: "Utility bill is required" })
    .refine((f) => ACCEPTED_FILE_TYPES.includes(f.type), "Invalid file type")
    .refine((f) => f.size <= MAX_FILE_SIZE, "File too large")
    .nullable()
    .optional(),
});

export type IDUpdateFormValues = z.infer<typeof idUpdateSchema>;

interface IDUpdateFormStepProps {
  accountNumber: string;
  onSubmit: (data: IDUpdateFormValues) => void;
  isSubmitting: boolean;
}

export default function IDUpdateFormStep({
  accountNumber,
  onSubmit,
  isSubmitting,
}: IDUpdateFormStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IDUpdateFormValues>({
    resolver: zodResolver(idUpdateSchema),
    defaultValues: {
      nin: "",
      idDocumentType: "",
      idDocumentNumber: "",
      idFrontFile: undefined,
      idBackFile: undefined,
      utilityBillFile: null,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-fade-in space-y-5 w-full max-w-2xl mx-auto">
      {/* Account number (read-only) */}
      <InputField
        label="Account number"
        value={accountNumber}
        readOnly
        disabled
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
            label="Identity Document type"
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

      {/* File uploads */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Controller
          name="idFrontFile"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Upload your Identity Document (Front)"
              sublabel="Front"
              onChange={(file) => field.onChange(file)}
              value={field.value}
              error={errors.idFrontFile?.message}
              showInstructions
              documentType="id"
            />
          )}
        />
        <Controller
          name="idBackFile"
          control={control}
          render={({ field }) => (
            <FileUpload
              label="Upload your Identity Document (Back)"
              sublabel="Back"
              onChange={(file) => field.onChange(file)}
              value={field.value}
              error={errors.idBackFile?.message}
            />
          )}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Document must be clear, legible and genuine. Upload uprightly.
      </p>

      <Controller
        name="utilityBillFile"
        control={control}
        render={({ field }) => (
          <FileUpload
            label="Upload your Utility bill"
            onChange={(file) => field.onChange(file)}
            value={field.value}
            error={errors.utilityBillFile?.message}
          />
        )}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="fb-btn-primary w-full sm:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Update"}
      </button>
    </form>
  );
}
