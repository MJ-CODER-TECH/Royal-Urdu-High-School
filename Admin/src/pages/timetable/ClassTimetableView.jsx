import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  Calendar,
  Search,
  RotateCcw,
} from "lucide-react";

import {
  getClassTimetable,
  fetchClasses,
  fetchSections,
} from "../../redux/timetable/timetableThunk";

import {
  fetchAcademicYears,
} from "../../redux/master/academicYearThunk";

import ClassTimetableTable from "./ClassTimetableTable";

const ClassTimetableView = () => {
  const dispatch = useDispatch();

  const {
    classTimetable = [],
    classes = [],
    sections = [],
    loading = false,
  } = useSelector(
    (state) =>
      state.timetable || {}
  );

  const {
    academicYears = [],
  } = useSelector(
    (state) =>
      state.academicYear || {}
  );

  const [filters, setFilters] =
    useState({
      academic_year_id: "",
      class_id: "",
      section_id: "",
    });

  useEffect(() => {
    dispatch(
      fetchAcademicYears()
    );

    dispatch(
      fetchClasses()
    );

    dispatch(
      fetchSections()
    );
  }, [dispatch]);

  const filteredSections =
    useMemo(() => {
      if (
        !filters.class_id
      ) {
        return [];
      }

      return sections.filter(
        (section) =>
          String(
            section.class_id
          ) ===
          String(
            filters.class_id
          )
      );
    }, [
      sections,
      filters.class_id,
    ]);

  const handleSearch = (
    event
  ) => {
    event.preventDefault();

    if (
      !filters.academic_year_id ||
      !filters.class_id ||
      !filters.section_id
    ) {
      return;
    }

    dispatch(
      getClassTimetable(
        filters
      )
    );
  };

  const handleReset = () => {
    setFilters({
      academic_year_id: "",
      class_id: "",
      section_id: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <div className="flex items-center gap-2">
          <Calendar
            size={26}
            className="text-indigo-600"
          />

          <h1 className="text-2xl font-bold text-slate-800">
            Class Timetable
          </h1>
        </div>

        <p className="mt-1 text-xs text-slate-500">
          View weekly schedule and
          period allocations for
          classes and sections.
        </p>
      </div>

      <form
        onSubmit={
          handleSearch
        }
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Academic Year
            </label>

            <select
              value={
                filters.academic_year_id
              }
              onChange={(
                event
              ) => {
                setFilters(
                  (
                    previous
                  ) => ({
                    ...previous,
                    academic_year_id:
                      event
                        .target
                        .value,
                  })
                );
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">
                Select Academic Year
              </option>

              {academicYears.map(
                (
                  item
                ) => (
                  <option
                    key={
                      item.academic_year_id
                    }
                    value={
                      item.academic_year_id
                    }
                  >
                    {
                      item.year_start
                    }
                    {" - "}
                    {
                      item.year_end
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Class
            </label>

            <select
              value={
                filters.class_id
              }
              onChange={(
                event
              ) => {
                setFilters(
                  (
                    previous
                  ) => ({
                    ...previous,
                    class_id:
                      event
                        .target
                        .value,
                    section_id:
                      "",
                  })
                );
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">
                Select Class
              </option>

              {classes.map(
                (
                  item
                ) => (
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
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Section
            </label>

            <select
              value={
                filters.section_id
              }
              disabled={
                !filters.class_id
              }
              onChange={(
                event
              ) => {
                setFilters(
                  (
                    previous
                  ) => ({
                    ...previous,
                    section_id:
                      event
                        .target
                        .value,
                  })
                );
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {filters.class_id
                  ? "Select Section"
                  : "Select Class First"}
              </option>

              {filteredSections.map(
                (
                  item
                ) => (
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
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={
                !filters.academic_year_id ||
                !filters.class_id ||
                !filters.section_id
              }
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Search size={15} />

              View Timetable
            </button>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={
                handleReset
              }
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <RotateCcw
                size={15}
              />

              Reset
            </button>
          </div>
        </div>
      </form>

      <ClassTimetableTable
        data={
          classTimetable
        }
        loading={
          loading
        }
      />
    </div>
  );
};

export default ClassTimetableView;