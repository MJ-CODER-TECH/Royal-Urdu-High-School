import React from "react";
import {
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from "lucide-react";

const StudentFeeTable = ({
  data = [],
  loading = false,
  pagination = {
    page: 1,
    totalPages: 1,
    total: 0,
  },
  onView,
  onDelete,
  onPageChange,
}) => {
  // Helper to format currency in Indian format safely
  const formatCurrency = (amount) => {
    const val = Number(amount || 0);
    return `₹ ${val.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Helper for status badge styling
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Partial":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200/60";
    }
  };

  // SKELETON LOADING STATE
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
        </div>
        <div className="p-4 space-y-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="h-10 bg-gray-100 animate-pulse rounded-lg w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* TABLE CONTAINER */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50/80 text-xs font-semibold uppercase text-gray-500 border-b border-gray-200 tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">Admission No</th>
              <th scope="col" className="px-5 py-3.5">Student Name</th>
              <th scope="col" className="px-5 py-3.5">Class</th>
              <th scope="col" className="px-5 py-3.5">Academic Year</th>
              <th scope="col" className="px-5 py-3.5 text-right">Total</th>
              <th scope="col" className="px-5 py-3.5 text-right">Payable</th>
              <th scope="col" className="px-5 py-3.5 text-right">Paid</th>
              <th scope="col" className="px-5 py-3.5 text-right">Balance</th>
              <th scope="col" className="px-5 py-3.5 text-center">Status</th>
              <th scope="col" className="px-5 py-3.5 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-12 text-gray-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileSpreadsheet className="w-10 h-10 text-gray-300 stroke-[1.5]" />
                    <p className="font-medium text-gray-600">No Student Fee Record Found</p>
                    <p className="text-xs text-gray-400">Try adjusting your filters or search query.</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.student_fee_id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
                    {item.admission_no || "—"}
                  </td>

                  <td className="px-5 py-3.5 font-medium text-gray-800 whitespace-nowrap">
                    {item.student_name || "—"}
                  </td>

                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {item.class_name || "—"}
                  </td>

                  <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">
                    {item.academic_year || "—"}
                  </td>

                  <td className="px-5 py-3.5 text-right font-medium text-gray-700 whitespace-nowrap">
                    {formatCurrency(item.total_fee)}
                  </td>

                  <td className="px-5 py-3.5 text-right font-medium text-gray-900 whitespace-nowrap">
                    {formatCurrency(item.payable_amount)}
                  </td>

                  <td className="px-5 py-3.5 text-right font-semibold text-emerald-600 whitespace-nowrap">
                    {formatCurrency(item.paid_amount)}
                  </td>

                  <td className="px-5 py-3.5 text-right font-semibold text-rose-600 whitespace-nowrap">
                    {formatCurrency(item.balance_amount)}
                  </td>

                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadgeClass(
                        item.status
                      )}`}
                    >
                      {item.status || "Unpaid"}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView?.(item)}
                        title="View Details"
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete?.(item.student_fee_id)}
                        title="Delete Record"
                        className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={17} />
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
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-5 py-3.5 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-gray-500 font-medium">
          Total Records: <span className="text-gray-900 font-semibold">{pagination.total || 0}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">
            Page <span className="font-semibold text-gray-900">{pagination.page || 1}</span> of{" "}
            <span className="font-semibold text-gray-900">{pagination.totalPages || 1}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange?.(pagination.page - 1)}
              aria-label="Previous Page"
              className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange?.(pagination.page + 1)}
              aria-label="Next Page"
              className="p-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-white hover:text-gray-900 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeTable;