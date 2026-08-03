import React from "react";

const PromotionModal = ({
    open,
    onClose,
    onConfirm,
    loading = false,

    selectedStudents = [],

    fromAcademicYear,
    toAcademicYear,

    fromClass,
    toClass,

    fromSection,
    toSection
}) => {

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

            <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-xl bg-white shadow-xl">

                {/* Header */}

                <div className="border-b px-6 py-4">
                    <h2 className="text-xl font-semibold text-slate-800">
                        Confirm Student Promotion
                    </h2>
                </div>

                {/* Body */}

                <div className="space-y-5 overflow-y-auto p-6">

                    {/* Academic Year */}
                    <div>
                        <p className="mb-2 text-sm font-semibold text-slate-500">
                            Academic Year
                        </p>
                        <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
                            <span className="font-medium">{fromAcademicYear}</span>
                            <span className="font-bold text-indigo-600">→</span>
                            <span className="font-medium">{toAcademicYear}</span>
                        </div>
                    </div>

                    {/* Class */}
                    <div>
                        <p className="mb-2 text-sm font-semibold text-slate-500">
                            Class
                        </p>
                        <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
                            <span className="font-medium">{fromClass}</span>
                            <span className="font-bold text-indigo-600">→</span>
                            <span className="font-medium">{toClass}</span>
                        </div>
                    </div>

                    {/* Section */}
                    <div>
                        <p className="mb-2 text-sm font-semibold text-slate-500">
                            Section
                        </p>
                        <div className="flex items-center justify-between gap-2 rounded-lg border p-3">
                            <span className="font-medium">{fromSection}</span>
                            <span className="font-bold text-indigo-600">→</span>
                            <span className="font-medium">{toSection}</span>
                        </div>
                    </div>

                    {/* Students */}
                    <div className="rounded-lg bg-indigo-50 p-4">
                        <p className="text-sm text-slate-600">
                            Selected Students
                        </p>
                        <h3 className="mt-1 text-3xl font-bold text-indigo-700">
                            {selectedStudents.length}
                        </h3>
                    </div>

                    {/* Warning */}
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                        <p className="text-sm text-amber-700">
                            This updates the students' academic year, class and section.
                            Students already promoted for the target year will be skipped
                            automatically. This cannot be undone easily.
                        </p>
                    </div>

                </div>

                {/* Footer */}

                <div className="flex flex-col-reverse gap-3 border-t px-6 py-4 sm:flex-row sm:justify-end">

                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-lg border border-slate-300 px-5 py-2 font-medium hover:bg-slate-100 disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {loading ? "Promoting..." : "Promote Students"}
                    </button>

                </div>

            </div>

        </div>

    );

};

export default PromotionModal;