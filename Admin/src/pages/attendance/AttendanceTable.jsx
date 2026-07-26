import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "lucide-react";

import AttendanceStatusBadge from "./AttendanceStatusBadge";

const columns = [
  "Admission No",
  "Student",
  "Class",
  "Section",
  "Date",
  "Status",
  "Action",
];

const AttendanceTable = ({
  attendance = [],
  loading = false,
  page = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const rows = Array.isArray(attendance) ? attendance : [];

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 last:text-center"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {/* Skeleton Loading State */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  {columns.map((_, j) => (
                    <td key={j} className="px-4 py-3.5">
                      <div className="h-4 w-full max-w-[100px] animate-pulse rounded bg-slate-100" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty State */}
            {!loading && rows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <CalendarCheck size={30} strokeWidth={1.5} />
                    <p className="text-sm">No attendance records found</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data Rows */}
            {!loading &&
              rows.map((row, i) => (
                <tr
                  key={row.attendance_id || i}
                  className={`
                    transition-colors hover:bg-slate-50
                    ${i !== rows.length - 1 ? "border-b border-slate-100" : ""}
                  `}
                >
                  {/* Admission No */}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.admission_no || "-"}
                  </td>

                  {/* Student */}
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">
                    {row.student_name || "-"}
                  </td>

                  {/* Class */}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.class_name || "-"}
                  </td>

                  {/* Section */}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.section_name || "-"}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {row.attendance_date
                      ? new Date(row.attendance_date).toLocaleDateString(
                          "en-GB"
                        )
                      : "-"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 text-sm">
                    <AttendanceStatusBadge status={row.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>
                      )}

                      {onDelete && (
                        <button
                          onClick={() => onDelete(row.attendance_id)}
                          title="Delete"
                          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Container matching UI Theme */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row">
        <span className="text-sm text-slate-500">
          Total: <span className="font-medium text-slate-900">{total || rows.length}</span> records
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange && onPageChange(page - 1)}
            className="
              rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors
              hover:bg-slate-50 hover:text-slate-900
              disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
            "
          >
            <ChevronLeft size={17} />
          </button>

          <span className="min-w-[70px] text-center text-sm text-slate-600">
            {page} / {totalPages || 1}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange && onPageChange(page + 1)}
            className="
              rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors
              hover:bg-slate-50 hover:text-slate-900
              disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
            "
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;