import React from "react";
import {
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
} from "lucide-react";

const SectionTable = ({
  data = [],
  loading = false,
  onEdit,
  onDelete,
  onStatus,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-lg border bg-white p-12 text-gray-500 shadow-sm">
        <Loader2 className="mr-2 h-5 w-5 animate-spin text-blue-600" />
        <span className="text-sm font-medium">Loading sections...</span>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <tr>
            <th scope="col" className="px-4 py-3.5">
              #
            </th>
            <th scope="col" className="px-4 py-3.5">
              Class
            </th>
            <th scope="col" className="px-4 py-3.5">
              Section
            </th>
            <th scope="col" className="px-4 py-3.5">
              Capacity
            </th>
            <th scope="col" className="px-4 py-3.5 text-center">
              Status
            </th>
            <th scope="col" className="px-4 py-3.5 text-center">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="py-10 text-center text-sm font-medium text-gray-500"
              >
                No Sections Found
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.section_id ?? index}
                className="transition-colors hover:bg-gray-50/80"
              >
                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-900">
                  {index + 1}
                </td>

                <td className="whitespace-nowrap px-4 py-3.5">
                  {row.class_name || "-"}
                </td>

                <td className="whitespace-nowrap px-4 py-3.5 font-medium text-gray-900">
                  {row.section_name || "-"}
                </td>

                <td className="whitespace-nowrap px-4 py-3.5">
                  {row.capacity || "-"}
                </td>

                <td className="whitespace-nowrap px-4 py-3.5 text-center">
                  <button
                    type="button"
                    onClick={() => onStatus?.(row)}
                    className="inline-flex items-center rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                    title={
                      row.is_active
                        ? "Deactivate Section"
                        : "Activate Section"
                    }
                    aria-label={`Toggle status for ${row.section_name}`}
                  >
                    {row.is_active ? (
                      <ToggleRight size={26} className="text-emerald-600" />
                    ) : (
                      <ToggleLeft size={26} className="text-gray-400" />
                    )}
                  </button>
                </td>

                <td className="whitespace-nowrap px-4 py-3.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit?.(row)}
                      title="Edit Section"
                      aria-label={`Edit section ${row.section_name}`}
                      className="rounded-lg bg-blue-50 p-1.5 text-blue-600 transition-colors hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete?.(row.section_id)}
                      title="Delete Section"
                      aria-label={`Delete section ${row.section_name}`}
                      className="rounded-lg bg-red-50 p-1.5 text-red-600 transition-colors hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <Trash2 size={16} />
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

export default SectionTable;