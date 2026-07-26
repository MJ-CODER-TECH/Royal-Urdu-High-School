import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { fetchClasses } from "../../../redux/master/classMasterThunk";

const schema = z.object({
  class_id: z.string().min(1, "Class is required"),
  section_name: z.string().min(1, "Section name is required"),
  capacity: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Capacity must be a positive number",
    }),
  is_active: z.boolean().default(true),
});

const DEFAULT_FORM_VALUES = {
  class_id: "",
  section_name: "",
  capacity: "",
  is_active: true,
};

const SectionForm = ({ selectedSection, onSubmit, submitting }) => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state) => state.classMaster);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    dispatch(fetchClasses());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSection) {
      reset({
        class_id: String(selectedSection.class_id ?? ""),
        section_name: selectedSection.section_name ?? "",
        capacity: selectedSection.capacity != null ? String(selectedSection.capacity) : "",
        is_active: Boolean(selectedSection.is_active ?? true),
      });
    } else {
      reset(DEFAULT_FORM_VALUES);
    }
  }, [selectedSection, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Class Field */}
      <div>
        <label htmlFor="class_id" className="mb-1 block text-sm font-medium">
          Class
        </label>
        <select
          id="class_id"
          {...register("class_id")}
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Class</option>
          {classes?.map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
            </option>
          ))}
        </select>
        {errors.class_id && (
          <p className="mt-1 text-sm text-red-500">{errors.class_id.message}</p>
        )}
      </div>

      {/* Section Name Field */}
      <div>
        <label htmlFor="section_name" className="mb-1 block text-sm font-medium">
          Section Name
        </label>
        <input
          id="section_name"
          type="text"
          placeholder="Enter Section Name"
          {...register("section_name")}
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.section_name && (
          <p className="mt-1 text-sm text-red-500">{errors.section_name.message}</p>
        )}
      </div>

      {/* Capacity Field */}
      <div>
        <label htmlFor="capacity" className="mb-1 block text-sm font-medium">
          Capacity
        </label>
        <input
          id="capacity"
          type="number"
          placeholder="Enter Capacity"
          {...register("capacity")}
          className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.capacity && (
          <p className="mt-1 text-sm text-red-500">{errors.capacity.message}</p>
        )}
      </div>

      {/* Active Status Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          {...register("is_active")}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
          Active
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {submitting
            ? "Saving..."
            : selectedSection
            ? "Update Section"
            : "Create Section"}
        </button>
      </div>
    </form>
  );
};

export default SectionForm;