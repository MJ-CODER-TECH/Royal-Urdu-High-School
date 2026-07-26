import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserCheck, Search } from "lucide-react";

import {
  fetchTeachers,
  getTeacherTimetable,
} from "../../redux/timetable/timetableThunk";

import { fetchAcademicYears } from "../../redux/master/academicYearThunk";

import TeacherTimetableTable from "./TeacherTimetableTable";

const TeacherTimetableView = () => {
  const dispatch = useDispatch();

  const {
    teacherTimetable = [],
    teachers = [],
    loading = false,
  } = useSelector((state) => state.timetable || {});

  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  const [filters, setFilters] = useState({
    academic_year_id: "",
    teacher_id: "",
  });

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchTeachers());
  }, [dispatch]);

  const handleView = (e) => {
    e?.preventDefault();
    if (!filters.academic_year_id || !filters.teacher_id) {
      return;
    }
    dispatch(getTeacherTimetable(filters));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <UserCheck className="text-indigo-600" size={26} />
          <h1 className="text-2xl font-bold text-slate-800">
            Teacher Timetable View
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          View assigned teaching schedules and period allocations by teacher.
        </p>
      </div>

      {/* Filters Form */}
      <form
        onSubmit={handleView}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Academic Year Dropdown */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Academic Year
            </label>
            <select
              value={filters.academic_year_id}
              onChange={(e) =>
                setFilters({ ...filters, academic_year_id: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Academic Year</option>
              {academicYears.map((item) => (
                <option
                  key={item.academic_year_id}
                  value={item.academic_year_id}
                >
                  {item.year_start} - {item.year_end}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Dropdown */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Teacher
            </label>
            <select
              value={filters.teacher_id}
              onChange={(e) =>
                setFilters({ ...filters, teacher_id: e.target.value })
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Select Teacher</option>
              {teachers.map((item) => (
                <option
                  key={item.teacher_id || item.user_id || item.id}
                  value={item.teacher_id || item.user_id || item.id}
                >
                  {item.teacher_name || item.name || item.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={!filters.academic_year_id || !filters.teacher_id}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <Search size={15} />
              View Timetable
            </button>
          </div>
        </div>
      </form>

      {/* Timetable Table */}
      <TeacherTimetableTable timetable={teacherTimetable} loading={loading} />
    </div>
  );
};

export default TeacherTimetableView;