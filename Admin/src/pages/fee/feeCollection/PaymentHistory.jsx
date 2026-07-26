import React from "react";
import { X, Receipt, CreditCard, Calendar, User } from "lucide-react";

const PaymentHistory = ({ receipt, close }) => {
  if (!receipt) return null;

  // Handles both single receipt object and array of transaction history
  const transactions = Array.isArray(receipt.transactions)
    ? receipt.transactions
    : [receipt];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl border border-gray-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-150">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Receipt size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Payment History
              </h2>
              <p className="text-xs text-gray-500">
                Student Fee Payment & Transaction Details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* STUDENT SUMMARY CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-lg">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                <User size={13} /> Student
              </span>
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {receipt.student_name || receipt.student_id || "-"}
              </h3>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-lg">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                <Receipt size={13} /> Receipt No
              </span>
              <h3 className="text-sm font-semibold text-gray-800 truncate">
                {receipt.receipt_no || "-"}
              </h3>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-lg">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                Paid Amount
              </span>
              <h3 className="text-sm font-bold text-emerald-600">
                {formatCurrency(receipt.total_amount || receipt.amount)}
              </h3>
            </div>

            <div className="bg-gray-50/80 border border-gray-100 p-3 rounded-lg">
              <span className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-1">
                <CreditCard size={13} /> Payment Mode
              </span>
              <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                {receipt.payment_mode || "Cash"}
              </span>
            </div>
          </div>

          {/* PAYMENT TABLE */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200 sticky top-0 uppercase tracking-wider font-semibold text-[11px]">
                  <tr>
                    <th className="p-3">Receipt</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Remarks</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {transactions.map((tx, index) => (
                    <tr
                      key={tx.transaction_id || tx.receipt_no || index}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-900 flex items-center gap-2">
                        <Receipt size={15} className="text-gray-400" />
                        <span>{tx.receipt_no || "-"}</span>
                      </td>

                      <td className="p-3 text-gray-600">
                        {tx.payment_date || tx.created_at || "-"}
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium border border-gray-200">
                          {tx.payment_mode || "-"}
                        </span>
                      </td>

                      <td className="p-3 font-semibold text-emerald-600">
                        {formatCurrency(tx.amount || tx.paid_amount)}
                      </td>

                      <td className="p-3 text-gray-500 italic">
                        {tx.remarks || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end p-4 bg-gray-50/50 border-t border-gray-100">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;