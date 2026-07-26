import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

const currentYear = new Date().getFullYear();

const schema = z
  .object({
    year_start: z
      .string()
      .min(1, "Start year is required")
      .regex(/^\d{4}$/, "Must be a valid 4-digit year"),
    year_end: z
      .string()
      .min(1, "End year is required")
      .regex(/^\d{4}$/, "Must be a valid 4-digit year"),
    is_current: z.boolean().default(false),
    is_active: z.boolean().default(true),
  })
  .refine(
    (data) => parseInt(data.year_end, 10) >= parseInt(data.year_start, 10),
    {
      message: "End year must be equal to or greater than start year",
      path: ["year_end"],
    }
  );

const AcademicYearForm = ({
  selectedAcademicYear,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      year_start: "",
      year_end: "",
      is_current: false,
      is_active: true,
    },
  });

  useEffect(() => {
    if (selectedAcademicYear) {
      reset({
        year_start: String(selectedAcademicYear.year_start ?? ""),
        year_end: String(selectedAcademicYear.year_end ?? ""),
        is_current: Boolean(selectedAcademicYear.is_current),
        is_active: Boolean(selectedAcademicYear.is_active ?? true),
      });
    } else {
      reset({
        year_start: "",
        year_end: "",
        is_current: false,
        is_active: true,
      });
    }
  }, [selectedAcademicYear, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Year Inputs Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Start Year */}
        <div>
          <label
            htmlFor="year_start"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            Start Year <span className="text-red-500">*</span>
          </label>
          <input
            id="year_start"
            type="number"
            placeholder={String(currentYear)}
            {...register("year_start")}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
              errors.year_start
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            }`}
          />
          {errors.year_start && (
            <p className="mt-1 text-xs text-red-500">
              {errors.year_start.message}
            </p>
          )}
        </div>

        {/* End Year */}
        <div>
          <label
            htmlFor="year_end"
            className="mb-1.5 block text-xs font-semibold text-slate-700"
          >
            End Year <span className="text-red-500">*</span>
          </label>
          <input
            id="year_end"
            type="number"
            placeholder={String(currentYear + 1)}
            {...register("year_end")}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
              errors.year_end
                ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            }`}
          />
          {errors.year_end && (
            <p className="mt-1 text-xs text-red-500">
              {errors.year_end.message}
            </p>
          )}
        </div>
      </div>

      {/* Checkbox Options */}
      <div className="space-y-3 pt-2">
        {/* Is Current */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("is_current")}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Set as Current Academic Year
          </span>
        </label>

        {/* Is Active */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            {...register("is_active")}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
          />
          <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Active Status
          </span>
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting
            ? "Saving..."
            : selectedAcademicYear
            ? "Update Academic Year"
            : "Create Academic Year"}
        </button>
      </div>
    </form>
  );
};

export default AcademicYearForm;