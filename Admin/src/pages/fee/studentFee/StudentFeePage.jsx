import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, Layers } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  getStudentFees,
  deleteStudentFee,
  getStudentFeeById,
} from "../../../redux/fee/studentFee/studentFeeThunk";

import { fetchClasses } from "../../../redux/master/classMasterThunk";
import { fetchAcademicYears } from "../../../redux/master/academicYearThunk";

import StudentFeeTable from "./StudentFeeTable";
import GenerateFeeModal from "./GenerateFeeModal";
import StudentFeeViewModal from "./StudentFeeViewModal";
import StudentFeeFilters from "./StudentFeeFilter";

const StudentFeePage = () => {
  const dispatch = useDispatch();

  /*
  |--------------------------------------------------------------------------
  | REDUX STATE
  |--------------------------------------------------------------------------
  */
  const {
    studentFees = [],
    loading = false,
    pagination = { page: 1, totalPages: 1, total: 0 },
  } = useSelector((state) => state.studentFee || {});

  const { classes = [] } = useSelector((state) => state.classMaster || {});
  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  /*
  |--------------------------------------------------------------------------
  | LOCAL STATE
  |--------------------------------------------------------------------------
  */
  const [openGenerateModal, setOpenGenerateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedStudentFee, setSelectedStudentFee] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    class_id: "",
    academic_year_id: "",
    status: "",
    page: 1,
    limit: 10,
  });

  /*
  |--------------------------------------------------------------------------
  | LOAD MASTER DATA ON MOUNT
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchClasses());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | FETCH STUDENT FEES ON FILTER CHANGE
  |--------------------------------------------------------------------------
  */
  const fetchFeeData = useCallback(() => {
    dispatch(getStudentFees(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    fetchFeeData();
  }, [fetchFeeData]);

  /*
  |--------------------------------------------------------------------------
  | HANDLERS
  |--------------------------------------------------------------------------
  */
  const handleRefresh = () => {
    fetchFeeData();
  };

  const handleGenerate = () => {
    setOpenGenerateModal(true);
  };

  const handleView = async (item) => {
    try {
      const result = await dispatch(
        getStudentFeeById(item.student_fee_id)
      ).unwrap();
      setSelectedStudentFee(result);
      setOpenViewModal(true);
    } catch (error) {
      console.error("Failed to fetch student fee details:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student fee record?"
    );

    if (!confirmDelete) return;

    try {
      await dispatch(deleteStudentFee(id)).unwrap();
      // Auto-refresh data after successful delete
      fetchFeeData();
    } catch (error) {
      console.error("Failed to delete student fee:", error);
    }
  };

  const handleFilterChange = (updatedFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...updatedFilters,
      page: 1, // Reset to page 1 on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleCloseViewModal = () => {
    setOpenViewModal(false);
    setSelectedStudentFee(null);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto p-2 sm:p-4">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Layers size={20} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Student Fee
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage student fee assignments, dues, and payment structures
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin text-blue-600" : "text-gray-500"}
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} />
            <span>Generate Fee</span>
          </button>
        </div>
      </div>

      {/* FILTER SECTION */}
      <StudentFeeFilters
        filters={filters}
        onChange={handleFilterChange}
        classes={classes}
        academicYears={academicYears}
      />

      {/* DATA TABLE */}
      <StudentFeeTable
        data={studentFees}
        loading={loading}
        pagination={pagination}
        onView={handleView}
        onDelete={handleDelete}
        onPageChange={handlePageChange}
      />

      {/* GENERATE FEE MODAL */}
      {openGenerateModal && (
        <GenerateFeeModal
          open={openGenerateModal}
          close={() => {
            setOpenGenerateModal(false);
            fetchFeeData(); // Refresh list if new fees were generated
          }}
        />
      )}

      {/* VIEW DETAILS MODAL */}
      {openViewModal && (
        <StudentFeeViewModal
          open={openViewModal}
          onClose={handleCloseViewModal}
          fee={selectedStudentFee}
        />
      )}
    </div>
  );
};

export default StudentFeePage;