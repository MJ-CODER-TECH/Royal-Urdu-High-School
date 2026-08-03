import { useEffect, useState } from "react";

import { getAcademicYearsApi } from "../../api/master.api";


const selectClass =
`
rounded-lg
border
border-slate-300
bg-white
px-3
py-2
text-sm
text-slate-700
outline-none
transition-colors
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-100
`;


/*
|--------------------------------------------------------------------------
| Robust Label Resolver
|--------------------------------------------------------------------------
| Same logic used in StudentForm so both places stay in sync even if the
| API's field names change later.
|--------------------------------------------------------------------------
*/

const formatYearFromDate = (dateValue) => {

  if (!dateValue) {
    return null;
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate.getFullYear();

};


const getAcademicYearLabel = (year, fallbackId) => {

  const directLabel =

    year.year_label ??
    year.yearLabel ??
    year.academic_year ??
    year.academicYear ??
    year.year_name ??
    year.yearName ??
    year.academic_year_name ??
    year.academicYearName ??
    year.name ??
    year.title ??
    year.label ??
    null;

  if (
    directLabel !== null &&
    directLabel !== undefined &&
    String(directLabel).trim() !== ""
  ) {
    return String(directLabel);
  }

  const startYear =

    year.year_start ??
    year.yearStart ??
    year.start_year ??
    year.startYear ??
    formatYearFromDate(
      year.start_date ?? year.startDate
    );

  const endYear =

    year.year_end ??
    year.yearEnd ??
    year.end_year ??
    year.endYear ??
    formatYearFromDate(
      year.end_date ?? year.endDate
    );

  if (startYear && endYear) {
    return `${startYear}-${endYear}`;
  }

  if (startYear) {
    return String(startYear);
  }

  return `Academic Year #${fallbackId}`;

};


const getAcademicYearId = (year) =>

  year.academic_year_id

  ??

  year.academicYearId

  ??

  year.id;


const isCurrentYear = (year) =>

  year.is_current === 1

  ||

  year.is_current === true

  ||

  year.isCurrent === 1

  ||

  year.isCurrent === true;


/*
|--------------------------------------------------------------------------
| Academic Year Filter
|--------------------------------------------------------------------------
*/

const AcademicYearFilter = ({

  academicYearId,
  setAcademicYearId,

  autoSelectCurrent = true,

}) => {


  const [
    academicYears,
    setAcademicYears,
  ] = useState([]);


  const [
    loading,
    setLoading,
  ] = useState(true);


  useEffect(() => {

    let isMounted = true;


    const loadAcademicYears =
      async () => {

        setLoading(true);

        try {

          const response =
            await getAcademicYearsApi();

          const list =
            Array.isArray(response)
              ? response
              : [];

          if (!isMounted) {
            return;
          }

          setAcademicYears(list);

          // Auto-select the current academic year on first load,
          // but only if the parent hasn't already got a value
          // (so we don't override a user's filter choice or a
          // value coming from the URL).

          if (
            autoSelectCurrent &&
            !academicYearId &&
            list.length > 0
          ) {

            const currentYear =

              list.find(isCurrentYear)

              ??

              null;

            if (currentYear) {

              setAcademicYearId(

                String(
                  getAcademicYearId(
                    currentYear
                  )
                )

              );

            }

          }

        }

        catch (error) {

          console.error(
            "Failed to load academic years:",
            error
          );

          if (isMounted) {
            setAcademicYears([]);
          }

        }

        finally {

          if (isMounted) {
            setLoading(false);
          }

        }

      };


    loadAcademicYears();


    return () => {
      isMounted = false;
    };

    // Intentionally only run on mount — auto-select should not
    // re-fire every time academicYearId changes (e.g. when the
    // user clears the filter manually).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (

    <select

      value={academicYearId}

      onChange={(event) =>
        setAcademicYearId(
          event.target.value
        )
      }

      disabled={loading}

      className={selectClass}

    >

      <option value="">

        All Academic Years

      </option>


      {

        academicYears.map(
          (year) => {

            const yearId =
              getAcademicYearId(year);

            const yearLabel =
              getAcademicYearLabel(
                year,
                yearId
              );

            return (

              <option

                key={yearId}

                value={yearId}

              >

                {yearLabel}

                {
                  isCurrentYear(year)
                    ? " (Current)"
                    : ""
                }
                

              </option>

            );

          }
        )

      }

    </select>

  );

};


export default AcademicYearFilter;
