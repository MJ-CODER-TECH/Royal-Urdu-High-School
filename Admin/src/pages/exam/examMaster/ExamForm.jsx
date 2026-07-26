import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schema with better type transformations
const schema = z.object({
  academic_year_id: z.string().min(1, "Academic Year is required"),
  class_id: z.string().min(1, "Class is required"),
  exam_name: z.string().min(1, "Exam Name is required"),
  exam_date: z.string().min(1, "Exam Date is required"),
  max_marks: z
    .string()
    .min(1, "Maximum Marks is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Maximum marks must be a positive number",
    }),
  is_active: z.boolean().default(true),
});

const ExamForm = ({ selectedExam, onSubmit, submitting, onCancel }) => {
  const dispatch = useDispatch();

  // Primary source from redux with fallback safety
  const { classes = [], academicYears = [] } = useSelector(
    (state) => state.exam || {}
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      academic_year_id: "",
      class_id: "",
      exam_name: "",
      exam_date: "",
      max_marks: "",
      is_active: true,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Populating Form Data on Edit
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (selectedExam) {
      // Safe Date Formatting for HTML date input (YYYY-MM-DD)
      let formattedDate = "";
      if (selectedExam.exam_date) {
        formattedDate = selectedExam.exam_date.substring(0, 10);
      }

      reset({
        academic_year_id: selectedExam.academic_year_id
          ? String(selectedExam.academic_year_id)
          : "",
        class_id: selectedExam.class_id ? String(selectedExam.class_id) : "",
        exam_name: selectedExam.exam_name || "",
        exam_date: formattedDate,
        max_marks: selectedExam.max_marks ? String(selectedExam.max_marks) : "",
        is_active: selectedExam.status === "Active",
      });
    } else {
      reset({
        academic_year_id: "",
        class_id: "",
        exam_name: "",
        exam_date: "",
        max_marks: "",
        is_active: true,
      });
    }
  }, [selectedExam, reset]);

  /*
  |--------------------------------------------------------------------------
  | Handle Form Submission
  |--------------------------------------------------------------------------
  */
  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      academic_year_id: Number(data.academic_year_id),
      class_id: Number(data.class_id),
      max_marks: Number(data.max_marks),
      status: data.is_active ? "Active" : "Inactive",
      exam_date: data.exam_date ? data.exam_date.substring(0, 10) : "",
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      {/* Grid Row 1: Academic Year & Class */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Academic Year */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Academic Year <span className="text-red-500">*</span>
          </label>
          <select
            {...register("academic_year_id")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Academic Year</option>
            {academicYears.map((year) => (
              <option
                key={year.academic_year_id}
                value={year.academic_year_id}
              >
                {year.year_start} - {year.year_end}
              </option>
            ))}
          </select>
          {errors.academic_year_id && (
            <p className="mt-1 text-xs text-red-500">
              {errors.academic_year_id.message}
            </p>
          )}
        </div>

        {/* Class */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Class <span className="text-red-500">*</span>
          </label>
          <select
            {...register("class_id")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            {classes.map((item) => (
              <option key={item.class_id} value={item.class_id}>
                {item.class_name}
              </option>
            ))}
          </select>
          {errors.class_id && (
            <p className="mt-1 text-xs text-red-500">
              {errors.class_id.message}
            </p>
          )}
        </div>
      </div>

      {/* Exam Name */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Exam Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Mid-Term Examination"
          {...register("exam_name")}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {errors.exam_name && (
          <p className="mt-1 text-xs text-red-500">
            {errors.exam_name.message}
          </p>
        )}
      </div>

      {/* Grid Row 2: Date & Max Marks */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Exam Date */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Exam Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            {...register("exam_date")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.exam_date && (
            <p className="mt-1 text-xs text-red-500">
              {errors.exam_date.message}
            </p>
          )}
        </div>

        {/* Max Marks */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Maximum Marks <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            placeholder="100"
            {...register("max_marks")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.max_marks && (
            <p className="mt-1 text-xs text-red-500">
              {errors.max_marks.message}
            </p>
          )}
        </div>
      </div>

      {/* Active Toggle Option */}
      <div className="flex items-center gap-2 pt-2">
        <input
          id="is_active"
          type="checkbox"
          {...register("is_active")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="text-sm text-gray-700 font-medium select-none">
          Active Status
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : selectedExam
            ? "Update Exam"
            : "Create Exam"}
        </button>
      </div>
    </form>
  );
};

export default ExamForm;