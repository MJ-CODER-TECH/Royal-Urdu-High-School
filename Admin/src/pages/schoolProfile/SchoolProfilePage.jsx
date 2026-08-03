import React, {
  useEffect,
} from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  School,
  LoaderCircle,
  AlertCircle,
  RefreshCw,
  Settings2,
} from "lucide-react";

import {
  getSchoolProfile,
} from "../../redux/schoolProfile/schoolProfileThunk";

import SchoolProfileForm
  from "./SchoolProfileForm";


const SchoolProfilePage = () => {

  const dispatch =
    useDispatch();


  const {
    schoolProfile,
    exists,
    loading,
    error,
  } = useSelector(
    (state) =>
      state.schoolProfile
  );


  useEffect(() => {

    dispatch(
      getSchoolProfile()
    );

  }, [dispatch]);


  const handleRetry = () => {

    dispatch(
      getSchoolProfile()
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Initial API Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="flex flex-col items-center gap-4">

          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50">

            <LoaderCircle
              size={28}
              className="animate-spin text-blue-600"
            />

          </div>

          <div className="text-center">

            <h2 className="text-base font-semibold text-slate-800">

              Loading School Profile

            </h2>

            <p className="mt-1 text-sm text-slate-500">

              Please wait while school information loads.

            </p>

          </div>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | API Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <div className="flex min-h-[500px] items-center justify-center">

        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-7 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">

            <AlertCircle
              size={28}
              className="text-red-600"
            />

          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-800">

            Unable to Load School Profile

          </h2>

          <p className="mt-2 text-sm text-slate-600">

            {error}

          </p>

          <button
            type="button"
            onClick={
              handleRetry
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >

            <RefreshCw
              size={17}
            />

            Try Again

          </button>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Main Page
  |--------------------------------------------------------------------------
  */

  return (

    <div className="space-y-6 p-1">

      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">

            {
              exists
                ? (
                  <School
                    size={24}
                  />
                )
                : (
                  <Settings2
                    size={24}
                  />
                )
            }

          </div>


          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-800">

              {
                exists
                  ? "School Profile"
                  : "School Profile Setup"
              }

            </h1>


            <p className="mt-1 text-sm text-slate-500">

              {
                exists
                  ? (
                    <>
                      Manage school information,
                      contact details,
                      principal information,
                      and school units.
                    </>
                  )
                  : (
                    <>
                      Complete the initial school setup.
                      Add school information,
                      principal details,
                      signature and school stamp.
                    </>
                  )
              }

            </p>

          </div>

        </div>


        {
          exists
            ? (

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                Profile Configured

              </div>

            )
            : (

              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">

                <span className="h-2 w-2 rounded-full bg-amber-500" />

                Setup Required

              </div>

            )
        }

      </div>


      <SchoolProfileForm
        schoolProfile={
          schoolProfile
        }
        exists={
          exists
        }
      />

    </div>

  );

};


export default
SchoolProfilePage;