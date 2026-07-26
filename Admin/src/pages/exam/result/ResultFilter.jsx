import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search } from "lucide-react";

import {
  fetchAcademicYears,
  fetchClasses,
  fetchSections,
  fetchExams,
} from "../../../redux/exam/examMark/markThunk";

const ResultFilter = ({
  filters,
  onChange,
  onSearch,
}) => {
  const dispatch = useDispatch();

  const {
    academicYears = [],
    classes = [],
    sections = [],
    exams = [],
  } = useSelector((state) => state.mark);

  /*
  |--------------------------------------------------------------------------
  | Load Dropdown Data on Mount
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
    dispatch(fetchExams());
  }, [dispatch]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      
      {/* Academic Year */}
      <select
        value={filters.academic_year_id}
        onChange={(e) => onChange("academic_year_id", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Academic Year</option>
        {academicYears.map((item) => (
          <option key={item.academic_year_id} value={item.academic_year_id}>
            {item.year_start} - {item.year_end}
          </option>
        ))}
      </select>

      {/* Class */}
      <select
        value={filters.class_id}
        onChange={(e) => onChange("class_id", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Class</option>
        {classes.map((item) => (
          <option key={item.class_id} value={item.class_id}>
            {item.class_name}
          </option>
        ))}
      </select>

      {/* Section */}
      <select
        value={filters.section_id}
        onChange={(e) => onChange("section_id", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Section</option>
        {sections.map((section) => (
          <option key={section.section_id} value={section.section_id}>
            {section.class_name} - {section.section_name}
          </option>
        ))}
      </select>

      {/* Exam */}
      <select
        value={filters.exam_id}
        onChange={(e) => onChange("exam_id", e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Exam</option>
        {exams.map((item) => (
          <option key={item.exam_id} value={item.exam_id}>
            {item.exam_name}
          </option>
        ))}
      </select>

      {/* Search Button */}
      <button
        type="button"
        onClick={onSearch}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
      >
        <Search size={16} />
        Load Result
      </button>

    </div>
  );
};

export default ResultFilter;