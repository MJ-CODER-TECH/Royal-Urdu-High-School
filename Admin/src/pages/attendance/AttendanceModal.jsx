import { useEffect } from "react";
import { X, CalendarCheck } from "lucide-react";

import AttendanceForm from "./AttendanceForm";

const AttendanceModal = ({ open, onClose, attendance }) => {
  // Prevent body scrolling when modal is active
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm transition-all animate-in fade-in duration-200"
      onClick={(e) => {
        // Backdrop click toggles close
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in zoom-in-95 duration-200">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                {attendance ? "Edit Attendance" : "Mark Attendance"}
              </h2>
              <p className="text-xs text-slate-500">
                {attendance
                  ? "Update attendance record details below."
                  : "Create a new student attendance entry."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6">
          <AttendanceForm attendance={attendance} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default AttendanceModal;