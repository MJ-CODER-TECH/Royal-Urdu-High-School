import { useEffect } from "react";
import { X } from "lucide-react";
import StudentForm from "./StudentForm";

const StudentModal = ({ open, onClose, student }) => {
  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {student ? "Edit Student" : "Add Student"}
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {student ? "Update student information." : "Create a new student record."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="bg-slate-50 p-6">
          <StudentForm student={student} onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default StudentModal;