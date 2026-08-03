
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Search, RotateCcw } from "lucide-react";

import {
  getExamSubjects,
  createExamSubject,
  updateExamSubject,
  deleteExamSubject,
  changeExamSubjectStatus,
  fetchClasses,
  fetchSubjects,
  fetchExams,
  fetchAcademicYears,
} from "../../../redux/exam/examSubject/examSubjectThunk";

import ExamSubjectTable from "./ExamSubjectTable";
import ExamSubjectModal from "./ExamSubjectModal";
import usePermission from "../../../hooks/usePermission";

/*
|--------------------------------------------------------------------------
| Initial Filters
|--------------------------------------------------------------------------
*/
const initialFilters = {
  search: "",
  academicYear: "",
  className: "",
  examName: "",
  subjectName: "",
  status: "",
};

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/
const ExamSubjectPage = () => {
  const dispatch = useDispatch();

  const { hasPermission } = usePermission();

  /*
  |--------------------------------------------------------------------------
  | Redux State
  |--------------------------------------------------------------------------
  */
  const {
    examSubjects = [],
    classes = [],
    academicYears = [],
    exams = [],
    subjects = [],
    loading = false,
    submitting = false,
  } = useSelector((state) => state.examSubject || {});

  /*
  |--------------------------------------------------------------------------
  | Local State
  |--------------------------------------------------------------------------
  */
  const [openModal, setOpenModal] = useState(false);

  const [
    selectedExamSubject,
    setSelectedExamSubject,
  ] = useState(null);

  const [filters, setFilters] = useState(initialFilters);

  /*
  |--------------------------------------------------------------------------
  | Initial Data Fetching
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    dispatch(getExamSubjects());

    dispatch(fetchClasses());

    dispatch(fetchAcademicYears());

    dispatch(fetchExams());

    dispatch(fetchSubjects());
  }, [dispatch]);

  /*
  |--------------------------------------------------------------------------
  | Subjects According To Selected Filter Class
  |--------------------------------------------------------------------------
  */
  const filteredSubjects = useMemo(() => {
    /*
    |--------------------------------------------------------------------------
    | No Class Selected
    |--------------------------------------------------------------------------
    */
    if (!filters.className) {
      return [];
    }

    /*
    |--------------------------------------------------------------------------
    | Return Only Selected Class Subjects
    |--------------------------------------------------------------------------
    */
    return subjects.filter(
      (subject) =>
        Number(subject.class_id) ===
        Number(filters.className)
    );
  }, [
    subjects,
    filters.className,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Filter Change
  |--------------------------------------------------------------------------
  */
  const handleFilterChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    /*
    |--------------------------------------------------------------------------
    | When Class Changes:
    | Reset Subject Filter
    |--------------------------------------------------------------------------
    */
    if (name === "className") {
      setFilters((previous) => ({
        ...previous,

        className: value,

        /*
        | Clear old selected subject
        */
        subjectName: "",
      }));

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Normal Filter Change
    |--------------------------------------------------------------------------
    */
    setFilters((previous) => ({
      ...previous,

      [name]: value,
    }));
  };

  /*
  |--------------------------------------------------------------------------
  | Reset Filters
  |--------------------------------------------------------------------------
  */
  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  /*
  |--------------------------------------------------------------------------
  | Submit Add / Edit Form
  |--------------------------------------------------------------------------
  */
  const handleSubmit = async (data) => {
    const payload = {
      /*
      |--------------------------------------------------------------------------
      | Academic Year
      |--------------------------------------------------------------------------
      */
      academic_year_id: Number(
        data.academic_year_id
      ),

      /*
      |--------------------------------------------------------------------------
      | Exam
      |--------------------------------------------------------------------------
      */
      exam_id: Number(
        data.exam_id
      ),

      /*
      |--------------------------------------------------------------------------
      | Class
      |--------------------------------------------------------------------------
      */
      class_id: Number(
        data.class_id
      ),

      /*
      |--------------------------------------------------------------------------
      | Subject
      |--------------------------------------------------------------------------
      */
      subject_id: Number(
        data.subject_id
      ),

      /*
      |--------------------------------------------------------------------------
      | Marks
      |--------------------------------------------------------------------------
      */
      max_marks: Number(
        data.max_marks
      ),

      pass_marks: Number(
        data.pass_marks
      ),
    };

    /*
    |--------------------------------------------------------------------------
    | Update
    |--------------------------------------------------------------------------
    */
    if (selectedExamSubject) {
      await dispatch(
        updateExamSubject({
          id:
            selectedExamSubject
              .exam_subject_id,

          data: payload,
        })
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create
    |--------------------------------------------------------------------------
    */
    else {
      await dispatch(
        createExamSubject(
          payload
        )
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Close Modal
    |--------------------------------------------------------------------------
    */
    setOpenModal(false);

    setSelectedExamSubject(null);

    /*
    |--------------------------------------------------------------------------
    | Refresh Table
    |--------------------------------------------------------------------------
    */
    dispatch(
      getExamSubjects()
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Open Add Modal
  |--------------------------------------------------------------------------
  */
  const handleAdd = () => {
    setSelectedExamSubject(null);

    setOpenModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */
  const handleEdit = (item) => {
    setSelectedExamSubject(item);

    setOpenModal(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */
  const handleDelete = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this exam subject?"
      );

    if (!confirmed) {
      return;
    }

    await dispatch(
      deleteExamSubject(id)
    );

    dispatch(
      getExamSubjects()
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Change Status
  |--------------------------------------------------------------------------
  */
  const handleStatusChange =
    async (item) => {
      const currentStatus =
        item.status?.toLowerCase();

      const newStatus =
        currentStatus === "active"
          ? "inactive"
          : "active";

      await dispatch(
        changeExamSubjectStatus({
          id:
            item.exam_subject_id,

          status:
            newStatus,
        })
      );

      dispatch(
        getExamSubjects()
      );
    };

  /*
  |--------------------------------------------------------------------------
  | Table Filter Logic
  |--------------------------------------------------------------------------
  */
  const filteredData =
    examSubjects.filter(
      (item) => {
        const search =
          filters.search
            .toLowerCase()
            .trim();

        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */
        const matchSearch =
          !search ||

          item.exam_name
            ?.toLowerCase()
            .includes(search) ||

          item.subject_name
            ?.toLowerCase()
            .includes(search) ||

          item.class_name
            ?.toLowerCase()
            .includes(search);

        /*
        |--------------------------------------------------------------------------
        | Academic Year
        |--------------------------------------------------------------------------
        */
        const matchAcademicYear =
          !filters.academicYear ||

          Number(
            item.academic_year_id
          ) ===
          Number(
            filters.academicYear
          );

        /*
        |--------------------------------------------------------------------------
        | Class
        |--------------------------------------------------------------------------
        */
        const matchClass =
          !filters.className ||

          Number(
            item.class_id
          ) ===
          Number(
            filters.className
          );

        /*
        |--------------------------------------------------------------------------
        | Exam
        |--------------------------------------------------------------------------
        */
        const matchExam =
          !filters.examName ||

          Number(
            item.exam_id
          ) ===
          Number(
            filters.examName
          );

        /*
        |--------------------------------------------------------------------------
        | Subject
        |--------------------------------------------------------------------------
        */
        const matchSubject =
          !filters.subjectName ||

          Number(
            item.subject_id
          ) ===
          Number(
            filters.subjectName
          );

        /*
        |--------------------------------------------------------------------------
        | Status
        |--------------------------------------------------------------------------
        */
        const matchStatus =
          !filters.status ||

          item.status
            ?.toLowerCase() ===
          filters.status
            .toLowerCase();

        /*
        |--------------------------------------------------------------------------
        | Return Final Result
        |--------------------------------------------------------------------------
        */
        return (
          matchSearch &&

          matchAcademicYear &&

          matchClass &&

          matchExam &&

          matchSubject &&

          matchStatus
        );
      }
    );

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Exam Subjects
          </h1>

          <p className="text-sm text-gray-500">
            Manage subject allocations,
            passing criteria,
            and maximum marks.
          </p>
        </div>

        {/* Add Button */}
        {hasPermission(
          "exam.create"
        ) && (
          <button
            type="button"
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus size={18} />

            Add Subject
          </button>
        )}

      </div>

      {/* Filters */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">

          {/* Search */}
          <div className="relative">

            <Search
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
            />

            <input
              type="text"

              name="search"

              placeholder="Search..."

              value={
                filters.search
              }

              onChange={
                handleFilterChange
              }

              className="w-full rounded-lg border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

          </div>

          {/* Academic Year */}
          <select
            name="academicYear"

            value={
              filters.academicYear
            }

            onChange={
              handleFilterChange
            }

            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >

            <option value="">
              Academic Year
            </option>

            {academicYears.map(
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

          {/* Class */}
          <select
            name="className"

            value={
              filters.className
            }

            onChange={
              handleFilterChange
            }

            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >

            <option value="">
              Class
            </option>

            {classes.map(
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

          {/* Exam */}
          <select
            name="examName"

            value={
              filters.examName
            }

            onChange={
              handleFilterChange
            }

            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >

            <option value="">
              Exam
            </option>

            {exams.map(
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

          {/* Subject */}
          <select
            name="subjectName"

            value={
              filters.subjectName
            }

            onChange={
              handleFilterChange
            }

            /*
            |--------------------------------------------------------------------------
            | Disable Until Class Is Selected
            |--------------------------------------------------------------------------
            */
            disabled={
              !filters.className
            }

            className="
              rounded-lg
              border
              border-gray-300
              px-3
              py-1.5
              text-sm
              focus:border-blue-500
              focus:outline-none
              focus:ring-1
              focus:ring-blue-500
              disabled:cursor-not-allowed
              disabled:bg-gray-100
              disabled:text-gray-500
            "
          >

            <option value="">

              {filters.className
                ? "Subject"
                : "First Select Class"}

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

          {/* Status */}
          <select
            name="status"

            value={
              filters.status
            }

            onChange={
              handleFilterChange
            }

            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >

            <option value="">
              Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>

          </select>

        </div>

        {/* Clear Filters */}
        {Object
          .values(filters)
          .some(Boolean) && (

          <div className="flex justify-end pt-1">

            <button
              type="button"

              onClick={
                handleResetFilters
              }

              className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-red-600"
            >

              <RotateCcw
                size={12}
              />

              Clear Filters

            </button>

          </div>
        )}

      </div>

      {/* Table */}
      <ExamSubjectTable
        loading={
          loading
        }

        examSubjects={
          filteredData
        }

        onEdit={
          handleEdit
        }

        onDelete={
          handleDelete
        }

        onStatusChange={
          handleStatusChange
        }
      />

      {/* Add / Edit Modal */}
      <ExamSubjectModal
        open={
          openModal
        }

        onClose={() => {
          setOpenModal(
            false
          );

          setSelectedExamSubject(
            null
          );
        }}

        selectedExamSubject={
          selectedExamSubject
        }

        onSubmit={
          handleSubmit
        }

        submitting={
          submitting
        }
      />

    </div>
  );
};

export default ExamSubjectPage;
