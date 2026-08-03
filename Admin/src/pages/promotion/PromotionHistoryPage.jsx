import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import PromotionHistoryTable
    from "../../components/promotion/PromotionHistoryTable";

import {
    fetchPromotionHistory,
} from "../../redux/promotion/promotionThunk";

import {
    fetchAcademicYears,
} from "../../redux/master/academicYearThunk";

import {
    fetchClasses,
} from "../../redux/master/classMasterThunk";

import {
    fetchSections,
} from "../../redux/section/sectionThunk";


const PromotionHistoryPage = () => {

    const dispatch = useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux Data
    |--------------------------------------------------------------------------
    */

    const {
        history = [],
        loading,
    } = useSelector(
        (state) => state.promotion
    );


    const {
        academicYears = [],
    } = useSelector(
        (state) =>
            state.academicYear
    );


    const {
        classes = [],
    } = useSelector(
        (state) =>
            state.classMaster
    );


    const {
        sections = [],
    } = useSelector(
        (state) =>
            state.section
    );


    /*
    |--------------------------------------------------------------------------
    | Filter State
    |--------------------------------------------------------------------------
    */

    const [
        filters,
        setFilters,
    ] = useState({

        academic_year_id: "",
        class_id: "",
        section_id: "",

    });


    /*
    |--------------------------------------------------------------------------
    | Load Dropdown Data
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Auto Select Active Academic Year
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            filters.academic_year_id
        ) {
            return;
        }

        if (
            !Array.isArray(
                academicYears
            ) ||
            academicYears.length === 0
        ) {
            return;
        }

        const activeYear =
            academicYears.find(
                (item) => {

                    const status =
                        String(
                            item.status || ""
                        ).toLowerCase();

                    return (

                        status ===
                            "active" ||

                        Number(
                            item.is_active
                        ) === 1

                    );

                }
            );


        if (activeYear) {

            setFilters(
                (previous) => ({

                    ...previous,

                    academic_year_id:

                        String(
                            activeYear
                                .academic_year_id
                        ),

                })
            );

        }

    }, [
        academicYears,
        filters.academic_year_id,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Filter Sections By Class
    |--------------------------------------------------------------------------
    */

    const sectionOptions =
        useMemo(() => {

            if (
                !filters.class_id
            ) {
                return [];
            }

            return sections.filter(
                (item) =>

                    Number(
                        item.class_id
                    ) ===

                    Number(
                        filters.class_id
                    )
            );

        }, [
            sections,
            filters.class_id,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Handle Dropdown Change
    |--------------------------------------------------------------------------
    */

    const handleChange = (
        field,
        value
    ) => {

        setFilters(
            (previous) => {

                const updated = {

                    ...previous,

                    [field]: value,

                };


                if (
                    field ===
                    "class_id"
                ) {

                    updated
                        .section_id =
                        "";

                }

                return updated;

            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Load History
    |--------------------------------------------------------------------------
    */

    const handleFilter = () => {

        if (
            !filters
                .academic_year_id ||

            !filters
                .class_id
        ) {
            return;
        }


        dispatch(

            fetchPromotionHistory({

                academic_year_id:

                    Number(
                        filters
                            .academic_year_id
                    ),

                class_id:

                    Number(
                        filters
                            .class_id
                    ),

                section_id:

                    filters
                        .section_id

                        ? Number(
                            filters
                                .section_id
                        )

                        : "",

            })

        );

    };


    return (

        <div className="space-y-6">


            {/* Header */}

            <div>

                <h1 className="text-2xl font-bold text-slate-800">

                    Promotion History

                </h1>

                <p className="mt-1 text-sm text-slate-500">

                    Look up which students were promoted,
                    when, and to where.

                </p>

            </div>


            {/* Filters */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">


                    {/* Academic Year */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">

                            Academic Year

                        </label>

                        <select

                            value={
                                filters
                                    .academic_year_id ||
                                ""
                            }

                            onChange={
                                (event) =>

                                    handleChange(

                                        "academic_year_id",

                                        event
                                            .target
                                            .value

                                    )
                            }

                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"

                        >

                            <option value="">

                                Select Academic Year

                            </option>


                            {
                                academicYears.map(
                                    (year) => (

                                        <option

                                            key={
                                                year
                                                    .academic_year_id
                                            }

                                            value={
                                                year
                                                    .academic_year_id
                                            }

                                        >

                                            {
                                                year
                                                    .year_start
                                            }

                                            {" - "}

                                            {
                                                year
                                                    .year_end
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>

                    </div>


                    {/* Class */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">

                            Class

                        </label>

                        <select

                            value={
                                filters
                                    .class_id ||
                                ""
                            }

                            onChange={
                                (event) =>

                                    handleChange(

                                        "class_id",

                                        event
                                            .target
                                            .value

                                    )
                            }

                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2"

                        >

                            <option value="">

                                Select Class

                            </option>


                            {
                                classes.map(
                                    (item) => (

                                        <option

                                            key={
                                                item
                                                    .class_id
                                            }

                                            value={
                                                item
                                                    .class_id
                                            }

                                        >

                                            {
                                                item
                                                    .class_name
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>

                    </div>


                    {/* Section */}

                    <div>

                        <label className="mb-2 block text-sm font-medium text-slate-700">

                            Section
                            {" "}
                            (Optional)

                        </label>

                        <select

                            value={
                                filters
                                    .section_id ||
                                ""
                            }

                            onChange={
                                (event) =>

                                    handleChange(

                                        "section_id",

                                        event
                                            .target
                                            .value

                                    )
                            }

                            disabled={
                                !filters
                                    .class_id
                            }

                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-100"

                        >

                            <option value="">

                                All Sections

                            </option>


                            {
                                sectionOptions.map(
                                    (item) => (

                                        <option

                                            key={
                                                item
                                                    .section_id
                                            }

                                            value={
                                                item
                                                    .section_id
                                            }

                                        >

                                            {
                                                item
                                                    .section_name
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>

                    </div>


                    {/* Button */}

                    <div className="flex items-end">

                        <button

                            type="button"

                            onClick={
                                handleFilter
                            }

                            disabled={

                                loading ||

                                !filters
                                    .academic_year_id ||

                                !filters
                                    .class_id

                            }

                            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"

                        >

                            {
                                loading

                                    ? "Loading..."

                                    : "View History"
                            }

                        </button>

                    </div>

                </div>

            </div>


            {/* History Table */}

            <PromotionHistoryTable

                history={
                    history
                }

                loading={
                    loading
                }

            />

        </div>

    );

};

export default PromotionHistoryPage;