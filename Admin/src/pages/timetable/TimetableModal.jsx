import React, {
  useEffect,
  useMemo,
} from "react";

import {
  useForm,
  useWatch,
} from "react-hook-form";

import {
  X,
  Loader2,
} from "lucide-react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchClasses,
  fetchSections,
  fetchSubjects,
  fetchTeachers,
} from "../../redux/timetable/timetableThunk";

import {
  fetchAcademicYears,
} from "../../redux/master/academicYearThunk";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const EMPTY_FORM = {
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
};

const TimetableModal = ({
  open,
  onClose,
  onSubmit,
  selectedTimetable = null,
  submitting = false,
}) => {
  const dispatch = useDispatch();

  const {
    academicYears = [],
  } = useSelector(
    (state) => state.academicYear || {}
  );

  const {
    classes = [],
    sections = [],
    subjects = [],
    teachers = [],
  } = useSelector(
    (state) => state.timetable || {}
  );

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: {
      errors,
    },
  } = useForm({
    defaultValues: EMPTY_FORM,
  });

const selectedClassId = useWatch({
  control,
  name: "class_id",
});


const filteredSections = useMemo(() => {
  if (!selectedClassId) {
    return [];
  }

  return sections.filter(
    (section) =>
      String(section.class_id) ===
      String(selectedClassId)
  );
}, [
  sections,
  selectedClassId,
]);


const filteredSubjects = useMemo(() => {
  if (!selectedClassId) {
    return [];
  }

  return subjects.filter(
    (subject) =>
      String(subject.class_id) ===
      String(selectedClassId)
  );
}, [
  subjects,
  selectedClassId,
]);

  useEffect(() => {
    if (!open) {
      return;
    }

    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());
    dispatch(fetchSubjects());
    dispatch(fetchTeachers());
  }, [
    dispatch,
    open,
  ]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (selectedTimetable) {
      reset({
        academic_year_id: String(
          selectedTimetable.academic_year_id || ""
        ),

        class_id: String(
          selectedTimetable.class_id || ""
        ),

        section_id: String(
          selectedTimetable.section_id || ""
        ),

        subject_id: String(
          selectedTimetable.subject_id || ""
        ),

        teacher_id: String(
          selectedTimetable.teacher_id || ""
        ),

        day_of_week:
          selectedTimetable.day_of_week || "",

        period_no: String(
          selectedTimetable.period_no || ""
        ),

        start_time:
          selectedTimetable.start_time
            ? String(
                selectedTimetable.start_time
              ).slice(0, 5)
            : "",

        end_time:
          selectedTimetable.end_time
            ? String(
                selectedTimetable.end_time
              ).slice(0, 5)
            : "",

        room:
          selectedTimetable.room || "",

        status:
          selectedTimetable.status ||
          "Active",
      });
    } else {
      reset(EMPTY_FORM);
    }
  }, [
    open,
    selectedTimetable,
    reset,
  ]);

 const handleClassChange = (
  event
) => {
  const newClassId =
    event.target.value;

  setValue(
    "class_id",
    newClassId,
    {
      shouldValidate: true,
    }
  );

  setValue(
    "section_id",
    "",
    {
      shouldValidate: true,
    }
  );

  setValue(
    "subject_id",
    "",
    {
      shouldValidate: true,
    }
  );
};

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
      onMouseDown={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-2xl"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {selectedTimetable
                ? "Edit Timetable Period"
                : "Add Timetable Period"}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Select class first, then only
              related sections will appear.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
          className="space-y-4 p-6"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Academic Year
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <select
                {...register(
                  "academic_year_id",
                  {
                    required:
                      "Academic year is required",
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">
                  Select Academic Year
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

              {errors.academic_year_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .academic_year_id
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Class
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <select
                {...register(
                  "class_id",
                  {
                    required:
                      "Class is required",
                    onChange:
                      handleClassChange,
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">
                  Select Class
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
                      {
                        item.class_name
                      }
                    </option>
                  )
                )}
              </select>

              {errors.class_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .class_id
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Section
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <select
                {...register(
                  "section_id",
                  {
                    required:
                      "Section is required",
                  }
                )}
                disabled={
                  !selectedClassId
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {selectedClassId
                    ? "Select Section"
                    : "Select Class First"}
                </option>

                {filteredSections.map(
                  (item) => (
                    <option
                      key={
                        item.section_id
                      }
                      value={
                        item.section_id
                      }
                    >
                      {
                        item.section_name
                      }
                    </option>
                  )
                )}
              </select>

              {errors.section_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .section_id
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Subject
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

             <select
  {...register(
    "subject_id",
    {
      required:
        "Subject is required",
    }
  )}
  disabled={!selectedClassId}
  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
>
  <option value="">
    {!selectedClassId
      ? "Select Class First"
      : filteredSubjects.length === 0
      ? "No Subject Available"
      : "Select Subject"}
  </option>

  {filteredSubjects.map(
    (item) => (
      <option
        key={item.subject_id}
        value={item.subject_id}
      >
        {item.subject_name}
      </option>
    )
  )}
</select>

              {errors.subject_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .subject_id
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Teacher
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <select
                {...register(
                  "teacher_id",
                  {
                    required:
                      "Teacher is required",
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">
                  Select Teacher
                </option>

                {teachers.map(
                  (
                    item,
                    index
                  ) => (
                    <option
                      key={
                        item.user_id ||
                        item.teacher_id ||
                        index
                      }
                      value={
                        item.user_id ||
                        item.teacher_id
                      }
                    >
                      {
                        item.name ||
                        item.teacher_name ||
                        item.full_name
                      }
                    </option>
                  )
                )}
              </select>

              {errors.teacher_id && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .teacher_id
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Day
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <select
                {...register(
                  "day_of_week",
                  {
                    required:
                      "Day is required",
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">
                  Select Day
                </option>

                {DAYS.map(
                  (day) => (
                    <option
                      key={day}
                      value={day}
                    >
                      {day}
                    </option>
                  )
                )}
              </select>

              {errors.day_of_week && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .day_of_week
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Period No.
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 1"
                {...register(
                  "period_no",
                  {
                    required:
                      "Period number is required",
                    min: {
                      value: 1,
                      message:
                        "Period must be at least 1",
                    },
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.period_no && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .period_no
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Room No. / Name
              </label>

              <input
                type="text"
                placeholder="e.g. Room 102"
                {...register(
                  "room"
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Start Time
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <input
                type="time"
                {...register(
                  "start_time",
                  {
                    required:
                      "Start time is required",
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.start_time && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .start_time
                      .message
                  }
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                End Time
                <span className="text-rose-500">
                  {" "}*
                </span>
              </label>

              <input
                type="time"
                {...register(
                  "end_time",
                  {
                    required:
                      "End time is required",
                  }
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />

              {errors.end_time && (
                <p className="mt-1 text-[11px] text-rose-500">
                  {
                    errors
                      .end_time
                      .message
                  }
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Status
              </label>

              <select
                {...register(
                  "status"
                )}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              )}

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