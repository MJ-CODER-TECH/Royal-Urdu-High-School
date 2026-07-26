import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, Search, Loader2, CheckCircle2, UserCheck } from "lucide-react";
import { toast } from "react-toastify";

import {
  getPendingStudentFees,
  collectFee,
} from "../../../redux/fee/feeCollection/feeCollectionThunk";

import { fetchAcademicYears } from "../../../redux/master/AcademicYearThunk";
import { fetchClasses } from "../../../redux/master/Classmasterthunk";
import { fetchSections } from "../../../redux/section/sectionthunk";

const CollectFeeModal = ({ open, onClose, onSuccess }) => {
  const dispatch = useDispatch();

  const { pendingFees, submitting, loadingPending } = useSelector(
    (state) => state.feeCollection
  );
  const { academicYears } = useSelector((state) => state.academicYear);
  const { classes } = useSelector((state) => state.classMaster);
  const { sections } = useSelector((state) => state.section);

  const [selectedFee, setSelectedFee] = useState(null);

  const [filters, setFilters] = useState({
    academicYearId: "",
    classId: "",
    sectionId: "",
    search: "",
  });

  const [form, setForm] = useState({
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: "Cash",
    referenceNo: "",
    remarks: "",
  });

  // Load Initial Master Data
  useEffect(() => {
    if (!open) return;

    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
  }, [open, dispatch]);

  // Fetch Pending Students on filter change
  useEffect(() => {
    if (!open) return;

    dispatch(
      getPendingStudentFees({
        search: filters.search,
        academic_year_id: filters.academicYearId,
        class_id: filters.classId,
        section_id: filters.sectionId,
      })
    );
  }, [dispatch, open, filters]);

  // Reset internal state when modal closes
  useEffect(() => {
    if (!open) {
      setSelectedFee(null);
      setFilters({
        academicYearId: "",
        classId: "",
        sectionId: "",
        search: "",
      });
      setForm({
        amount: "",
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMode: "Cash",
        referenceNo: "",
        remarks: "",
      });
    }
  }, [open]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "classId" ? { sectionId: "" } : {}),
    }));
  };

  const handleSelectStudent = (item) => {
    setSelectedFee(item);
    setForm((prev) => ({
      ...prev,
      amount: item.balance_amount || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFee) {
      toast.error("Please select a student first");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (Number(form.amount) > Number(selectedFee.balance_amount)) {
      toast.error("Amount cannot exceed the balance amount");
      return;
    }

    try {
      const res = await dispatch(
        collectFee({
          student_fee_id: selectedFee.student_fee_id,
          amount: Number(form.amount),
          payment_date: form.paymentDate,
          payment_mode: form.paymentMode,
          reference_no: form.referenceNo,
          remarks: form.remarks,
        })
      ).unwrap();

      toast.success(res.message || "Fee Collected Successfully!");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err || "Failed to collect fee");
    }
  };

  if (!open) return null;

  // Filter sections dynamically if class is selected
  const filteredSections = filters.classId
    ? sections.filter(
        (sec) => String(sec.class_id) === String(filters.classId)
      )
    : sections;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <UserCheck className="text-emerald-600" size={20} />
            <h2 className="text-lg font-bold text-gray-900">Collect Student Fee</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* FILTERS SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select
              name="academicYearId"
              value={filters.academicYearId}
              onChange={handleFilterChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">Academic Year</option>
              {academicYears?.map((item) => (
                <option key={item.academic_year_id} value={item.academic_year_id}>
                  {item.year_start} - {item.year_end}
                </option>
              ))}
            </select>

            <select
              name="classId"
              value={filters.classId}
              onChange={handleFilterChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:border-blue-500"
            >
              <option value="">All Classes</option>
              {classes?.map((item) => (
                <option key={item.class_id} value={item.class_id}>
                  {item.class_name}
                </option>
              ))}
            </select>

            <select
              name="sectionId"
              value={filters.sectionId}
              onChange={handleFilterChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:border-blue-500"
            >
              



<option value="">All Sections</option>
            {filteredSections.map((section) => (
              <option key={section.section_id} value={section.section_id}>
                {section.class_name ? `${section.class_name} - ` : ""}
                {section.section_name}
              </option>






              ))}
            </select>
          </div>

          {/* SEARCH BAR */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search Student by Name / Admission No / Mobile..."
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* STUDENT LIST SELECTION */}
          <div className="border border-gray-200 rounded-xl max-h-56 overflow-y-auto divide-y divide-gray-100 bg-gray-50/30">
            {loadingPending ? (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Loader2 className="animate-spin text-blue-600 mb-1" size={20} />
                <span className="text-xs">Searching pending students...</span>
              </div>
            ) : pendingFees?.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                No pending fee records found.
              </div>
            ) : (
              pendingFees.map((item) => {
                const isSelected =
                  selectedFee?.student_fee_id === item.student_fee_id;
                return (
                  <div
                    key={item.student_fee_id}
                    onClick={() => handleSelectStudent(item)}
                    className={`p-3.5 flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-50/80 border-l-4 border-emerald-600"
                        : "hover:bg-gray-100/60 bg-white"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {item.student_name}
                        </h3>
                        {isSelected && (
                          <CheckCircle2 size={16} className="text-emerald-600" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        Adm No: <span className="font-medium text-gray-700">{item.admission_no || "-"}</span> | Mobile: <span className="font-medium text-gray-700">{item.mobile || "-"}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-medium text-gray-500">
                        {item.class_name || "-"}
                      </p>
                      <p className="text-sm font-bold text-rose-600">
                        ₹ {item.balance_amount || 0}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FORM AREA */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Amount <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter Amount"
                  value={form.amount}
                  onChange={(e) =>
                    setForm({ ...form, amount: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) =>
                    setForm({ ...form, paymentDate: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Payment Mode
                </label>
                <select
                  value={form.paymentMode}
                  onChange={(e) =>
                    setForm({ ...form, paymentMode: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Online">Online</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                  Reference No.
                </label>
                <input
                  type="text"
                  placeholder={
                    form.paymentMode === "Cash" ? "N/A for Cash" : "Txn / Cheque No"
                  }
                  value={form.referenceNo}
                  onChange={(e) =>
                    setForm({ ...form, referenceNo: e.target.value })
                  }
                  disabled={form.paymentMode === "Cash"}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm disabled:bg-gray-100 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Remarks
              </label>
              <textarea
                rows={2}
                placeholder="Add payment notes or remarks..."
                value={form.remarks}
                onChange={(e) =>
                  setForm({ ...form, remarks: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* BALANCE BREAKDOWN SUMMARY */}
            {selectedFee && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-1.5 text-gray-600">
                <div className="flex justify-between">
                  <span>Total Pending Balance:</span>
                  <span className="font-semibold text-rose-600">
                    ₹ {Number(selectedFee.balance_amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Collecting Amount:</span>
                  <span className="font-semibold text-emerald-600">
                    ₹ {Number(form.amount || 0).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-gray-900 text-sm">
                  <span>Remaining Balance:</span>
                  <span>
                    ₹{" "}
                    {Math.max(
                      0,
                      Number(selectedFee.balance_amount || 0) -
                        Number(form.amount || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {submitting && <Loader2 className="animate-spin" size={16} />}
                {submitting ? "Processing..." : "Collect Fee"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollectFeeModal;