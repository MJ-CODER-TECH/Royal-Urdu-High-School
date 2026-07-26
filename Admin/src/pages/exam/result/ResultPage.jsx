import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Sparkles } from "lucide-react";

import {
  generateResult,
  getResultsByFilter,
} from "../../../redux/exam/result/resultThunk";

import ResultFilter from "./ResultFilter";
import ResultTable from "./ResultTable";
import usePermission from "../../../hooks/usePermission";

const ResultPage = () => {
  const dispatch = useDispatch();

  const {
    results,
    loading,
    submitting,
  } = useSelector((state) => state.result);

  const { hasPermission } = usePermission();

  const [filters, setFilters] = useState({
    academic_year_id: "",
    class_id: "",
    section_id: "",
    exam_id: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Load Results on Mount
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(getResultsByFilter(filters));
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Filter Change
  |--------------------------------------------------------------------------
  */
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Generate Result
  |--------------------------------------------------------------------------
  */
  const handleGenerate = async () => {
    const resultAction = await dispatch(generateResult(filters));

    if (!resultAction.error) {
      dispatch(getResultsByFilter(filters));
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Search Existing Result
  |--------------------------------------------------------------------------
  */
  const handleSearch = () => {
    dispatch(getResultsByFilter(filters));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Result Management
          </h1>
          <p className="text-sm text-gray-500">
            Generate and view examination results for classes and sections.
          </p>
        </div>

        {hasPermission("result.create") && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Sparkles size={18} />
            )}
            {submitting ? "Generating..." : "Generate Result"}
          </button>
        )}
      </div>

      {/* Filters Section */}
      <ResultFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Results Table Section */}
      <ResultTable
        results={results}
        loading={loading}
      />
    </div>
  );
};

export default ResultPage;