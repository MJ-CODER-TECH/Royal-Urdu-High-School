import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";

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
    marks = [],
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
  | Handle Dropdown Change
  |--------------------------------------------------------------------------
  */
  const handleFilterChange = (name, value) => {
    setFilters((prev) => {
      const updatedFilters = {
        ...prev,
        [name]: value,
      };

      /*
      |--------------------------------------------------------------------------
      | Class Change
      |--------------------------------------------------------------------------
      | Class change hone par section reset hoga.
      | Subject bhi reset hoga kyunki subject class-wise hai.
      */
      if (name === "class_id") {
        updatedFilters.section_id = "";
        updatedFilters.subject_id = "";
      }

      /*
      |--------------------------------------------------------------------------
      | Academic Year Change
      |--------------------------------------------------------------------------
      | Academic year change hone par exam reset hoga.
      */
      if (name === "academic_year_id") {
        updatedFilters.exam_id = "";
      }

      return updatedFilters;
    });

    /*
    |--------------------------------------------------------------------------
    | Purane Students / Marks Clear
    |--------------------------------------------------------------------------
    */
    dispatch(updateLocalMarks([]));
  };

  /*
  |--------------------------------------------------------------------------
  | Load Students
  |--------------------------------------------------------------------------
  */
  const handleSearch = async () => {
    if (!filters.academic_year_id) {
      toast.error("Please select Academic Year");
      return;
    }

    if (!filters.class_id) {
      toast.error("Please select Class");
      return;
    }

    if (!filters.section_id) {
      toast.error("Please select Section");
      return;
    }

    if (!filters.exam_id) {
      toast.error("Please select Exam");
      return;
    }

    if (!filters.subject_id) {
      toast.error("Please select Subject");
      return;
    }

    const result = await dispatch(
      getStudentsForMarks({
        academic_year_id: Number(filters.academic_year_id),
        class_id: Number(filters.class_id),
        section_id: Number(filters.section_id),
        exam_id: Number(filters.exam_id),
        subject_id: Number(filters.subject_id),
      })
    );

    if (result.error) {
      toast.error(
        result.payload ||
          "Failed to load students"
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Save Marks
  |--------------------------------------------------------------------------
  */
  const handleSave = async () => {
    if (!filters.academic_year_id) {
      toast.error("Please select Academic Year");
      return;
    }

    if (!filters.class_id) {
      toast.error("Please select Class");
      return;
    }

    if (!filters.section_id) {
      toast.error("Please select Section");
      return;
    }

    if (!filters.exam_id) {
      toast.error("Please select Exam");
      return;
    }

    if (!filters.subject_id) {
      toast.error("Please select Subject");
      return;
    }

    if (!marks || marks.length === 0) {
      toast.error("Please load students first");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Marks
    |--------------------------------------------------------------------------
    */
    const invalidMark = marks.find((item) => {
      const maxMarks = Number(item.max_marks || 100);

      const obtainedMarks =
        item.obtained_marks === ""
          ? 0
          : Number(item.obtained_marks || 0);

      return (
        Number.isNaN(obtainedMarks) ||
        obtainedMarks < 0 ||
        obtainedMarks > maxMarks
      );
    });

    if (invalidMark) {
      toast.error(
        `Invalid marks for ${invalidMark.student_name || "student"}`
      );
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Prepare Marks Data
    |--------------------------------------------------------------------------
    */
    const updatedMarks = marks.map((item) => ({
      student_id: Number(item.student_id),

      academic_year_id: Number(
        filters.academic_year_id
      ),

      class_id: Number(
        filters.class_id
      ),

      section_id: Number(
        filters.section_id
      ),

      exam_id: Number(
        filters.exam_id
      ),

      subject_id: Number(
        filters.subject_id
      ),

      max_marks: Number(
        item.max_marks || 100
      ),

      obtained_marks:
        item.obtained_marks === ""
          ? 0
          : Number(
              item.obtained_marks || 0
            ),

      grade: item.grade || "",

      remark: item.remark || "",

      status: "Active",
    }));

    try {
      const result = await dispatch(
        bulkCreateMarks({
          marks: updatedMarks,
        })
      ).unwrap();

      toast.success(
        result?.message ||
          "Marks saved successfully"
      );

      /*
      |--------------------------------------------------------------------------
      | Reload Updated Marks
      |--------------------------------------------------------------------------
      */
      dispatch(
        getMarksByFilter({
          academic_year_id: Number(
            filters.academic_year_id
          ),

          class_id: Number(
            filters.class_id
          ),

          section_id: Number(
            filters.section_id
          ),

          exam_id: Number(
            filters.exam_id
          ),

          subject_id: Number(
            filters.subject_id
          ),
        })
      );
    } catch (error) {
      toast.error(
        error ||
          "Failed to save marks"
      );
    }
  };

  return (
    <div className="space-y-6">

      {/* ================================================================ */}
      {/* HEADER */}
      {/* ================================================================ */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Marks Entry
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and submit student examination scores.
          </p>
        </div>

        {hasPermission("exam.create") && (
          <button
            type="button"
            onClick={handleSave}
            disabled={
              submitting ||
              loading ||
              !marks ||
              marks.length === 0
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-blue-600
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-colors
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {submitting ? (
              <Loader2
                size={18}
                className="animate-spin"
              />
            ) : (
              <Save size={18} />
            )}

            {submitting
              ? "Saving Marks..."
              : "Save Marks"}
          </button>
        )}

      </div>

      {/* ================================================================ */}
      {/* FILTER */}
      {/* ================================================================ */}

      <MarksFilter
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
      />

      {/* ================================================================ */}
      {/* MARKS TABLE */}
      {/* ================================================================ */}

      <MarksTable
        loading={loading}
        marks={marks}
        onChange={(updatedMarks) => {
          dispatch(
            updateLocalMarks(
              updatedMarks
            )
          );
        }}
      />

    </div>
  );
};

export default MarksEntryPage;