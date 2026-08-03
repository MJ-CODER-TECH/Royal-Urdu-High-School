import { useEffect } from "react";
import { X } from "lucide-react";

import StudentForm from "./StudentForm";

const StudentModal = ({
  open,
  onClose,
  student,
}) => {
  // Close modal when Escape key is pressed
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  // Prevent background page scrolling
  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [open]);

  // Don't render modal when closed
  if (!open) {
    return null;
  }

  const handleBackdropClick = (
    event
  ) => {
    if (
      event.target ===
      event.currentTarget
    ) {
      onClose();
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        overflow-y-auto
        bg-slate-950/50
        p-3
        backdrop-blur-sm
        sm:p-5
      "
      onMouseDown={
        handleBackdropClick
      }
    >
      <div
        className="
          relative
          flex
          max-h-[95vh]
          w-full
          max-w-6xl
          flex-col
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-2xl
        "
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Modal Header */}

        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            gap-4
            border-b
            border-slate-200
            bg-white
            px-4
            py-4
            sm:px-6
          "
        >
          <div>
            <h2
              className="
                text-lg
                font-bold
                text-slate-900
                sm:text-xl
              "
            >
              {student
                ? "Edit Student"
                : "Add Student"}
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-slate-500
                sm:text-sm
              "
            >
              {student
                ? "Update student information and save the changes."
                : "Create a new student record by filling in the details below."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-lg
              border
              border-slate-200
              text-slate-500
              transition-all
              hover:bg-rose-50
              hover:text-rose-600
              hover:border-rose-200
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-200
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}

        <div
          className="
            flex-1
            overflow-y-auto
            bg-slate-50
            p-3
            sm:p-5
            lg:p-6
          "
        >
          <StudentForm
            student={student}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentModal;