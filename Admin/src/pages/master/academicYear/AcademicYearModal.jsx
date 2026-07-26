import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";

import {
  createAcademicYear,
  updateAcademicYear,
  getAcademicYears,
} from "../../../redux/master/AcademicYearThunk";

import AcademicYearForm from "./AcademicYearForm";

const AcademicYearModal = ({ open, onClose, selectedAcademicYear }) => {
  const dispatch = useDispatch();

  const { submitting = false } = useSelector(
    (state) => state.academicYear || {}
  );

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (formData) => {
    try {
      if (selectedAcademicYear?.academic_year_id) {
        await dispatch(
          updateAcademicYear({
            id: selectedAcademicYear.academic_year_id,
            data: formData,
          })
        ).unwrap();
      } else {
        await dispatch(createAcademicYear(formData)).unwrap();
      }

      dispatch(getAcademicYears());
      onClose?.();
    } catch (error) {
      console.error("Failed to save academic year:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl transition-all border border-slate-100"
        onClick={(e) => e.stopPropagation()} // Stop overlay click from closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {selectedAcademicYear
                ? "Edit Academic Year"
                : "Add Academic Year"}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedAcademicYear
                ? "Update existing session details"
                : "Create a new academic session"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <AcademicYearForm
            selectedAcademicYear={selectedAcademicYear}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicYearModal;