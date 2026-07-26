import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X } from "lucide-react";

import {
  createSection,
  updateSection,
  getSections,
} from "../../../redux/section/sectionthunk";

import SectionForm from "./SectionForm";

const SectionModal = ({ open, onClose, selectedSection }) => {
  const dispatch = useDispatch();
  const { submitting } = useSelector((state) => state.section);

  // Close modal when pressing the Escape key
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

  const handleSubmit = async (data) => {
    let result;

    if (selectedSection) {
      result = await dispatch(
        updateSection({
          id: selectedSection.section_id,
          data,
        })
      );
    } else {
      result = await dispatch(createSection(data));
    }

    if (
      updateSection.fulfilled.match(result) ||
      createSection.fulfilled.match(result)
    ) {
      dispatch(getSections());
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="w-full max-w-lg transform rounded-xl bg-white shadow-2xl transition-all sm:my-8"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal box
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold text-gray-900"
          >
            {selectedSection ? "Edit Section" : "Add Section"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <SectionForm
            selectedSection={selectedSection}
            submitting={submitting}
            onSubmit={handleSubmit}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionModal;