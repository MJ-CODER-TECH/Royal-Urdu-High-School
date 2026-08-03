import { useEffect, useMemo } from "react";
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
    dispatch(fetchExams());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Show Sections Only For Selected Class
  |--------------------------------------------------------------------------
  */
  const filteredSections = useMemo(() => {
    if (!filters.class_id) {
      return [];
    }

    return sections.filter(
      (section) =>
        String(section.class_id) ===
        String(filters.class_id)
    );
  }, [sections, filters.class_id]);

  /*
  |--------------------------------------------------------------------------
  | Handle Class Change
  |--------------------------------------------------------------------------
  */
  const handleClassChange = (value) => {
    const classId =
      value === ""
        ? ""
        : Number(value);

    // Class set
    onChange(
      "class_id",
      classId
    );

    // Old section reset
    onChange(
      "section_id",
      ""
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Handle Other Dropdowns
  |--------------------------------------------------------------------------
  */
  const handleChange = (
    field,
    value
  ) => {
    onChange(
      field,
      value === ""
        ? ""
        : Number(value)
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">

      {/* Academic Year */}
      <select
        value={
          filters.academic_year_id ?? ""
        }
        onChange={(e) =>
          handleChange(
            "academic_year_id",
            e.target.value
          )
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          Select Academic Year
        </option>

        {academicYears.map((item) => (
          <option
            key={item.academic_year_id}
            value={item.academic_year_id}
          >
            {item.year_start} - {item.year_end}
          </option>
        ))}
      </select>

      {/* Class */}
      <select
        value={
          filters.class_id ?? ""
        }
        onChange={(e) =>
          handleClassChange(
            e.target.value
          )
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          Select Class
        </option>

        {classes.map((item) => (
          <option
            key={item.class_id}
            value={item.class_id}
          >
            {item.class_name}
          </option>
        ))}
      </select>

      {/* Section */}
      <select
        value={
          filters.section_id ?? ""
        }
        onChange={(e) =>
          handleChange(
            "section_id",
            e.target.value
          )
        }
        disabled={
          !filters.class_id
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
      >
        <option value="">
          {filters.class_id
            ? "Select Section"
            : "Select Class First"}
        </option>

        {filteredSections.map(
          (section) => (
            <option
              key={
                section.section_id
              }
              value={
                section.section_id
              }
            >
              {
                section.section_name
              }
            </option>
          )
        )}
      </select>

      {/* Exam */}
      <select
        value={
          filters.exam_id ?? ""
        }
        onChange={(e) =>
          handleChange(
            "exam_id",
            e.target.value
          )
        }
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">
          Select Exam
        </option>

        {exams.map((item) => (
          <option
            key={item.exam_id}
            value={item.exam_id}
          >
            {item.exam_name}
          </option>
        ))}
      </select>

      {/* Search */}
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