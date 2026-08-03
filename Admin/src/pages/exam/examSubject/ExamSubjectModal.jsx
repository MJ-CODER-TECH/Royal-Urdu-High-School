
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  fetchAcademicYears,
  fetchClasses,
  fetchExams,
  fetchSubjects,
} from "../../../redux/exam/examSubject/examSubjectThunk";

/*
|--------------------------------------------------------------------------
| Validation Schema
|--------------------------------------------------------------------------
*/
const schema = z.object({
  academic_year_id: z.string().min(1, "Academic Year is required"),

  class_id: z.string().min(1, "Class is required"),

  exam_id: z.string().min(1, "Exam is required"),

  subject_id: z.string().min(1, "Subject is required"),

  max_marks: z.coerce
    .number({
      invalid_type_error: "Must be a number",
    })
    .min(1, "Max Marks must be at least 1"),

  pass_marks: z.coerce
    .number({
      invalid_type_error: "Must be a number",
    })
    .min(0, "Pass Marks cannot be negative"),
});

/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/
const ExamSubjectModal = ({
  open,
  onClose,
  onSubmit,
  selectedExamSubject,
  submitting,
}) => {
  const dispatch = useDispatch();

  /*
  |--------------------------------------------------------------------------
  | Redux Data
  |--------------------------------------------------------------------------
  */
  const {
    academicYears = [],
    classes = [],
    exams = [],
    subjects = [],
  } = useSelector((state) => state.examSubject || {});

  /*
  |--------------------------------------------------------------------------
  | React Hook Form
  |--------------------------------------------------------------------------
  */
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),

    defaultValues: {
      academic_year_id: "",
      class_id: "",
      exam_id: "",
      subject_id: "",
      max_marks: 100,
      pass_marks: 35,
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Watch Selected Class
  |--------------------------------------------------------------------------
  */
  const selectedClassId = watch("class_id");

  /*
  |--------------------------------------------------------------------------
  | Filter Subjects According To Selected Class
  |--------------------------------------------------------------------------
  */
  const filteredSubjects = Array.isArray(subjects)
    ? subjects.filter(
        (subject) =>
          Number(subject.class_id) === Number(selectedClassId)
      )
    : [];

  /*
  |--------------------------------------------------------------------------
  | Load Dropdown Data When Modal Opens
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (!open) return;

    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchExams());
    dispatch(fetchSubjects());
  }, [dispatch, open]);

  /*
  |--------------------------------------------------------------------------
  | Edit Mode / Add Mode Form Data
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    if (selectedExamSubject) {
      reset({
        academic_year_id: String(
          selectedExamSubject.academic_year_id || ""
        ),

        class_id: String(
          selectedExamSubject.class_id || ""
        ),

        exam_id: String(
          selectedExamSubject.exam_id || ""
        ),

        subject_id: String(
          selectedExamSubject.subject_id || ""
        ),

        max_marks:
          selectedExamSubject.max_marks ?? 100,

        pass_marks:
          selectedExamSubject.pass_marks ?? 35,
      });
    } else {
      reset({
        academic_year_id: "",
        class_id: "",
        exam_id: "",
        subject_id: "",
        max_marks: 100,
        pass_marks: 35,
      });
    }
  }, [selectedExamSubject, reset]);

  /*
  |--------------------------------------------------------------------------
  | Close Modal
  |--------------------------------------------------------------------------
  */
  if (!open) return null;

  /*
  |--------------------------------------------------------------------------
  | JSX
  |--------------------------------------------------------------------------
  */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">

        {/* Modal Heading */}
        <h2 className="mb-6 border-b pb-3 text-xl font-bold text-gray-900">
          {selectedExamSubject
            ? "Edit Exam Subject"
            : "Add Exam Subject"}
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >

          {/* Academic Year */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Academic Year
              <span className="text-red-500"> *</span>
            </label>

            <select
              {...register("academic_year_id")}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                Select Academic Year
              </option>

              {Array.isArray(academicYears) &&
                academicYears.map((item) => (
                  <option
                    key={item.academic_year_id}
                    value={item.academic_year_id}
                  >
                    {item.year_start} - {item.year_end}
                  </option>
                ))}
            </select>

            <p className="mt-1 text-xs text-red-500">
              {errors.academic_year_id?.message}
            </p>
          </div>

          {/* Class */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Class
              <span className="text-red-500"> *</span>
            </label>

            <select
              {...register("class_id", {
                onChange: () => {
                  /*
                  |----------------------------------------------------------
                  | Clear Previous Subject When Class Changes
                  |----------------------------------------------------------
                  */
                  setValue(
                    "subject_id",
                    ""
                  );
                },
              })}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                Select Class
              </option>

              {Array.isArray(classes) &&
                classes.map((item) => (
                  <option
                    key={item.class_id}
                    value={item.class_id}
                  >
                    {item.class_name}
                  </option>
                ))}
            </select>

            <p className="mt-1 text-xs text-red-500">
              {errors.class_id?.message}
            </p>
          </div>

          {/* Exam */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Exam
              <span className="text-red-500"> *</span>
            </label>

            <select
              {...register("exam_id")}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">
                Select Exam
              </option>

              {Array.isArray(exams) &&
                exams.map((item) => (
                  <option
                    key={item.exam_id}
                    value={item.exam_id}
                  >
                    {item.exam_name}
                  </option>
                ))}
            </select>

            <p className="mt-1 text-xs text-red-500">
              {errors.exam_id?.message}
            </p>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subject
              <span className="text-red-500"> *</span>
            </label>

            <select
              {...register("subject_id")}
              disabled={!selectedClassId}
              className="
                w-full
                rounded-lg
                border
                border-gray-300
                p-2.5
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
                {selectedClassId
                  ? "Select Subject"
                  : "First Select Class"}
              </option>

              {filteredSubjects.map((item) => (
                <option
                  key={item.subject_id}
                  value={item.subject_id}
                >
                  {item.subject_name}
                </option>
              ))}
            </select>

            {/* No Subject Message */}
            {selectedClassId &&
              filteredSubjects.length === 0 && (
                <p className="mt-1 text-xs text-amber-600">
                  No subjects found for this class.
                </p>
              )}

            {/* Validation Error */}
            <p className="mt-1 text-xs text-red-500">
              {errors.subject_id?.message}
            </p>
          </div>

          {/* Max Marks */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Max Marks
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="number"
              min="1"
              {...register("max_marks")}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-1 text-xs text-red-500">
              {errors.max_marks?.message}
            </p>
          </div>

          {/* Pass Marks */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Pass Marks
              <span className="text-red-500"> *</span>
            </label>

            <input
              type="number"
              min="0"
              {...register("pass_marks")}
              className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />

            <p className="mt-1 text-xs text-red-500">
              {errors.pass_marks?.message}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="col-span-1 mt-6 flex items-center justify-end gap-3 border-t pt-4 sm:col-span-2">

            {/* Cancel */}
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="
                rounded-lg
                border
                border-gray-300
                px-5
                py-2
                text-sm
                font-medium
                text-gray-700
                transition-colors
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Cancel
            </button>

            {/* Save / Update */}
            <button
              type="submit"
              disabled={submitting}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-blue-600
                px-5
                py-2
                text-sm
                font-medium
                text-white
                transition-colors
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {submitting && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {submitting
                ? "Saving..."
                : selectedExamSubject
                ? "Update"
                : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ExamSubjectModal;
