import { Search, RotateCcw, X } from "lucide-react";

const FeeStructureFilter = ({
  search,
  setSearch,
  classId,
  setClassId,
  feeHeadId,
  setFeeHeadId,
  academicYearId,
  setAcademicYearId,
  status,
  setStatus,
  classes = [],
  feeHeads = [],
  academicYears = [],
  onReset, // Optional explicit reset handler if provided by parent
}) => {
  // Check if any filter is active
  const hasActiveFilters =
    search || classId || feeHeadId || academicYearId || status;

  // Default internal reset if parent doesn't pass one
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      setSearch("");
      setClassId("");
      setFeeHeadId("");
      setAcademicYearId("");
      setStatus("");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* SEARCH INPUT */}
        <div className="relative flex items-center">
          <Search
            size={18}
            className="absolute left-3 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search structure..."
            className="w-full border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ACADEMIC YEAR */}
        <div>
          <select
            value={academicYearId}
            onChange={(e) => setAcademicYearId(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white cursor-pointer ${
              academicYearId
                ? "border-blue-500 font-medium text-gray-900 bg-blue-50/20"
                : "border-gray-300 text-gray-700"
            }`}
          >
            <option value="">All Academic Years</option>
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

        {/* CLASS */}
        <div>
          <select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white cursor-pointer ${
              classId
                ? "border-blue-500 font-medium text-gray-900 bg-blue-50/20"
                : "border-gray-300 text-gray-700"
            }`}
          >
            <option value="">All Classes</option>
            {classes.map((item) => (
              <option key={item.class_id} value={item.class_id}>
                {item.class_name}
              </option>
            ))}
          </select>
        </div>

        {/* FEE HEAD */}
        <div>
          <select
            value={feeHeadId}
            onChange={(e) => setFeeHeadId(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white cursor-pointer ${
              feeHeadId
                ? "border-blue-500 font-medium text-gray-900 bg-blue-50/20"
                : "border-gray-300 text-gray-700"
            }`}
          >
            <option value="">All Fee Heads</option>
            {feeHeads.map((item) => (
              <option key={item.fee_head_id} value={item.fee_head_id}>
                {item.fee_name}
              </option>
            ))}
          </select>
        </div>

        {/* STATUS */}
        <div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white cursor-pointer ${
              status
                ? "border-blue-500 font-medium text-gray-900 bg-blue-50/20"
                : "border-gray-300 text-gray-700"
            }`}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* RESET ACTION ROW */}
      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 px-2 py-1 rounded-md hover:bg-red-50 transition-all"
          >
            <RotateCcw size={13} />
            <span>Reset Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default FeeStructureFilter;