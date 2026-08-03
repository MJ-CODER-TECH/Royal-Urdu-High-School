import React, { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    dispatch(getTimetables({}));
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const filteredSections = useMemo(() => {
    if (!filters.class_id) {
      return [];
    }

    return sections.filter(
      (section) =>
        String(section.class_id) === String(filters.class_id)
    );
  }, [sections, filters.class_id]);

  const handleSubmit = async (data) => {
    const payload = {
      ...data,
      academic_year_id: Number(data.academic_year_id),
      class_id: Number(data.class_id),
      section_id: Number(data.section_id),
      subject_id: Number(data.subject_id),
      teacher_id: data.teacher_id
        ? Number(data.teacher_id)
        : null,
      period_no: Number(data.period_no),
    };

    try {
      if (selectedTimetable) {
        await dispatch(
          updateTimetable({
            id: selectedTimetable.timetable_id,
            data: payload,
          })
        ).unwrap();
      } else {
        await dispatch(
          createTimetable(payload)
        ).unwrap();
      }

      setOpenModal(false);
      setSelectedTimetable(null);

      dispatch(getTimetables(filters));
    } catch (error) {
      console.error("Failed to save timetable:", error);
    }
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this timetable period?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await dispatch(deleteTimetable(id)).unwrap();

      dispatch(getTimetables(filters));
    } catch (error) {
      console.error("Failed to delete timetable:", error);
    }
  };

  const handleStatus = async (row) => {
    const status =
      row.status === "Active"
        ? "Inactive"
        : "Active";

    try {
      await dispatch(
        changeTimetableStatus({
          id: row.timetable_id,
          status,
        })
      ).unwrap();

      dispatch(getTimetables(filters));
    } catch (error) {
      console.error(
        "Failed to change timetable status:",
        error
      );
    }
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

  const tableData = useMemo(() => {
    if (!search.trim()) {
      return timetables;
    }

    const value = search
      .toLowerCase()
      .trim();

    return timetables.filter((item) => {
      return (
        item.class_name
          ?.toLowerCase()
          .includes(value) ||
        item.section_name
          ?.toLowerCase()
          .includes(value) ||
        item.subject_name
          ?.toLowerCase()
          .includes(value) ||
        item.teacher_name
          ?.toLowerCase()
          .includes(value) ||
        item.day_of_week
          ?.toLowerCase()
          .includes(value) ||
        item.room
          ?.toLowerCase()
          .includes(value)
      );
    });
  }, [timetables, search]);

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Timetable Management
          </h1>

          <p className="mt-0.5 text-xs text-slate-500">
            Manage class periods, schedules, and teacher assignments.
          </p>
        </div>

        {hasPermission("timetable.create") && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700"
          >
            <Plus size={16} />

            Add Timetable
          </button>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <select
            value={filters.academic_year_id}
            onChange={(e) => {
              setFilters((previous) => ({
                ...previous,
                academic_year_id: e.target.value,
              }));
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Academic Year
            </option>

            {academicYears.map((item) => (
              <option
                key={item.academic_year_id}
                value={item.academic_year_id}
              >
                {item.year_start} - {item.year_end}
              </option>
            ))}
          </select>

          <select
            value={filters.class_id}
            onChange={(e) => {
              setFilters((previous) => ({
                ...previous,
                class_id: e.target.value,
                section_id: "",
              }));
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Select Class
            </option>

            {classes.map((item) => (
              <option
                key={item.class_id}
                value={item.class_id}
              >
                {item.class_name}
              </option>
            ))}
          </select>

          <select
            value={filters.section_id}
            disabled={!filters.class_id}
            onChange={(e) => {
              setFilters((previous) => ({
                ...previous,
                section_id: e.target.value,
              }));
            }}
            className="cursor-pointer rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="">
              {filters.class_id
                ? "Select Section"
                : "Select Class First"}
            </option>

            {filteredSections.map((item) => (
              <option
                key={item.section_id}
                value={item.section_id}
              >
                {item.section_name}
              </option>
            ))}
          </select>

          <select
            value={filters.teacher_id}
            onChange={(e) => {
              setFilters((previous) => ({
                ...previous,
                teacher_id: e.target.value,
              }));
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Select Teacher
            </option>

            {teachers.map((item, index) => (
              <option
                key={
                  item.user_id ||
                  item.teacher_id ||
                  index
                }
                value={
                  item.user_id ||
                  item.teacher_id
                }
              >
                {item.name ||
                  item.teacher_name ||
                  item.full_name}
              </option>
            ))}
          </select>

          <select
            value={filters.day_of_week}
            onChange={(e) => {
              setFilters((previous) => ({
                ...previous,
                day_of_week: e.target.value,
              }));
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">
              Select Day
            </option>

            {DAYS.map((day) => (
              <option
                key={day}
                value={day}
              >
                {day}
              </option>
            ))}
          </select>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSearch}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              <Search size={14} />

              Filter
            </button>

            <button
              type="button"
              onClick={handleReset}
              title="Reset Filters"
              className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          placeholder="Search by class, section, subject, teacher, day or room..."
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-800 shadow-xs outline-hidden placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        />

        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <TimetableTable
        loading={loading}
        timetables={tableData}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatus}
      />

      <TimetableModal
        open={openModal}
        selectedTimetable={selectedTimetable}
        submitting={submitting}
        onSubmit={handleSubmit}
        onClose={() => {
          setOpenModal(false);
          setSelectedTimetable(null);
        }}
      />
    </div>
  );
};

export default TimetablePage;