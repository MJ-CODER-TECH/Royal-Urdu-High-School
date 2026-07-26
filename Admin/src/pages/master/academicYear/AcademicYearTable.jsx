import React from "react";
import {
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  CheckCircle2,
} from "lucide-react";

const AcademicYearTable = ({
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onStatus,
}) => {
  // Skeleton Loader during state fetching
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        <div className="p-4 space-y-3">
          {[...Array(5)].map((_, idx) => (
            <div
              key={idx}
              className="h-10 w-full animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <th className="px-4 py-3 text-center">#</th>
            <th className="px-4 py-3">Academic Year</th>
            <th className="px-4 py-3">Current</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-slate-400 font-medium"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Calendar size={32} className="text-slate-300 stroke-[1.5]" />
                  <p>No Academic Years found.</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => {
              const isActive = Boolean(row?.is_active);
              const isCurrent = Boolean(row?.is_current);

              return (
                <tr
                  key={row?.academic_year_id || index}
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* Row Number */}
                  <td className="px-4 py-3.5 text-center text-slate-400 font-mono">
                    {index + 1}
                  </td>

                  {/* Academic Year Label */}
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    {row?.year_start && row?.year_end
                      ? `${row.year_start} - ${row.year_end}`
                      : "—"}
                  </td>

                  {/* Is Current Badge */}
                  <td className="px-4 py-3.5">
                    {isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        Current
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Status Toggle Button */}
                  <td className="px-4 py-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => onStatus?.(row)}
                      className="inline-flex items-center justify-center rounded-lg p-1 hover:bg-slate-100 transition-colors cursor-pointer"
                      title={isActive ? "Deactivate Year" : "Activate Year"}
                      aria-label="Toggle status"
                    >
                      {isActive ? (
                        <ToggleRight size={26} className="text-emerald-600" />
                      ) : (
                        <ToggleLeft size={26} className="text-slate-400" />
                      )}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit?.(row)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer"
                        title="Edit Academic Year"
                        aria-label="Edit year"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(row?.academic_year_id)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Delete Academic Year"
                        aria-label="Delete year"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
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

export default AcademicYearTable;