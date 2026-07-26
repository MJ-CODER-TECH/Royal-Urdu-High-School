import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchClasses,
  fetchSections,
  fetchSubjects,
  fetchTeachers,
} from "../../redux/timetable/timetableThunk";
import { fetchAcademicYears } from "../../redux/master/academicYearThunk";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TimetableModal = ({
  open,
  onClose,
  onSubmit,
  selectedTimetable = null,
  submitting = false,
}) => {
  const dispatch = useDispatch();

  // Safe selectors with default empty arrays
  const { academicYears = [] } = useSelector(
    (state) => state.academicYear || {}
  );

  const {
    classes = [],
    sections = [],
    subjects = [],
    teachers = [],
  } = useSelector((state) => state.timetable || {});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      academic_year_id: "",
      class_id: "",
      section_id: "",
      subject_id: "",
      teacher_id: "",
      day_of_week: "",
      period_no: "",
      start_time: "",
      end_time: "",
      room: "",
      status: "Active",
    },
  });

  // Fetch dropdown data on modal open
  useEffect(() => {
    if (!open) return;

    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
  }, [dispatch, open]);

  // Populate or reset form fields based on edit vs. add mode
  useEffect(() => {
    if (selectedTimetable) {
      reset({
        academic_year_id: selectedTimetable.academic_year_id || "",
        class_id: selectedTimetable.class_id || "",
        section_id: selectedTimetable.section_id || "",
        subject_id: selectedTimetable.subject_id || "",
        teacher_id: selectedTimetable.teacher_id || "",
        day_of_week: selectedTimetable.day_of_week || "",
        period_no: selectedTimetable.period_no || "",
        start_time: selectedTimetable.start_time || "",
        end_time: selectedTimetable.end_time || "",
        room: selectedTimetable.room || "",
        status: selectedTimetable.status || "Active",
      });
    } else {
      reset({
        academic_year_id: "",
        class_id: "",
        section_id: "",
        subject_id: "",
        teacher_id: "",
        day_of_week: "",
        period_no: "",
        start_time: "",
        end_time: "",
        room: "",
        status: "Active",
      });
    }
  }, [selectedTimetable, reset, open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
      <div className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl transition-all">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">
            {selectedTimetable ? "Edit Timetable Period" : "Add Timetable Period"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Academic Year */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Academic Year <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("academic_year_id", {
                  required: "Academic year is required",
                })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Academic Year</option>
                {academicYears.map((item) => (
                  <option
                    key={item.academic_year_id}
                    value={item.academic_year_id}
                  >
                    {item.year_start} - {item.year_end}
                  </option>
                ))}
              </select>
              {errors.academic_year_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.academic_year_id.message}
                </p>
              )}
            </div>

            {/* Class */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Class <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("class_id", { required: "Class is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Class</option>
                {classes.map((item, idx) => (
                  <option
                    key={item.class_id || idx}
                    value={item.class_id}
                  >
                    {item.class_name}
                  </option>
                ))}
              </select>
              {errors.class_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.class_id.message}
                </p>
              )}
            </div>

            {/* Section */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Section <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("section_id", { required: "Section is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Section</option>
                {sections.map((item, idx) => (
                  <option
                    key={item.section_id || idx}
                    value={item.section_id}
                  >
                    {item.class_name ? `${item.class_name} - ` : ""}
                    {item.section_name}
                  </option>
                ))}
              </select>
              {errors.section_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.section_id.message}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Subject <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("subject_id", { required: "Subject is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Subject</option>
                {subjects.map((item, idx) => (
                  <option
                    key={item.subject_id || idx}
                    value={item.subject_id}
                  >
                    {item.subject_name}
                  </option>
                ))}
              </select>
              {errors.subject_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.subject_id.message}
                </p>
              )}
            </div>

            {/* Teacher */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Teacher <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("teacher_id", { required: "Teacher is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Teacher</option>
                {teachers.map((item, idx) => (
                  <option
                    key={item.user_id || item.teacher_id || idx}
                    value={item.user_id || item.teacher_id}
                  >
                    {item.name || item.teacher_name || item.full_name}
                  </option>
                ))}
              </select>
              {errors.teacher_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.teacher_id.message}
                </p>
              )}
            </div>

            {/* Day of Week */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Day <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("day_of_week", { required: "Day is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Day</option>
                {DAYS.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.day_of_week && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.day_of_week.message}
                </p>
              )}
            </div>

            {/* Period No */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Period No. <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 1, 2, 3"
                {...register("period_no", { required: "Period number is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.period_no && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.period_no.message}
                </p>
              )}
            </div>

            {/* Room */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Room No. / Name
              </label>
              <input
                type="text"
                placeholder="e.g. Room 102"
                {...register("room")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Start Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                {...register("start_time", { required: "Start time is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.start_time && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.start_time.message}
                </p>
              )}
            </div>

            {/* End Time */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                End Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="time"
                {...register("end_time", { required: "End time is required" })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              {errors.end_time && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {errors.end_time.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting
                ? "Saving..."
                : selectedTimetable
                ? "Update Entry"
                : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TimetableModal;