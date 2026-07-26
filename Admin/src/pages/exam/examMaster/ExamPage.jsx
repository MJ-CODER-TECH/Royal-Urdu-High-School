import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getExams,
  createExam,
  updateExam,
  deleteExam,
  changeExamStatus,
  fetchClasses,
  fetchAcademicYears,
} from "../../../redux/exam/examMaster/examThunk";

import ExamTable from "./ExamTable";
import ExamModal from "./ExamModal";

import usePermission from "../../../hooks/usePermission";

const ExamPage = () => {
  const dispatch = useDispatch();

  const {
    exams = [],
    classes = [],
    academicYears = [],
    loading = false,
    submitting = false,
  } = useSelector((state) => state.exam || {});

  const { hasPermission } = usePermission();

  const [openModal, setOpenModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    academicYear: "",
    className: "",
    status: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Initial Data Fetch
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(getExams());
    dispatch(fetchClasses());
    dispatch(fetchAcademicYears());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Filter Change Handler
  |--------------------------------------------------------------------------
  */
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Actions (Submit, Add, Edit, Delete, Status)
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (data) => {
    try {
      if (selectedExam) {
        await dispatch(
          updateExam({
            id: selectedExam.exam_id,
            data,
          })
        ).unwrap();
      } else {
        await dispatch(createExam(data)).unwrap();
      }

      setOpenModal(false);
      setSelectedExam(null);
      // Extra re-fetch is not needed if the redux slice updates the store on fullfilled action
      dispatch(getExams()); 
    } catch (error) {
      console.error("Failed to save exam:", error);
    }
  };

  const handleAdd = () => {
    setSelectedExam(null);
    setOpenModal(true);
  };

  const handleEdit = useCallback((exam) => {
    setSelectedExam(exam);
    setOpenModal(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!window.confirm("Are you sure you want to delete this exam?")) return;

      try {
        await dispatch(deleteExam(id)).unwrap();
        dispatch(getExams());
      } catch (error) {
        console.error("Failed to delete exam:", error);
      }
    },
    [dispatch]
  );

  const handleStatusChange = useCallback(
    async (exam) => {
      const nextStatus = exam.status === "Active" ? "Inactive" : "Active";

      try {
        await dispatch(
          changeExamStatus({
            id: exam.exam_id,
            status: nextStatus,
          })
        ).unwrap();
        dispatch(getExams());
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    },
    [dispatch]
  );

  /*
  |--------------------------------------------------------------------------
  | Memoized Filtered Data (Performance Improvement)
  |--------------------------------------------------------------------------
  */
  const filteredData = useMemo(() => {
    const search = filters.search.trim().toLowerCase();

    return exams.filter((item) => {
      const academicYearStr = item.year_start && item.year_end 
        ? `${item.year_start} - ${item.year_end}` 
        : "";

      const matchSearch =
        !search ||
        item.exam_name?.toLowerCase().includes(search) ||
        item.class_name?.toLowerCase().includes(search) ||
        academicYearStr.toLowerCase().includes(search);

      const matchAcademicYear =
        !filters.academicYear ||
        item.academic_year_id === Number(filters.academicYear);

      const matchClass =
        !filters.className ||
        item.class_id === Number(filters.className);

      const matchStatus =
        !filters.status ||
        item.status === filters.status;

      return matchSearch && matchAcademicYear && matchClass && matchStatus;
    });
  }, [exams, filters]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Exam Management</h1>

        {hasPermission("exam.create") && (
          <button
            onClick={handleAdd}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            + Add Exam
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input
          type="text"
          placeholder="Search by exam name or class..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        <select
          value={filters.academicYear}
          onChange={(e) => handleFilterChange("academicYear", e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Academic Years</option>
          {academicYears.map((item) => (
            <option key={item.academic_year_id} value={item.academic_year_id}>
              {item.year_start} - {item.year_end}
            </option>
          ))}
        </select>

        <select
          value={filters.className}
          onChange={(e) => handleFilterChange("className", e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Classes</option>
          {classes.map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Data Table */}
      <ExamTable
        loading={loading}
        exams={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Create / Edit Modal */}
      <ExamModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedExam(null);
        }}
        selectedExam={selectedExam}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default ExamPage;