import { useEffect, useMemo } from "react";
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

  /*
  |--------------------------------------------------------------------------
  | Filter Sections By Selected Class
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
  }, [
    sections,
    filters.class_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter Subjects By Selected Class
  |--------------------------------------------------------------------------
  |
  | Agar subject table/API me class_id aa raha hai,
  | to sirf selected class ke subjects dikhenge.
  |
  | Agar class_id nahi aa raha, to saare subjects dikhenge.
  */
  const filteredSubjects = useMemo(() => {
    if (!filters.class_id) {
      return [];
    }

    const hasClassId = subjects.some(
      (subject) =>
        subject.class_id !== undefined &&
        subject.class_id !== null
    );

    if (!hasClassId) {
      return subjects;
    }

    return subjects.filter(
      (subject) =>
        String(subject.class_id) ===
        String(filters.class_id)
    );
  }, [
    subjects,
    filters.class_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter Exams By Academic Year
  |--------------------------------------------------------------------------
  |
  | Agar exam API me academic_year_id aa raha hai,
  | to selected academic year ke exams dikhenge.
  */
  const filteredExams = useMemo(() => {
    if (!filters.academic_year_id) {
      return [];
    }

    const hasAcademicYearId = exams.some(
      (exam) =>
        exam.academic_year_id !== undefined &&
        exam.academic_year_id !== null
    );

    if (!hasAcademicYearId) {
      return exams;
    }

    return exams.filter(
      (exam) =>
        String(exam.academic_year_id) ===
        String(filters.academic_year_id)
    );
  }, [
    exams,
    filters.academic_year_id,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Handle Dropdown Change
  |--------------------------------------------------------------------------
  */
  const handleSelectChange = (
    field,
    value
  ) => {
    const parsedValue =
      value === ""
        ? ""
        : Number(value);

    /*
    |--------------------------------------------------------------------------
    | Class Change
    |--------------------------------------------------------------------------
    |
    | Parent me class change hone par:
    | section_id = ""
    | subject_id = ""
    |
    | Ye MarksEntryPage ke handleFilterChange
    | me already handle ho raha hai.
    */
    onChange(
      field,
      parsedValue
    );
  };

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        rounded-xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-6
        items-center
      "
    >

      {/* ============================================================ */}
      {/* ACADEMIC YEAR */}
      {/* ============================================================ */}

      <select
        value={
          filters.academic_year_id ?? ""
        }
        onChange={(e) =>
          handleSelectChange(
            "academic_year_id",
            e.target.value
          )
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          py-2
          text-sm
          focus:border-blue-500
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500
        "
      >
        <option value="">
          Academic Year
        </option>

        {Array.isArray(
          academicYears
        ) &&
          academicYears.map(
            (item) => (
              <option
                key={
                  item.academic_year_id
                }
                value={
                  item.academic_year_id
                }
              >
                {item.year_start}
                {" - "}
                {item.year_end}
              </option>
            )
          )}
      </select>

      {/* ============================================================ */}
      {/* CLASS */}
      {/* ============================================================ */}

      <select
        value={
          filters.class_id ?? ""
        }
        onChange={(e) =>
          handleSelectChange(
            "class_id",
            e.target.value
          )
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          py-2
          text-sm
          focus:border-blue-500
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500
        "
      >
        <option value="">
          Class
        </option>

        {Array.isArray(
          classes
        ) &&
          classes.map(
            (item) => (
              <option
                key={
                  item.class_id
                }
                value={
                  item.class_id
                }
              >
                {item.class_name}
              </option>
            )
          )}
      </select>

      {/* ============================================================ */}
      {/* SECTION */}
      {/* ============================================================ */}

      <select
        value={
          filters.section_id ?? ""
        }
        disabled={
          !filters.class_id
        }
        onChange={(e) =>
          handleSelectChange(
            "section_id",
            e.target.value
          )
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          py-2
          text-sm
          focus:border-blue-500
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-400
        "
      >
        <option value="">
          {!filters.class_id
            ? "Select Class First"
            : "Section"}
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
              {section.section_name}
            </option>
          )
        )}
      </select>

      {/* ============================================================ */}
      {/* EXAM */}
      {/* ============================================================ */}

      <select
        value={
          filters.exam_id ?? ""
        }
        disabled={
          !filters.academic_year_id
        }
        onChange={(e) =>
          handleSelectChange(
            "exam_id",
            e.target.value
          )
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          py-2
          text-sm
          focus:border-blue-500
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-400
        "
      >
        <option value="">
          {!filters.academic_year_id
            ? "Select Year First"
            : "Exam"}
        </option>

        {filteredExams.map(
          (item) => (
            <option
              key={
                item.exam_id
              }
              value={
                item.exam_id
              }
            >
              {item.exam_name}
            </option>
          )
        )}
      </select>

      {/* ============================================================ */}
      {/* SUBJECT */}
      {/* ============================================================ */}

      <select
        value={
          filters.subject_id ?? ""
        }
        disabled={
          !filters.class_id
        }
        onChange={(e) =>
          handleSelectChange(
            "subject_id",
            e.target.value
          )
        }
        className="
          w-full
          rounded-lg
          border
          border-gray-300
          bg-white
          px-3
          py-2
          text-sm
          focus:border-blue-500
          focus:outline-none
          focus:ring-1
          focus:ring-blue-500
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-gray-400
        "
      >
        <option value="">
          {!filters.class_id
            ? "Select Class First"
            : "Subject"}
        </option>

        {filteredSubjects.map(
          (item) => (
            <option
              key={
                item.subject_id
              }
              value={
                item.subject_id
              }
            >
              {item.subject_name}
            </option>
          )
        )}
      </select>

      {/* ============================================================ */}
      {/* LOAD STUDENTS */}
      {/* ============================================================ */}

      <button
        type="button"
        onClick={onSearch}
        className="
          w-full
          rounded-lg
          bg-blue-600
          px-4
          py-2
          text-sm
          font-semibold
          text-white
          transition-colors
          hover:bg-blue-700
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:ring-offset-2
        "
      >
        Load Students
      </button>

    </div>
  );
};

export default MarksFilter;