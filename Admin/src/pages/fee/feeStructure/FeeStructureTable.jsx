import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
} from "lucide-react";

const FeeStructureTable = ({
  data = [],
  loading = false,
  pagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  onEdit,
  onDelete,
  onPageChange,
}) => {
  // Safe page count calculation
  const totalPages =
    pagination.totalPages ||
    Math.ceil((pagination.total || 0) / (pagination.limit || 10)) ||
    1;

  const startEntry =
    data.length === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const endEntry = Math.min(
    pagination.page * pagination.limit,
    pagination.total || data.length
  );

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5 w-12 text-center">#</th>
              <th className="px-5 py-3.5">Class</th>
              <th className="px-5 py-3.5">Fee Head</th>
              <th className="px-5 py-3.5 text-center">Installment</th>
              <th className="px-5 py-3.5">Amount</th>
              <th className="px-5 py-3.5">Due Date</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="8" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <span className="text-xs text-gray-500 font-medium">
                      Loading fee structures...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-gray-500">
                  <p className="text-base font-medium text-gray-600">
                    No Fee Structure Found
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Try adjusting your filters or add a new fee structure.
                  </p>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr
                  key={item.structure_id || index}
                  className="hover:bg-gray-50/70 transition-colors"
                >
                  {/* INDEX */}
                  <td className="px-5 py-3.5 text-center text-gray-500 text-xs">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </td>

                  {/* CLASS */}
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                    {item.class_name || "N/A"}
                  </td>

                  {/* FEE HEAD */}
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                    {item.fee_name || "N/A"}
                  </td>

                  {/* INSTALLMENT NO */}
                  <td className="px-5 py-3.5 text-center">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                      Inst. #{item.installment_no ?? 1}
                    </span>
                  </td>

                  {/* AMOUNT */}
                  <td className="px-5 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    ₹ {Number(item.amount || 0).toLocaleString("en-IN")}
                  </td>

                  {/* DUE DATE */}
                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Calendar size={13} className="text-gray-400" />
                      <span>{formatDate(item.due_date)}</span>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    {item.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(item)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Fee Structure"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onDelete && onDelete(item.structure_id)
                        }
                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Fee Structure"
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

      {/* PAGINATION FOOTER */}
      {!loading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3.5 bg-gray-50/50 border-t border-gray-200 gap-3">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{startEntry}</span> to{" "}
            <span className="font-semibold text-gray-700">{endEntry}</span> of{" "}
            <span className="font-semibold text-gray-700">
              {pagination.total || data.length}
            </span>{" "}
            entries
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange && onPageChange(pagination.page - 1)}
              className="p-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white text-gray-600 transition-all shadow-sm"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs text-gray-600 font-medium px-2">
              Page {pagination.page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={pagination.page >= totalPages}
              onClick={() => onPageChange && onPageChange(pagination.page + 1)}
              className="p-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white text-gray-600 transition-all shadow-sm"
              title="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructureTable;