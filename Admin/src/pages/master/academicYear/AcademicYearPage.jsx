import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import {
  getAcademicYears,
  deleteAcademicYear,
  changeAcademicYearStatus,
} from "../../../redux/master/academicYearThunk";

import { clearSelectedAcademicYear } from "../../../redux/master/academicYearSlice";

import AcademicYearTable from "./AcademicYearTable";
import AcademicYearModal from "./AcademicYearModal";

const AcademicYearPage = () => {
  const dispatch = useDispatch();

  const { academicYearList = [], loading = false } = useSelector(
    (state) => state.academicYear || {}
  );

  const [openModal, setOpenModal] = useState(false);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);

  // Fetch initial list on mount
  useEffect(() => {
    dispatch(getAcademicYears());
  }, [dispatch]);

  // Modal Open Handlers
  const handleAdd = () => {
    dispatch(clearSelectedAcademicYear());
    setSelectedAcademicYear(null);
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    setSelectedAcademicYear(row);
    setOpenModal(true);
  };

  // Delete Action with Error Handling
  const handleDelete = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this academic year?"
    );
    if (!confirmed) return;

    try {
      await dispatch(deleteAcademicYear(id)).unwrap();
      dispatch(getAcademicYears());
    } catch (error) {
      console.error("Failed to delete academic year:", error);
    }
  };

  // Status Toggle Action
  const handleStatus = async (row) => {
    if (!row?.academic_year_id) return;

    try {
      await dispatch(
        changeAcademicYearStatus({
          id: row.academic_year_id,
          is_active: row.is_active ? 0 : 1,
        })
      ).unwrap();

      dispatch(getAcademicYears());
    } catch (error) {
      console.error("Failed to change academic year status:", error);
    }
  };

  // Modal Close Handler
  const handleClose = useCallback(() => {
    setOpenModal(false);
    setSelectedAcademicYear(null);
    dispatch(clearSelectedAcademicYear());
  }, [dispatch]);

  return (
    <div className="space-y-6 p-1">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Academic Year Master
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage academic sessions, current year flags, and session statuses.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 active:bg-indigo-800 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span>Add Academic Year</span>
        </button>
      </div>

      {/* Data Table */}
      <AcademicYearTable
        data={academicYearList}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatus={handleStatus}
      />

      {/* Form Modal */}
      <AcademicYearModal
        open={openModal}
        onClose={handleClose}
        selectedAcademicYear={selectedAcademicYear}
      />
    </div>
  );
};

export default AcademicYearPage;