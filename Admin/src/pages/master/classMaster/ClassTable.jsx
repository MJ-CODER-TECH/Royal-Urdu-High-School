import React from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";

const ClassTable = ({
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onStatus,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-slate-500 shadow-xs">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2.5" />
        <span className="text-sm font-medium">Loading classes...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-slate-50/80 border-b border-slate-200">
          <tr>
            <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider w-12">
              #
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Class Name
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
              Status
            </th>
            <th className="px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="py-12 text-center text-slate-400 font-medium"
              >
                No classes found.
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.class_id}
                className="hover:bg-slate-50/70 transition-colors"
              >
                <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">
                  {index + 1}
                </td>

                <td className="px-4 py-3.5 font-semibold text-slate-800">
                  {row.class_name}
                </td>

                <td className="px-4 py-3.5 text-slate-600 max-w-xs truncate">
                  {row.description || (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-4 py-3.5 text-center">
                  <button
                    type="button"
                    onClick={() => onStatus?.(row)}
                    title={`Click to ${row.is_active ? "deactivate" : "activate"}`}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      row.is_active
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        row.is_active ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    {row.is_active ? "Active" : "Inactive"}
                  </button>
                </td>

                <td className="px-4 py-3.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit?.(row)}
                      title="Edit Class"
                      aria-label="Edit Class"
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100 transition-colors cursor-pointer"
                    >
                      <Pencil size={15} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(row.class_id)}
                      title="Delete Class"
                      aria-label="Delete Class"
                      className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;