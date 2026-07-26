import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Calendar, Search, Filter } from "lucide-react";

import {
  getClassTimetable,
  fetchClasses,
  fetchSections,
} from "../../redux/timetable/timetableThunk";

import { fetchAcademicYears } from "../../redux/master/academicYearThunk";

import ClassTimetableTable from "./ClassTimetableTable";

const ClassTimetableView = () => {
  const dispatch = useDispatch();

  const {
    classTimetable = [],
    classes = [],
    sections = [],
    loading = false,
  } = useSelector((state) => state.timetable || {});

  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  const [filters, setFilters] = useState({
    academic_year_id: "",
    class_id: "",
    section_id: "",
  });

  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
  }, [dispatch]);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (!filters.academic_year_id || !filters.class_id || !filters.section_id) {
      return;
    }
    dispatch(getClassTimetable(filters));
  };

  // Filter sections dynamically if backend sends class_id on sections
  const filteredSections = filters.class_id
    ? sections.filter(
        (sec) => String(sec.class_id) === String(filters.class_id)
      )
    : sections;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-indigo-600" size={26} />
          <h1 className="text-2xl font-bold text-slate-800">
            Class Timetable
          </h1>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          View weekly schedule and period allocations for classes and sections.
        </p>
      </div>

      {/* Filter Bar */}
      <form
        onSubmit={handleSearch}
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
          {/* Academic Year */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Academic Year
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={filters.academic_year_id}
              onChange={(e) =>
                setFilters({ ...filters, academic_year_id: e.target.value })
              }
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

          {/* Class */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Class
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={filters.class_id}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  class_id: e.target.value,
                  section_id: "", // Reset section when class changes
                })
              }
            >
              <option value="">Select Class</option>
              {classes.map((item) => (
                <option key={item.class_id} value={item.class_id}>
                  {item.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Section */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Section
            </label>
            <select
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={filters.section_id}
              disabled={!filters.class_id}
              onChange={(e) =>
                setFilters({ ...filters, section_id: e.target.value })
              }
            >
              <option value="">Select Section</option>
              {filteredSections.map((item) => (
                <option key={item.section_id} value={item.section_id}>
                   {item.class_name} - {item.section_name}
                </option>
              ))}



         
            </select>
          </div>

          {/* Action Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={
                !filters.academic_year_id ||
                !filters.class_id ||
                !filters.section_id
              }
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed cursor-pointer"
            >
              <Search size={15} />
              View Timetable
            </button>
          </div>
        </div>
      </form>

      {/* Table Section */}
      <ClassTimetableTable data={classTimetable} loading={loading} />
    </div>
  );
};

export default ClassTimetableView;