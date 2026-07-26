import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { X, Loader2, CreditCard } from "lucide-react";

import { assignStudentFee } from "../../../redux/fee/studentFee/studentFeeThunk";
import { fetchAcademicYears } from "../../../redux/master/AcademicYearThunk";
import { fetchClasses } from "../../../redux/master/Classmasterthunk";

const GenerateFeeModal = ({ open, close }) => {
  const dispatch = useDispatch();

  const { submitting = false } = useSelector((state) => state.studentFee || {});

  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  const { classes = [] } = useSelector(
    (state) => state.classMaster || {}
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      academic_year_id: "",
      class_id: "",
    },
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchAcademicYears());
      dispatch(fetchClasses());
    }
  }, [dispatch, open]);

  const handleClose = () => {
    reset();
    close?.();
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        academic_year_id: Number(data.academic_year_id),
        class_id: Number(data.class_id),
        discount: 0,
        fine: 0,
        previous_balance: 0,
      };

      await dispatch(assignStudentFee(payload)).unwrap();
      toast.success("Student fees generated successfully!");
      handleClose();
    } catch (error) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Failed to generate student fees";
      toast.error(errorMessage);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Generate Student Fee
              </h2>
              <p className="text-xs text-gray-500">
                Assign fee structures for a specific class & year
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* ACADEMIC YEAR */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Academic Year <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("academic_year_id", {
                required: "Academic year is required",
              })}
              className={`w-full bg-gray-50/50 border rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.academic_year_id
                  ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              }`}
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((item) => (
                <option
                  key={item.academic_year_id}
                  value={item.academic_year_id}
                >
                  {item.academic_year ||
                    (item.year_start && item.year_end
                      ? `${item.year_start} - ${item.year_end}`
                      : item.year_name || item.academic_year_id)}
                </option>
              ))}
            </select>
            {errors.academic_year_id && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.academic_year_id.message}
              </p>
            )}
          </div>

          {/* CLASS */}
          <div>
            <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-600">
              Class <span className="text-rose-500">*</span>
            </label>
            <select
              {...register("class_id", {
                required: "Class selection is required",
              })}
              className={`w-full bg-gray-50/50 border rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 transition-all cursor-pointer ${
                errors.class_id
                  ? "border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50/30"
                  : "border-gray-300 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white"
              }`}
            >
              <option value="">Select Class</option>
              {classes.map((item) => (
                <option key={item.class_id} value={item.class_id}>
                  {item.class_name}
                </option>
              ))}
            </select>
            {errors.class_id && (
              <p className="mt-1 text-xs text-rose-500 font-medium">
                {errors.class_id.message}
              </p>
            )}
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{submitting ? "Generating..." : "Generate Fee"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GenerateFeeModal;