import React, { useEffect, useMemo } from "react";

const PromotionFilters = ({
    academicYears = [],
    classes = [],
    sections = [],
    filters,
    setFilters,
    onLoadStudents,
    loading,
}) => {

    /*
    |--------------------------------------------------------------------------
    | Auto Select Active Academic Year
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        // Agar user ne already year select kiya hai,
        // to usko change mat karo.
        if (filters.academic_year_id) {
            return;
        }

        if (
            !Array.isArray(academicYears) ||
            academicYears.length === 0
        ) {
            return;
        }

        const activeYear = academicYears.find((item) => {

            const status =
                String(item.status || "").toLowerCase();

            return (
                status === "active" ||
                Number(item.is_active) === 1
            );

        });

        if (activeYear) {

            setFilters((previous) => ({
                ...previous,
                academic_year_id: String(
                    activeYear.academic_year_id
                ),
            }));

        }

    }, [
        academicYears,
        filters.academic_year_id,
        setFilters,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Show Only Selected Class Sections
    |--------------------------------------------------------------------------
    */

    const filteredSections = useMemo(() => {

        if (!filters.class_id) {
            return [];
        }

        return sections.filter((item) => {

            return (
                Number(item.class_id) ===
                Number(filters.class_id)
            );

        });

    }, [
        sections,
        filters.class_id,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Handle Dropdown Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFilters((previous) => {

            const updatedFilters = {
                ...previous,
                [name]: value,
            };

            /*
            |--------------------------------------------------------------
            | Class change hone par purana section remove karo
            |--------------------------------------------------------------
            */

            if (name === "class_id") {

                updatedFilters.section_id = "";

            }

            return updatedFilters;

        });

    };


    return (

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

            <h2 className="mb-5 text-lg font-semibold text-slate-800">
                Promotion Filters
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                {/* =====================================================
                    Academic Year
                ===================================================== */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Academic Year
                    </label>

                    <select
                        name="academic_year_id"
                        value={
                            filters.academic_year_id || ""
                        }
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >

                        <option value="">
                            Select Academic Year
                        </option>

                        {academicYears.map((year) => (

                            <option
                                key={
                                    year.academic_year_id
                                }
                                value={
                                    year.academic_year_id
                                }
                            >

                                {year.year_start}
                                {" - "}
                                {year.year_end}

                            </option>

                        ))}

                    </select>

                </div>


                {/* =====================================================
                    Class
                ===================================================== */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Class
                    </label>

                    <select
                        name="class_id"
                        value={
                            filters.class_id || ""
                        }
                        onChange={handleChange}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >

                        <option value="">
                            Select Class
                        </option>

                        {classes.map((item) => (

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

                        ))}

                    </select>

                </div>


                {/* =====================================================
                    Section
                ===================================================== */}

                <div>

                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Section
                    </label>

                    <select
                        name="section_id"
                        value={
                            filters.section_id || ""
                        }
                        onChange={handleChange}
                        disabled={
                            !filters.class_id
                        }
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                    >

                        <option value="">

                            {filters.class_id
                                ? "Select Section"
                                : "Select Class first"}

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

                </div>


                {/* =====================================================
                    Load Students Button
                ===================================================== */}

                <div className="flex items-end">

                    <button
                        type="button"
                        onClick={
                            onLoadStudents
                        }
                        disabled={
                            loading
                        }
                        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading
                            ? "Loading..."
                            : "Load Students"}

                    </button>

                </div>

            </div>

        </div>

    );

};

export default PromotionFilters;