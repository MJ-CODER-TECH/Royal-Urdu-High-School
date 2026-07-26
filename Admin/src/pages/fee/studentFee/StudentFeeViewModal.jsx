import React, { useEffect } from "react";
import { X, User, GraduationCap, Calendar, Hash, CreditCard } from "lucide-react";

const StudentFeeViewModal = ({ open, onClose, fee }) => {
  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    if (open) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !fee) return null;

  // Format currency in Indian standard
  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  // Dynamic Payment Status Badge
  const getStatusBadge = () => {
    const balance = Number(fee.balance_amount || 0);
    const paid = Number(fee.paid_amount || 0);

    if (balance <= 0 && paid > 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Paid
        </span>
      );
    }
    if (paid > 0 && balance > 0) {
      return (
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          Partial
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
        Unpaid
      </span>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity"
      onClick={onClose}
    >
      {/* Modal Card Container */}
      <div
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CreditCard size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Student Fee Details
              </h2>
              <p className="text-xs text-gray-500">
                Detailed break-up and ledger summary
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* STUDENT PROFILE HIGHLIGHTS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <User size={13} />
                <span>Student</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm truncate">
                {fee.student_name || "—"}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <GraduationCap size={13} />
                <span>Class</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {fee.class_name || "—"}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Hash size={13} />
                <span>Admission No</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {fee.admission_no || "—"}
              </p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Calendar size={13} />
                <span>Academic Year</span>
              </div>
              <p className="font-semibold text-gray-900 text-sm">
                {fee.academic_year || "—"}
              </p>
            </div>
          </div>

          {/* FEE SUMMARY CARD */}
          <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-3">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2.5">
              <h3 className="font-semibold text-gray-800 text-base">
                Fee Summary
              </h3>
              {getStatusBadge()}
            </div>

            <div className="space-y-2.5 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Total Base Fee</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(fee.total_fee)}
                </span>
              </div>

              <div className="flex justify-between items-center text-emerald-600">
                <span>Discount</span>
                <span className="font-medium">
                  - {formatCurrency(fee.discount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-rose-600">
                <span>Fine / Late Charge</span>
                <span className="font-medium">
                  + {formatCurrency(fee.fine)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200 font-medium text-gray-800">
                <span>Payable Amount</span>
                <span className="text-gray-900">
                  {formatCurrency(fee.payable_amount)}
                </span>
              </div>

              <div className="flex justify-between items-center text-blue-600">
                <span>Paid Amount</span>
                <span className="font-semibold">
                  {formatCurrency(fee.paid_amount)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5 border-t border-gray-200 text-base font-bold text-gray-900">
                <span>Balance Due</span>
                <span className={Number(fee.balance_amount || 0) > 0 ? "text-rose-600" : "text-emerald-600"}>
                  {formatCurrency(fee.balance_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* FEE BREAKDOWN TABLE */}
          {fee.items?.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4 bg-white shadow-sm">
              <h3 className="font-semibold text-gray-800 text-base mb-3">
                Fee Breakdown
              </h3>

              <div className="divide-y divide-gray-100 text-sm">
                {fee.items.map((item, idx) => (
                  <div
                    key={item.item_id || idx}
                    className="flex justify-between py-2 text-gray-600"
                  >
                    <span>{item.fee_name || "Fee Item"}</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between pt-3 font-bold text-gray-900">
                  <span>Total Head Sum</span>
                  <span>{formatCurrency(fee.total_fee)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end px-6 py-4 bg-gray-50/50 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeViewModal;