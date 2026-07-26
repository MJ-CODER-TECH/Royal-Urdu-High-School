import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, UserCheck } from "lucide-react";

import AttendanceTable from "./AttendanceTable";
import AttendanceModal from "./AttendanceModal";
import AttendanceFilters from "./AttendanceFilters";

import {
  getAttendance,
  deleteAttendance,
} from "../../redux/attendance/attendanceThunk";

const AttendancePage = () => {
  const dispatch = useDispatch();

  const {
    attendance = [],
    loading,
    page,
    totalPages,
  } = useSelector((state) => state.attendance);

  const [openModal, setOpenModal] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    attendanceDate: "",
    classId: "",
    sectionId: "",
    status: "",
    page: 1,
    limit: 20,
  });

  // Fetch Attendance on Filter / Dispatch Change
  useEffect(() => {
    dispatch(getAttendance(filters));
  }, [dispatch, filters]);

  const handleAdd = () => {
    setSelectedAttendance(null);
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    setSelectedAttendance(row);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance record?")) {
      return;
    }
    await dispatch(deleteAttendance(id));
    dispatch(getAttendance(filters));
  };

  const handlePageChange = (pageNo) => {
    setFilters((prev) => ({
      ...prev,
      page: pageNo,
    }));
  };

  const handleClose = () => {
    setOpenModal(false);
    setSelectedAttendance(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <UserCheck size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
              Student Attendance
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Manage daily student attendance, filter records, and generate logs.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div>
          <button
            onClick={handleAdd}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow active:scale-[0.98]"
          >
            <Plus size={18} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Filter Bar Component */}
      <AttendanceFilters filters={filters} setFilters={setFilters} />

      {/* Main Table View */}
      <AttendanceTable
        attendance={attendance}
        loading={loading}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Attendance Create/Edit Modal */}
      <AttendanceModal
        open={openModal}
        attendance={selectedAttendance}
        onClose={handleClose}
      />
    </div>
  );
};

export default AttendancePage;