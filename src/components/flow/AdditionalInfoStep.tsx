import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "@/components/form/InputField";
import FileUpload from "@/components/form/FileUpload";
import { ACCEPTED_FILE_TYPES, MAX_FILE_SIZE } from "@/utils/constants";

const additionalInfoSchema = z.object({
  occupation: z.string().min(1, "Occupation is required"),
  natureOfBusiness: z.string().min(1, "Nature of business is required"),
  employerName: z.string().optional(),
  employerAddress: z.string().optional(),
  annualTurnOver: z.string().optional(),
  utilityBillFile: z
    .instanceof(File, { message: "Utility bill is required" })
    .refine((f) => ACCEPTED_FILE_TYPES.includes(f.type), "Invalid file type")
    .refine((f) => f.size <= MAX_FILE_SIZE, "File too large")
    .nullable()
    .optional(),
});

export type AdditionalInfoFormValues = z.infer<typeof additionalInfoSchema>;

interface AdditionalInfoStepProps {
  onSubmit: (data: AdditionalInfoFormValues) => void;
  onSkip: () => void;
  isSubmitting: boolean;
}

export default function AdditionalInfoStep({
  onSubmit,
  onSkip,
  isSubmitting,
}: AdditionalInfoStepProps) {
  const [showUpload, setShowUpload] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdditionalInfoFormValues>({
    resolver: zodResolver(additionalInfoSchema),
    defaultValues: {
      occupation: "",
      natureOfBusiness: "",
      employerName: "",
      employerAddress: "",
      annualTurnOver: "",
      utilityBillFile: null,
    },
  });

  return (
    <div className="animate-fade-in w-full max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Please proceed to update information on your account
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          label="Occupation (compulsory*)"
          placeholder="Enter your occupation"
          {...register("occupation")}
          error={errors.occupation}
        />

        <InputField
          label="Nature of Business (compulsory*)"
          placeholder="Enter nature of business"
          {...register("natureOfBusiness")}
          error={errors.natureOfBusiness}
        />

        <InputField
          label="Employer Name"
          placeholder="Enter employer name"
          {...register("employerName")}
          error={errors.employerName}
        />

        <InputField
          label="Employer Address"
          placeholder="Enter employer address"
          {...register("employerAddress")}
          error={errors.employerAddress}
        />

        <InputField
          label="Annual Turn-Over"
          placeholder="Enter annual turn-over"
          {...register("annualTurnOver")}
          error={errors.annualTurnOver}
        />

        {/* Additional document section */}
        <div className="border rounded-lg p-4 space-y-3 bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground">Additional document required</h3>
          <p className="text-xs text-muted-foreground">
            Utility bill (less than six months)
          </p>

          {showUpload ? (
            <Controller
              name="utilityBillFile"
              control={control}
              render={({ field }) => (
                <FileUpload
                  label="Upload Utility Bill"
                  onChange={(file) => field.onChange(file)}
                  value={field.value}
                  error={errors.utilityBillFile?.message}
                />
              )}
            />
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onSkip}
                className="fb-btn-outline text-sm"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className="fb-btn-primary text-sm"
              >
                Upload now
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="fb-btn-primary w-full sm:w-auto"
        >
          {isSubmitting ? "Submitting..." : "Complete now"}
        </button>
      </form>
    </div>
  );
}
