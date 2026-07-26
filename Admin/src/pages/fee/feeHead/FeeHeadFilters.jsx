import { useEffect, useState } from "react";
import { Search, RotateCcw } from "lucide-react";

const FeeHeadFilters = ({
  filters = { search: "" },
  onChange,
}) => {
  // Local state to keep typing instant and smooth
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Sync local state if filters are reset or updated externally
  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Debounce API calls (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        onChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onChange]);

  const handleReset = () => {
    setSearchTerm("");
    onChange({ search: "" });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        
        {/* SEARCH INPUT */}
        <div className="relative w-full sm:w-80 md:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search Fee Head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm transition-all outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* RESET BUTTON */}
        <button
          type="button"
          onClick={handleReset}
          disabled={!searchTerm}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

      </div>
    </div>
  );
};

export default FeeHeadFilters;