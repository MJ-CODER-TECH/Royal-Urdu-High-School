import React from "react";
import { Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import usePermission from "../../../hooks/usePermission";

const ExamSubjectTable = ({
  loading,
  examSubjects = [],
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const { hasPermission } = usePermission();

  // Skeleton / Pulse Loading state
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

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-600">
          <tr>
            <th className="px-4 py-3">Academic Year</th>
            <th className="px-4 py-3">Exam</th>
            <th className="px-4 py-3">Class</th>
            <th className="px-4 py-3">Subject</th>
            <th className="px-4 py-3 text-center">Max Marks</th>
            <th className="px-4 py-3 text-center">Pass Marks</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 text-gray-700">
          {!examSubjects || examSubjects.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="py-8 text-center text-gray-500 font-medium"
              >
                No Exam Subjects Found.
              </td>
            </tr>
          ) : (
            examSubjects.map((item, index) => {
              // Case-insensitive check for status safety
              const isActive = item.status?.toLowerCase() === "active";

              const canEdit = hasPermission("exam.edit") || hasPermission("exam.update");
              const canDelete = hasPermission("exam.delete");

              return (
                <tr
                  key={item.exam_subject_id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.academic_year || item.year_name || "-"}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {item.exam_name || "-"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">
                    {item.class_name || "-"}
                  </td>

                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {item.subject_name || "-"}
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    {item.max_marks ?? "-"}
                  </td>

                  <td className="px-4 py-3 text-center font-medium">
                    {item.pass_marks ?? "-"}
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item.status || "Inactive"}
                    </span>
                  </td>

                  {/* Actions Row */}
                  <td className="px-4 py-3 text-center">
                    {canEdit || canDelete ? (
                      <div className="flex items-center justify-center gap-1">
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil size={18} />
                          </button>
                        )}

                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => onStatusChange(item)}
                            className={`rounded p-1.5 transition-colors ${
                              isActive
                                ? "text-emerald-600 hover:bg-emerald-50"
                                : "text-gray-400 hover:bg-gray-100"
                            }`}
                            title={isActive ? "Deactivate" : "Activate"}
                          >
                            {isActive ? (
                              <ToggleRight size={22} />
                            ) : (
                              <ToggleLeft size={22} />
                            )}
                          </button>
                        )}

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item.exam_subject_id)}
                            className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
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
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExamSubjectTable;