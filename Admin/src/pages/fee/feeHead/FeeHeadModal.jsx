import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  createFeeHead,
  updateFeeHead,
} from "../../../redux/fee/feeHead/feeHeadThunk";

const INITIAL_FORM = {
  fee_name: "",
  description: "",
  status: "Active",
};

const FeeHeadModal = ({ open, close, data }) => {
  const dispatch = useDispatch();

  const { submitting = false } = useSelector(
    (state) => state.feeHead || {}
  );

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  // Form Reset and Data Populate Effect
  useEffect(() => {
    if (data) {
      setForm({
        fee_name: data.fee_name || "",
        description: data.description || "",
        status: data.status || "Active",
      });
    } else {
      setForm(INITIAL_FORM);
    }
    setErrors({});
  }, [data, open]);

  // Close modal on Escape Key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        close(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on user typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.fee_name.trim()) {
      newErrors.fee_name = "Fee Head name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (data) {
        await dispatch(
          updateFeeHead({
            id: data.fee_head_id,
            data: form,
          })
        ).unwrap();

        toast.success("Fee Head updated successfully");
      } else {
        await dispatch(createFeeHead(form)).unwrap();
        toast.success("Fee Head created successfully");
      }

      // True pass karne se FeeHeadPage list refresh call karega
      close(true);
    } catch (error) {
      toast.error(error?.message || error || "Something went wrong");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
      onClick={() => close(false)} // Outside click close
    >
      <div
        className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal box click
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">
            {data ? "Edit Fee Head" : "Add Fee Head"}
          </h2>

          <button
            type="button"
            onClick={() => close(false)}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* FEE HEAD NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fee Head Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fee_name"
              value={form.fee_name}
              onChange={handleChange}
              placeholder="e.g. Tuition Fee, Admission Fee"
              className={`w-full px-3 py-2 border rounded-lg text-sm transition-all outline-none ${
                errors.fee_name
                  ? "border-red-500 focus:ring-2 focus:ring-red-200"
                  : "border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
            {errors.fee_name && (
              <p className="text-xs text-red-500 mt-1">{errors.fee_name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter brief details about this fee head"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => close(false)}
              className="w-1/2 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium text-sm flex justify-center items-center gap-2 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              <span>{data ? "Update" : "Save"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeeHeadModal;