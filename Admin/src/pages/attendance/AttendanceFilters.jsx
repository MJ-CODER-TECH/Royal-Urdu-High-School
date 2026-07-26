import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

import {
  getClassesApi,
  getSectionsApi,
} from "../../api/master.api";

const AttendanceFilters = ({ filters, setFilters }) => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [classList, sectionList] = await Promise.all([
          getClassesApi(),
          getSectionsApi(),
        ]);

        setClasses(classList || []);
        setSections(sectionList || []);
      } catch (error) {
        console.error("Failed to fetch master data:", error);
      }
    };

    loadMasters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleReset = () => {
    setFilters({
      search: "",
      page: 1,
      limit: 20,
      classId: "",
      sectionId: "",
      status: "",
      attendanceDate: "",
    });
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all">
      {/* Header Label matching Screenshot */}
      <div className="mb-3 flex items-center gap-2 text-slate-600">
        <SlidersHorizontal size={16} className="text-slate-500" />
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Filters
        </span>
      </div>

      {/* Grid Controls */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {/* Search */}
        <div className="relative lg:col-span-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            name="search"
            placeholder="Search student..."
            value={filters.search || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Date */}
        <div>
          <input
            type="date"
            name="attendanceDate"
            value={filters.attendanceDate || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Class */}
        <div>
          <select
            name="classId"
            value={filters.classId || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Classes</option>
            {classes.map((item) => (
              <option key={item.class_id} value={item.class_id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </div>

        {/* Section */}
        <div>
          <select
            name="sectionId"
            value={filters.sectionId || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Sections</option>
            {sections.map((section) => (
              <option key={section.section_id} value={section.section_id}>
                {section.class_name ? `${section.class_name} - ` : ""}
                {section.section_name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div>
          <select
            name="status"
            value={filters.status || ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500"
          >
            <option value="">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
            <option value="Late">Late</option>
            <option value="Half Day">Half Day</option>
            <option value="Leave">Leave</option>
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            type="button"
            onClick={handleReset}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
          >
            <RotateCcw size={15} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendanceFilters;