import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, RotateCcw, X } from "lucide-react";

import {
  getTimetables,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  changeTimetableStatus,
  fetchClasses,
  fetchSections,
  fetchTeachers,
} from "../../redux/timetable/timetableThunk";

import { fetchAcademicYears } from "../../redux/master/academicYearThunk";

import TimetableTable from "./TimetableTable";
import TimetableModal from "./TimetableModal";

import usePermission from "../../hooks/usePermission";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TimetablePage = () => {
  const dispatch = useDispatch();
  const { hasPermission } = usePermission();

  // Redux state with safe default fallbacks
  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  const {
    classes = [],
    sections = [],
    teachers = [],
    timetables = [],
    loading = false,
    submitting = false,
  } = useSelector((state) => state.timetable || {});

  // Local state
  const [openModal, setOpenModal] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    academic_year_id: "",
    class_id: "",
    section_id: "",
    teacher_id: "",
    day_of_week: "",
  });

  // Fetch initial dropdown data & timetables
  useEffect(() => {
    dispatch(getTimetables({}));
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
    dispatch(fetchTeachers());
  }, [dispatch]);

  // Form submission handler
  const handleSubmit = async (data) => {
    const payload = {
      ...data,
      academic_year_id: Number(data.academic_year_id),
      class_id: Number(data.class_id),
      section_id: Number(data.section_id),
      subject_id: Number(data.subject_id),
      teacher_id: data.teacher_id ? Number(data.teacher_id) : null,
      period_no: Number(data.period_no),
    };

    if (selectedTimetable) {
      await dispatch(
        updateTimetable({
          id: selectedTimetable.timetable_id,
          data: payload,
        })
      );
    } else {
      await dispatch(createTimetable(payload));
    }

    setOpenModal(false);
    setSelectedTimetable(null);
    dispatch(getTimetables(filters));
  };

  const handleAdd = () => {
    setSelectedTimetable(null);
    setOpenModal(true);
  };

  const handleEdit = (row) => {
    setSelectedTimetable(row);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timetable period?")) {
      return;
    }
    await dispatch(deleteTimetable(id));
    dispatch(getTimetables(filters));
  };

  const handleStatus = async (row) => {
    const status = row.status === "Active" ? "Inactive" : "Active";
    await dispatch(
      changeTimetableStatus({
        id: row.timetable_id,
        status,
      })
    );
    dispatch(getTimetables(filters));
  };

  const handleSearch = () => {
    dispatch(getTimetables(filters));
  };

  const handleReset = () => {
    const resetState = {
      academic_year_id: "",
      class_id: "",
      section_id: "",
      teacher_id: "",
      day_of_week: "",
    };
    setFilters(resetState);
    setSearch("");
    dispatch(getTimetables(resetState));
  };

  // Memoized client-side table filter
  const tableData = useMemo(() => {
    if (!search.trim()) return timetables;
    const value = search.toLowerCase().trim();

    return timetables.filter(
      (item) =>
        item.class_name?.toLowerCase().includes(value) ||
        item.section_name?.toLowerCase().includes(value) ||
        item.subject_name?.toLowerCase().includes(value) ||
        item.teacher_name?.toLowerCase().includes(value) ||
        item.day_of_week?.toLowerCase().includes(value) ||
        item.room?.toLowerCase().includes(value)
    );
  }, [timetables, search]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Timetable Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage class periods, schedules, and teacher assignments.
          </p>
        </div>

        {hasPermission("timetable.create") && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            <Plus size={16} />
            Add Timetable
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Academic Year */}
          <select
            value={filters.academic_year_id}
            onChange={(e) =>
              setFilters({ ...filters, academic_year_id: e.target.value })
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Academic Year</option>
            {academicYears.map((item) => (
              <option key={item.academic_year_id} value={item.academic_year_id}>
                {item.year_start} - {item.year_end}
              </option>
            ))}
          </select>

          {/* Class */}
          <select
            value={filters.class_id}
            onChange={(e) =>
              setFilters({ ...filters, class_id: e.target.value })
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select Class</option>
            {classes.map((item, idx) => (
              <option key={item.class_id || idx} value={item.class_id}>
                {item.class_name}
              </option>
            ))}
          </select>

          {/* Section */}
          <select
            value={filters.section_id}
            onChange={(e) =>
              setFilters({ ...filters, section_id: e.target.value })
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select Section</option>
            {sections.map((item, idx) => (
              <option key={item.section_id || idx} value={item.section_id}>
                {item.class_name ? `${item.class_name} - ` : ""}
                {item.section_name}
              </option>
            ))}
          </select>

          {/* Teacher */}
          <select
            value={filters.teacher_id}
            onChange={(e) =>
              setFilters({ ...filters, teacher_id: e.target.value })
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select Teacher</option>
            {teachers.map((item, idx) => (
              <option
                key={item.user_id || item.teacher_id || idx}
                value={item.user_id || item.teacher_id}
              >
                {item.name || item.teacher_name || item.full_name}
              </option>
            ))}
          </select>

          {/* Day */}
          <select
            value={filters.day_of_week}
            onChange={(e) =>
              setFilters({ ...filters, day_of_week: e.target.value })
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">Select Day</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Filter Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Search size={14} />
              Filter
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset Filters"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search by class, section, subject, teacher, day or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 placeholder-slate-400 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-xs"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Table Component */}
      <TimetableTable
        loading={loading}
        timetables={tableData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatus}
      />

      {/* Modal Component */}
      <TimetableModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedTimetable(null);
        }}
        selectedTimetable={selectedTimetable}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
};

export default TimetablePage;