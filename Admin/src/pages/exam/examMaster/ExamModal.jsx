import React, { useEffect } from "react";
import { X } from "lucide-react";
import ExamForm from "./ExamForm";

const ExamModal = ({
  open,
  onClose,
  selectedExam,
  onSubmit,
  submitting,
}) => {
  // Close modal when pressing the Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto"
    >
      {/* Modal Container - stop Propagation so clicking inside form won't close it */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-xl bg-white shadow-2xl overflow-hidden border border-gray-100 my-8 transition-all"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {selectedExam ? "Edit Exam Details" : "Create New Exam"}
            </h2>
            <p className="text-xs text-gray-500">
              {selectedExam
                ? "Update existing examination configuration."
                : "Fill in the details to setup a new exam."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - Max Height with Scrollbar */}
        <div className="p-6 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <ExamForm
            selectedExam={selectedExam}
            onSubmit={onSubmit}
            submitting={submitting}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default ExamModal;