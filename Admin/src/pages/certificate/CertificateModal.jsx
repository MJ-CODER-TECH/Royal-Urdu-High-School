import React, { useEffect } from "react";
import { X } from "lucide-react";
import CertificateForm from "./CertificateForm";

const CertificateModal = ({ open, onClose, certificate }) => {
  // ESC key se close karne ke liye event listener
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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4"
      onClick={onClose} // Backdrop overlay par click karne par close
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200"
        onClick={(e) => e.stopPropagation()} // Inner content par click hone se backdrop trigger na ho
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2
              id="modal-title"
              className="text-xl font-semibold text-slate-800"
            >
              {certificate ? "Edit Certificate" : "Create Certificate"}
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {certificate
                ? "Update existing certificate details."
                : "Generate a new certificate for a student."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <CertificateForm certificate={certificate} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;