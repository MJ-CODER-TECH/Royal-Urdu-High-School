import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";

import {
  createClass,
  updateClass,
  getClasses,
} from "../../../redux/master/Classmasterthunk";

import ClassForm from "./ClassForm";

const ClassModal = ({ open, onClose, selectedClass }) => {
  const dispatch = useDispatch();
  const { submitting = false } = useSelector((state) => state.classMaster);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  /*
  |--------------------------------------------------------------------------
  | Submit Handler
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (formData) => {
    let actionResult;

    if (selectedClass) {
      actionResult = await dispatch(
        updateClass({
          id: selectedClass.class_id,
          data: formData,
        })
      );
    } else {
      actionResult = await dispatch(createClass(formData));
    }

    if (
      updateClass.fulfilled.match(actionResult) ||
      createClass.fulfilled.match(actionResult)
    ) {
      dispatch(getClasses());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 transition-all duration-200 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {selectedClass ? "Edit Class" : "Add New Class"}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {selectedClass
                ? "Update existing class details"
                : "Fill in the information to create a new class"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto">
          <ClassForm
            selectedClass={selectedClass}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassModal;