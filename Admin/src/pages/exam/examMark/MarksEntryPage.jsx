import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Save } from "lucide-react";

import {
  getMarksByFilter,
  bulkCreateMarks,
  getStudentsForMarks,
} from "../../../redux/exam/examMark/markThunk";

import {
  updateLocalMarks,
} from "../../../redux/exam/examMark/markSlice";

import MarksFilter from "./MarksFilter";
import MarksTable from "./MarksTable";

import usePermission from "../../../hooks/usePermission";

const MarksEntryPage = () => {
  const dispatch = useDispatch();

  const {
    marks,
    loading,
    submitting,
  } = useSelector((state) => state.mark);

  const { hasPermission } = usePermission();

  const [filters, setFilters] = useState({
    academic_year_id: "",
    class_id: "",
    section_id: "",
    exam_id: "",
    subject_id: "",
  });

  /*
  |--------------------------------------------------------------------------
  | Handle Filter Change
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
  | Load Students
  |--------------------------------------------------------------------------
  */
  const handleSearch = () => {
    dispatch(getStudentsForMarks(filters));
  };

  /*
  |--------------------------------------------------------------------------
  | Save Marks
  |--------------------------------------------------------------------------
  */
  const handleSave = async () => {
    const updatedMarks = marks.map((item) => ({
      student_id: item.student_id,
      academic_year_id: Number(filters.academic_year_id),
      class_id: Number(filters.class_id),
      section_id: Number(filters.section_id),
      exam_id: Number(filters.exam_id),
      subject_id: Number(filters.subject_id),
      max_marks: Number(item.max_marks || 100),
      obtained_marks: item.obtained_marks === "" ? 0 : Number(item.obtained_marks || 0),
      grade: item.grade || "",
      remark: item.remark || "",
      status: "Active",
    }));

    const result = await dispatch(
      bulkCreateMarks({
        marks: updatedMarks,
      })
    );

    if (!result.error) {
      dispatch(getMarksByFilter(filters));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Marks Entry
          </h1>
          <p className="text-sm text-gray-500">
            Manage and submit student examination scores.
          </p>
        </div>

        {hasPermission("exam.create") && (
          <button
            type="button"
            onClick={handleSave}
            disabled={submitting || !marks || marks.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Save size={18} />
            )}
            {submitting ? "Saving Marks..." : "Save Marks"}
          </button>
        )}
      </div>

      {/* Filters Section */}
      <MarksFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* Marks Table Section */}
      <MarksTable
        loading={loading}
        marks={marks}
        onChange={(updatedMarks) => {
          dispatch(updateLocalMarks(updatedMarks));
        }}
      />
    </div>
  );
};

export default MarksEntryPage;