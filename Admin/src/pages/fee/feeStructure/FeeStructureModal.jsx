import { useEffect, useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  createFeeStructure,
  updateFeeStructure,
} from "../../../redux/fee/feeStructure/feeStructureThunk";

const INITIAL_FORM_STATE = {
  academic_year_id: "",
  class_id: "",
  fee_head_id: "",
  amount: "",
  due_date: "",
  installment_no: "",
  status: "Active",
};

const FeeStructureModal = ({
  open,
  close,
  data,
  classes = [],
  feeHeads = [],
  academicYears = [],
}) => {
  const dispatch = useDispatch();

  const { submitting } = useSelector(
    (state) => state.feeStructure || {}
  );

  const [form, setForm] = useState(INITIAL_FORM_STATE);

  /*
  |--------------------------------------------------------------------------
  | Sync Form Data on Modal Open / Data Prop Change
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (open) {
      if (data) {
        setForm({
          academic_year_id: data.academic_year_id || "",
          class_id: data.class_id || "",
          fee_head_id: data.fee_head_id || "",
          amount: data.amount ?? "",
          due_date: data.due_date ? data.due_date.split("T")[0] : "",
          installment_no: data.installment_no ?? "",
          status: data.status || "Active",
        });
      } else {
        setForm(INITIAL_FORM_STATE);
      }
    }
  }, [data, open]);

  /*
  |--------------------------------------------------------------------------
  | Keyboard Accessibility (ESC key to close)
  |--------------------------------------------------------------------------
  */
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && !submitting) {
        close();
      }
    },
    [close, submitting]
  );

  useEffect(() => {
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open, handleKeyDown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Form Validation & Submission
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.academic_year_id) {
      toast.error("Please select Academic Year");
      return;
    }
    if (!form.class_id) {
      toast.error("Please select Class");
      return;
    }
    if (!form.fee_head_id) {
      toast.error("Please select Fee Head");
      return;
    }
    if (form.amount === "" || Number(form.amount) <= 0) {
      toast.error("Please enter a valid Amount");
      return;
    }
    if (!form.due_date) {
      toast.error("Please select Due Date");
      return;
    }
    if (form.installment_no === "" || Number(form.installment_no) <= 0) {
      toast.error("Please enter a valid Installment Number");
      return;
    }

    const payload = {
      ...form,
      amount: Number(form.amount),
      installment_no: Number(form.installment_no),
    };

    try {
      if (data) {
        await dispatch(
          updateFeeStructure({
            id: data.structure_id,
            data: payload,
          })
        ).unwrap();
        toast.success("Fee Structure Updated Successfully");
      } else {
        await dispatch(createFeeStructure(payload)).unwrap();
        toast.success("Fee Structure Created Successfully");
      }
      close();
    } catch (error) {
      toast.error(error?.message || error || "Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && !submitting && close()}
    >
      <div className="bg-white rounded-xl w-full max-w-xl p-6 shadow-2xl transition-all my-8">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {data ? "Edit Fee Structure" : "Add Fee Structure"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Fill in the structure details for fee collection.
            </p>
          </div>

          <button
            type="button"
            onClick={close}
            disabled={submitting}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* ACADEMIC YEAR */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Academic Year <span className="text-red-500">*</span>
              </label>
              <select
                name="academic_year_id"
                value={form.academic_year_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((item) => (
                  <option
                    key={item.academic_year_id}
                    value={item.academic_year_id}
                  >
                    {item.year_start} - {item.year_end}
                  </option>
                ))}
              </select>
            </div>

            {/* CLASS */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Class <span className="text-red-500">*</span>
              </label>
              <select
                name="class_id"
                value={form.class_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select Class</option>
                {classes.map((item) => (
                  <option key={item.class_id} value={item.class_id}>
                    {item.class_name}
                  </option>
                ))}
              </select>
            </div>

            {/* FEE HEAD */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Fee Head <span className="text-red-500">*</span>
              </label>
              <select
                name="fee_head_id"
                value={form.fee_head_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">Select Fee Head</option>
                {feeHeads.map((item) => (
                  <option key={item.fee_head_id} value={item.fee_head_id}>
                    {item.fee_name}
                  </option>
                ))}
              </select>
            </div>

            {/* AMOUNT */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                min="0"
                step="any"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 5000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* INSTALLMENT NO */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Installment No <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="installment_no"
                min="1"
                value={form.installment_no}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* DUE DATE */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="due_date"
                value={form.due_date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={close}
              disabled={submitting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-sm shadow-blue-200 disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{data ? "Update Structure" : "Save Structure"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeStructureModal;