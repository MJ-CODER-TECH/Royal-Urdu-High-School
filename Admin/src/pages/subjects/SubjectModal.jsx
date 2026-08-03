import React from "react";
import { X, BookOpen } from "lucide-react";
import SubjectForm from "./SubjectForm";

const SubjectModal = ({ isOpen, onClose, selectedSubject, onSuccess }) => {
    if (!isOpen) {
        return null;
    }

    const isEditMode = Boolean(selectedSubject);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                {/* Header — matches the indigo "brand" icon style used in
                    SubjectTable / SubjectFilters headers */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-600">
                            <BookOpen size={22} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                                {isEditMode ? "Edit Subject" : "Add New Subject"}
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                                {isEditMode
                                    ? "Update subject information"
                                    : "Create a subject for a class"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close subject modal"
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200"
                    >
                        <X size={21} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    <SubjectForm
                        selectedSubject={selectedSubject}
                        onClose={onClose}
                        onSuccess={onSuccess}
                    />
                </div>
            </div>
        </div>
    );
};

export default SubjectModal;