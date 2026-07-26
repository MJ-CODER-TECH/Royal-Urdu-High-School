import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Tag,
} from "lucide-react";

const FeeHeadTable = ({
  data = [],
  loading = false,
  pagination = { page: 1, limit: 10, total: 0 },
  onEdit,
  onDelete,
  onPageChange,
}) => {
  // Destructure pagination with safe fallbacks
  const { page = 1, limit = 10, total = 0 } = pagination || {};
  const totalPages = Math.max(1, Math.ceil(total / limit));

  // Range indicators for footer
  const startEntry = data.length === 0 ? 0 : (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total || data.length);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/80 text-gray-600 font-semibold border-b border-gray-200 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-5 py-3.5 w-12 text-center">#</th>
              <th className="px-5 py-3.5">Fee Head Name</th>
              <th className="px-5 py-3.5">Description</th>
              <th className="px-5 py-3.5 text-center">Status</th>
              <th className="px-5 py-3.5 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-700">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <span className="text-xs text-gray-500 font-medium">
                      Loading fee heads...
                    </span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Tag className="text-gray-300 mb-1" size={32} />
                    <p className="text-base font-medium text-gray-600">
                      No Fee Head Found
                    </p>
                    <p className="text-xs text-gray-400">
                      There are no fee heads available to display right now.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                // Support both string ("Active") and boolean (true) status formats safely
                const isActive =
                  item.status === "Active" ||
                  item.status === true ||
                  item.is_active === true;

                return (
                  <tr
                    key={item.fee_head_id || index}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* INDEX */}
                    <td className="px-5 py-3.5 text-center text-gray-500 text-xs">
                      {(page - 1) * limit + index + 1}
                    </td>

                    {/* FEE HEAD NAME */}
                    <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                      {item.fee_name || "N/A"}
                    </td>

                    {/* DESCRIPTION */}
                    <td className="px-5 py-3.5 text-gray-500 max-w-xs truncate">
                      {item.description || "—"}
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {isActive ? (
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
                          title="Edit Fee Head"
                          aria-label="Edit Fee Head"
                          onClick={() => onEdit?.(item)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete Fee Head"
                          aria-label="Delete Fee Head"
                          onClick={() => onDelete?.(item.fee_head_id)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 size={16} />
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

      {/* PAGINATION FOOTER */}
      {!loading && data.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center px-5 py-3.5 bg-gray-50/50 border-t border-gray-200 gap-3">
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{startEntry}</span> to{" "}
            <span className="font-semibold text-gray-700">{endEntry}</span> of{" "}
            <span className="font-semibold text-gray-700">{total || data.length}</span>{" "}
            entries
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange?.(page - 1)}
              className="p-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white text-gray-600 transition-all shadow-sm"
              aria-label="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs text-gray-600 font-medium px-2">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange?.(page + 1)}
              className="p-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white text-gray-600 transition-all shadow-sm"
              aria-label="Next Page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeHeadTable;