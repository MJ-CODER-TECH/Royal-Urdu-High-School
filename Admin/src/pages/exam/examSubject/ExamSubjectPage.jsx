import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, RotateCcw } from "lucide-react";

import {
  getExamSubjects,
  createExamSubject,
  updateExamSubject,
  deleteExamSubject,
  changeExamSubjectStatus,
  fetchClasses,
  fetchSubjects,
  fetchExams,
  fetchAcademicYears,
} from "../../../redux/exam/examSubject/examSubjectThunk";

import ExamSubjectTable from "./ExamSubjectTable";
import ExamSubjectModal from "./ExamSubjectModal";
import usePermission from "../../../hooks/usePermission";

const ExamSubjectPage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  const {
    examSubjects = [],
    classes = [],
    academicYears = [],
    exams = [],
    subjects = [],
    loading = false,
    submitting = false,
  } = useSelector((state) => state.examSubject || {});

  const [openModal, setOpenModal] = useState(false);
  const [selectedExamSubject, setSelectedExamSubject] = useState(null);

  const initialFilters = {
    search: "",
    academicYear: "",
    className: "",
    examName: "",
    subjectName: "",
    status: "",
  };

  const [filters, setFilters] = useState(initialFilters);

  /*
  |------------------------------------------------------------------
  | Initial Data Fetching
  |------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(getExamSubjects());
    dispatch(fetchClasses());
    dispatch(fetchAcademicYears());
    dispatch(fetchExams());
    dispatch(fetchSubjects());
  }, [dispatch]);

  /*
  |------------------------------------------------------------------
  | Form Handlers
  |------------------------------------------------------------------
  */
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleSubmit = async (data) => {
    const payload = {
      exam_id: Number(data.exam_id),
      class_id: Number(data.class_id),
      subject_id: Number(data.subject_id),
      max_marks: Number(data.max_marks),
      pass_marks: Number(data.pass_marks),
    };

    if (selectedExamSubject) {
      await dispatch(
        updateExamSubject({
          id: selectedExamSubject.exam_subject_id,
          data: payload,
        })
      );
    } else {
      await dispatch(createExamSubject(payload));
    }

    setOpenModal(false);
    setSelectedExamSubject(null);
    dispatch(getExamSubjects());
  };

  const handleAdd = () => {
    setSelectedExamSubject(null);
    setOpenModal(true);
  };

  const handleEdit = (item) => {
    setSelectedExamSubject(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam subject?")) {
      return;
    }

    await dispatch(deleteExamSubject(id));
    dispatch(getExamSubjects());
  };

  const handleStatusChange = async (item) => {
    const currentStatus = item.status?.toLowerCase();
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await dispatch(
      changeExamSubjectStatus({
        id: item.exam_subject_id,
        status: newStatus,
      })
    );

    dispatch(getExamSubjects());
  };

  /*
  |------------------------------------------------------------------
  | Filter & Search Logic
  |------------------------------------------------------------------
  */
  const filteredData = examSubjects.filter((item) => {
    const search = filters.search.toLowerCase().trim();

    const matchSearch =
      !search ||
      item.exam_name?.toLowerCase().includes(search) ||
      item.subject_name?.toLowerCase().includes(search) ||
      item.class_name?.toLowerCase().includes(search);

    const matchAcademicYear =
      !filters.academicYear ||
      item.academic_year_id === Number(filters.academicYear);

    const matchClass =
      !filters.className || item.class_id === Number(filters.className);

    const matchExam =
      !filters.examName || item.exam_id === Number(filters.examName);

    const matchSubject =
      !filters.subjectName || item.subject_id === Number(filters.subjectName);

    const matchStatus =
      !filters.status ||
      item.status?.toLowerCase() === filters.status.toLowerCase();

    return (
      matchSearch &&
      matchAcademicYear &&
      matchClass &&
      matchExam &&
      matchSubject &&
      matchStatus
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Exam Subjects
          </h1>
          <p className="text-sm text-gray-500">
            Manage subject allocations, passing criteria, and maximum marks.
          </p>
        </div>

        {hasPermission("exam.create") && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Subject
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              name="search"
              placeholder="Search..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full rounded-lg border border-gray-300 pl-9 pr-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Academic Year Filter */}
          <select
            name="academicYear"
            value={filters.academicYear}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Academic Year</option>
            {academicYears.map((item) => (
              <option
                key={item.academic_year_id}
                value={item.academic_year_id}
              >
                {item.year_start} - {item.year_end}
              </option>
            ))}
          </select>

          {/* Class Filter */}
          <select
            name="className"
            value={filters.className}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Class</option>
            {classes.map((item) => (
              <option key={item.class_id} value={item.class_id}>
                {item.class_name}
              </option>
            ))}
          </select>

          {/* Exam Filter */}
          <select
            name="examName"
            value={filters.examName}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Exam</option>
            {exams.map((item) => (
              <option key={item.exam_id} value={item.exam_id}>
                {item.exam_name}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            name="subjectName"
            value={filters.subjectName}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Subject</option>
            {subjects.map((item) => (
              <option key={item.subject_id} value={item.subject_id}>
                {item.subject_name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Clear Filters helper */}
        {Object.values(filters).some(Boolean) && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              <RotateCcw size={12} /> Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Table Data */}
      <ExamSubjectTable
        loading={loading}
        examSubjects={filteredData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Form Modal */}
      <ExamSubjectModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedExamSubject(null);
        }}
        selectedExamSubject={selectedExamSubject}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default ExamSubjectPage;