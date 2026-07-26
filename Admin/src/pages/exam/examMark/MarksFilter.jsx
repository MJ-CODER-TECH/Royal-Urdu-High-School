import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAcademicYears,
  fetchClasses,
  fetchSections,
  fetchSubjects,
  fetchExams,
} from "../../../redux/exam/examMark/markThunk";

const MarksFilter = ({
  filters,
  onChange,
  onSearch,
}) => {
  const dispatch = useDispatch();

  const {
    academicYears = [],
    classes = [],
    sections = [],
    subjects = [],
    exams = [],
  } = useSelector((state) => state.mark || {});

  /*
  |--------------------------------------------------------------------------
  | Load Dropdown Data
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
    dispatch(fetchSubjects());
    dispatch(fetchExams());
  }, [dispatch]);

  const handleSelectChange = (field, value) => {
    const parsedValue = value === "" ? "" : Number(value);
    onChange(field, parsedValue);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 items-center rounded-xl bg-white p-4 shadow-sm border border-gray-200">
      {/* Academic Year */}
      <select
        value={filters.academic_year_id ?? ""}
        onChange={(e) => handleSelectChange("academic_year_id", e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="">Academic Year</option>
        {Array.isArray(academicYears) &&
          academicYears.map((item) => (
            <option key={item.academic_year_id} value={item.academic_year_id}>
              {item.year_start} - {item.year_end}
            </option>
          ))}
      </select>

      {/* Class */}
      <select
        value={filters.class_id ?? ""}
        onChange={(e) => handleSelectChange("class_id", e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="">Class</option>
        {Array.isArray(classes) &&
          classes.map((item) => (
            <option key={item.class_id} value={item.class_id}>
              {item.class_name}
            </option>
          ))}
      </select>

      {/* Section */}
      <select
        value={filters.section_id ?? ""}
        onChange={(e) => handleSelectChange("section_id", e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="">Section</option>
        {Array.isArray(sections) &&
          sections.map((section) => (
            <option key={section.section_id} value={section.section_id}>
              {section.class_name} - {section.section_name}
            </option>
          ))}
      </select>

      {/* Exam */}
      <select
        value={filters.exam_id ?? ""}
        onChange={(e) => handleSelectChange("exam_id", e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="">Exam</option>
        {Array.isArray(exams) &&
          exams.map((item) => (
            <option key={item.exam_id} value={item.exam_id}>
              {item.exam_name}
            </option>
          ))}
      </select>

      {/* Subject */}
      <select
        value={filters.subject_id ?? ""}
        onChange={(e) => handleSelectChange("subject_id", e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
      >
        <option value="">Subject</option>
        {Array.isArray(subjects) &&
          subjects.map((item) => (
            <option key={item.subject_id} value={item.subject_id}>
              {item.subject_name}
            </option>
          ))}
      </select>

      {/* Load Students Button */}
      <button
        type="button"
        onClick={onSearch}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Load Students
      </button>
    </div>
  );
};

export default MarksFilter;