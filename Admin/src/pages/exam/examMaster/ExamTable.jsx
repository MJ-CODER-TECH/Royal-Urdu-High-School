import React from "react";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import usePermission from "../../../hooks/usePermission";

const ExamTable = ({
  exams = [],
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { hasPermission } = usePermission();

  // Helper for safe date display without timezone shifts
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const cleanDate = dateStr.substring(0, 10); // YYYY-MM-DD
    const [year, month, day] = cleanDate.split("-");
    if (!year || !month || !day) return "-";
    return `${day}/${month}/${year}`;
  };

  // Loading State
  if (loading) {
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-10 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!exams || exams.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500 font-medium">
        No exams found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Academic Year</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Exam Name</th>
            <th className="px-4 py-3">Exam Date</th>
            <th className="px-4 py-3 text-center">Max Marks</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-gray-700">
          {exams.map((exam, index) => {
            const isActive = exam.status === "Active";

            const canUpdate = hasPermission("exam.update");
            const canPublish = hasPermission("exam.publish");
            const canDelete = hasPermission("exam.delete");

            return (
              <tr key={exam.exam_id || index} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-500">{index + 1}</td>

                {/* Academic Year */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {exam.year_start && exam.year_end
                    ? `${exam.year_start} - ${exam.year_end}`
                    : "-"}
                </td>

                {/* Class */}
                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                  {exam.class_name || "-"}
                </td>

                {/* Exam Name */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  {exam.exam_name || `Exam #${exam.exam_id}`}
                </td>

                {/* Safe Formatted Exam Date */}
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(exam.exam_date)}
                </td>

                {/* Max Marks */}
                <td className="px-4 py-3 text-center font-medium">
                  {exam.max_marks ?? "-"}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {exam.status || "Inactive"}
                  </span>
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-3 text-center">
                  {canUpdate || canPublish || canDelete ? (
                    <div className="flex items-center justify-center gap-1">
                      {canUpdate && (
                        <button
                          type="button"
                          title="Edit Exam"
                          onClick={() => onEdit(exam)}
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Edit size={18} />
                        </button>
                      )}

                      {canPublish && (
                        <button
                          type="button"
                          title={isActive ? "Deactivate" : "Activate"}
                          onClick={() => onStatusChange(exam)}
                          className={`rounded p-1.5 transition-colors ${
                            isActive
                              ? "text-emerald-600 hover:bg-emerald-50"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          {isActive ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        </button>
                      )}

                      {canDelete && (
                        <button
                          type="button"
                          title="Delete Exam"
                          onClick={() => onDelete(exam.exam_id)}
                          className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ExamTable;