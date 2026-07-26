import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";

const schema = z.object({
  class_name: z
    .string()
    .trim()
    .min(1, "Class Name is required")
    .max(100, "Class Name must be less than 100 characters"),

  description: z.string().trim().optional(),

  is_active: z.boolean().default(true),
});

const ClassForm = ({
  selectedClass,
  onSubmit,
  onCancel,
  submitting = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      class_name: "",
      description: "",
      is_active: true,
    },
  });

  const isActive = watch("is_active");

  useEffect(() => {
    if (selectedClass) {
      reset({
        class_name: selectedClass.class_name || "",
        description: selectedClass.description || "",
        is_active: Boolean(selectedClass.is_active),
      });
    } else {
      reset({
        class_name: "",
        description: "",
        is_active: true,
      });
    }
  }, [selectedClass, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Class Name */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Class Name <span className="text-rose-500">*</span>
        </label>

        <input
          type="text"
          placeholder="e.g. Class 10 - Grade A"
          {...register("class_name")}
          className={`w-full rounded-lg border px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 ${
            errors.class_name
              ? "border-rose-400 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
          }`}
        />

        {errors.class_name && (
          <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-rose-500">
            <AlertCircle size={14} />
            {errors.class_name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Description
        </label>

        <textarea
          rows={3}
          placeholder="Optional brief description of the class..."
          {...register("description")}
          className="w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Status Toggle Card */}
      <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 flex items-center justify-between">
        <div>
          <label htmlFor="is_active" className="text-sm font-semibold text-slate-800 cursor-pointer block">
            Status
          </label>
          <p className="text-xs text-slate-500">
            {isActive ? "Class is currently active" : "Class is inactive and hidden"}
          </p>
        </div>

        <label htmlFor="is_active" className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            id="is_active"
            {...register("is_active")}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all disabled:opacity-60 cursor-pointer"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          {submitting
            ? "Saving..."
            : selectedClass
            ? "Update Class"
            : "Create Class"}
        </button>
      </div>
    </form>
  );
};

export default ClassForm;