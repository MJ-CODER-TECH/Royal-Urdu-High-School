import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReceiptText, Printer, X, Loader2 } from "lucide-react"; 

import { getFeeReceiptById } from "../../../redux/fee/feeCollection/feeCollectionThunk";
import { clearSelectedReceipt } from "../../../redux/fee/feeCollection/feeCollectionSlice";

const FeeReceiptModal = ({ receiptId, close }) => {
  const dispatch = useDispatch();

  const { selectedReceipt, loading } = useSelector(
    (state) => state.feeCollection
  );

  useEffect(() => {
    if (receiptId) {
      dispatch(getFeeReceiptById(receiptId));
    }

    return () => {
      dispatch(clearSelectedReceipt());
    };
  }, [dispatch, receiptId]);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100 print:shadow-none print:border-none print:w-full print:max-w-none">
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ReceiptText size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Fee Receipt</h2>
              <p className="text-xs text-gray-500">Official Payment Slip</p>
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

        {/* BODY */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 space-y-3">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-sm font-medium">Fetching receipt details...</p>
            </div>
          ) : !selectedReceipt ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-base font-semibold text-gray-700">Receipt Not Found</p>
              <p className="text-xs text-gray-400 mt-1">
                Unable to load requested payment details.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* PRINT RECEIPT TITLE (Only visible during print) */}
              <div className="hidden print:block text-center border-b pb-4 mb-4">
                <h1 className="text-2xl font-bold uppercase tracking-wider">Fee Payment Receipt</h1>
              </div>

              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-gray-50/60 p-4 rounded-xl border border-gray-100 print:bg-transparent print:border-gray-300">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                    Receipt No
                  </span>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedReceipt.receipt_no || "-"}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                    Payment Date
                  </span>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedReceipt.payment_date || selectedReceipt.created_at || "-"}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                    Student Name
                  </span>
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {selectedReceipt.student_name || "-"}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                    Admission No
                  </span>
                  <p className="font-semibold text-gray-800 text-sm">
                    {selectedReceipt.admission_no || "-"}
                  </p>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                    Payment Mode
                  </span>
                  <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 print:bg-transparent print:p-0 print:border-none">
                    {selectedReceipt.payment_mode || "Cash"}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-0.5">
                    Total Amount Paid
                  </span>
                  <p className="font-bold text-emerald-600 text-sm">
                    {formatCurrency(selectedReceipt.total_amount || selectedReceipt.amount)}
                  </p>
                </div>
              </div>

              {/* ADDITIONAL INFO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-gray-100 p-3 rounded-lg print:border-gray-200">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                    Reference No / Txn ID
                  </span>
                  <p className="text-sm font-medium text-gray-700">
                    {selectedReceipt.reference_no || "-"}
                  </p>
                </div>

                <div className="border border-gray-100 p-3 rounded-lg print:border-gray-200">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block mb-1">
                    Remarks
                  </span>
                  <p className="text-sm font-medium text-gray-700 italic">
                    {selectedReceipt.remarks || "No additional remarks"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50/50 flex justify-end gap-3 print:hidden">
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={loading || !selectedReceipt}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors"
          >
            <Printer size={16} />
            Print Receipt
          </button>
        </div>

      </div>
    </div>
  );
};

export default FeeReceiptModal;