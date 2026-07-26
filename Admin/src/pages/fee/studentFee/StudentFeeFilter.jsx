import React, { useState, useEffect } from "react";
import { Search, X, RotateCcw } from "lucide-react";

const StudentFeeFilters = ({
  filters,
  onChange,
  classes = [],
  academicYears = [],
}) => {
  // Local state for debounced search input
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Sync internal state when filters.search changes externally
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Debounce search update to avoid API spam on every keypress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
    onChange({ search: "" });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    onChange({
      search: "",
      class_id: "",
      academic_year_id: "",
      status: "",
    });
  };

  // Check if any filter is active to conditionally highlight Reset button
  const isFilterActive =
    !!filters.search ||
    !!filters.class_id ||
    !!filters.academic_year_id ||
    !!filters.status;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* SEARCH INPUT */}
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3.5 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search Admission No / Student"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-300 rounded-lg pl-10 pr-9 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              aria-label="Clear search"
              className="absolute right-3 p-0.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* CLASS SELECT */}
        <select
          value={filters.class_id || ""}
          onChange={(e) =>
            onChange({
              class_id: e.target.value,
            })
          }
          className="w-full bg-gray-50/50 border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">All Classes</option>
          {classes.map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
            </option>
          ))}
        </select>

        {/* ACADEMIC YEAR SELECT */}
        <select
          value={filters.academic_year_id || ""}
          onChange={(e) =>
            onChange({
              academic_year_id: e.target.value,
            })
          }
          className="w-full bg-gray-50/50 border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">All Academic Years</option>
          {academicYears.map((item) => (
            <option key={item.academic_year_id} value={item.academic_year_id}>
              {item.academic_year ||
                (item.year_start && item.year_end
                  ? `${item.year_start} - ${item.year_end}`
                  : item.year_name || item.academic_year_id)}
            </option>
          ))}
        </select>

        {/* STATUS SELECT */}
        <select
          value={filters.status || ""}
          onChange={(e) =>
            onChange({
              status: e.target.value,
            })
          }
          className="w-full bg-gray-50/50 border border-gray-300 rounded-lg px-3.5 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Partial">Partial</option>
          <option value="Pending">Pending / Unpaid</option>
        </select>
      </div>

      {/* RESET FILTERS OPTION (ONLY VISIBLE WHEN FILTERS ARE ACTIVE) */}
      {isFilterActive && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-rose-600 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default StudentFeeFilters;