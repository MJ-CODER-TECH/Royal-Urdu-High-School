import React from "react";

const PromotionHistoryTable = ({
    history = [],
    loading = false
}) => {

    // ===========================================
    // Loading
    // ===========================================

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">
                    Loading promotion history...
                </p>
            </div>
        );
    }

    // ===========================================
    // Empty State
    // ===========================================

    if (history.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">
                    No promotion history found for this selection yet.
                </p>
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b p-4">
                <h2 className="text-lg font-semibold text-slate-800">
                    Promotion History
                </h2>
            </div>

            {/* Mobile: card list */}

            <div className="divide-y sm:hidden">

                {history.map((item) => (

                    <div
                        key={item.history_id || `${item.student_name}-${item.promoted_at}`}
                        className="px-4 py-3"
                    >
                        <div className="flex items-center justify-between">
                            <p className="font-medium text-slate-700">
                                {item.student_name}
                            </p>
                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                    item.status === "PROMOTED"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-slate-100 text-slate-700"
                                }`}
                            >
                                {item.status}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                            {item.class_name} · {item.section_name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            {item.promoted_at
                                ? new Date(item.promoted_at).toLocaleString()
                                : "-"}
                        </p>
                    </div>

                ))}

            </div>

            {/* Desktop: table */}

            <div className="hidden overflow-x-auto sm:block">

                <table className="min-w-full">

                    <thead className="bg-slate-100">
                        <tr>
                            <th className="px-4 py-3 text-left">Student Name</th>
                            <th className="px-4 py-3 text-center">Class</th>
                            <th className="px-4 py-3 text-center">Section</th>
                            <th className="px-4 py-3 text-center">Status</th>
                            <th className="px-4 py-3 text-center">Promoted At</th>
                        </tr>
                    </thead>

                    <tbody>

                        {history.map((item) => (

                            <tr
                                key={item.history_id || `${item.student_name}-${item.promoted_at}`}
                                className="border-b hover:bg-slate-50"
                            >
                                <td className="px-4 py-3 font-medium text-slate-700">
                                    {item.student_name}
                                </td>
                                <td className="px-4 py-3 text-center">{item.class_name}</td>
                                <td className="px-4 py-3 text-center">{item.section_name}</td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            item.status === "PROMOTED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-slate-100 text-slate-700"
                                        }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center text-slate-600">
                                    {item.promoted_at
                                        ? new Date(item.promoted_at).toLocaleString()
                                        : "-"}
                                </td>
                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
};

export default PromotionHistoryTable;