import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import PromotionFilters
    from "../../components/promotion/PromotionFilters";

import StudentPromotionTable
    from "../../components/promotion/StudentPromotionTable";

import PromotionModal
    from "../../components/promotion/PromotionModal";

import PromotionHistoryTable
    from "../../components/promotion/PromotionHistoryTable";

import {
    fetchPromotionStudents,
    promoteStudentsThunk,
    fetchPromotionHistory,
} from "../../redux/promotion/promotionThunk";

import {
    clearPromotionState,
} from "../../redux/promotion/promotionSlice";

import {
    fetchAcademicYears,
} from "../../redux/master/academicYearThunk";

import {
    fetchClasses,
} from "../../redux/master/classMasterThunk";

import {
    fetchSections,
} from "../../redux/section/sectionThunk";


const PromotionPage = () => {

    const dispatch = useDispatch();


    /*
    |--------------------------------------------------------------------------
    | Redux State
    |--------------------------------------------------------------------------
    */

    const {
        students = [],
        history = [],
        loading,
        promoteLoading,
        success,
        message,
        lastResult,
        error,
    } = useSelector(
        (state) => state.promotion
    );


    const {
        academicYears = [],
    } = useSelector(
        (state) => state.academicYear
    );


    const {
        classes = [],
    } = useSelector(
        (state) => state.classMaster
    );


    const {
        sections = [],
    } = useSelector(
        (state) => state.section
    );


    /*
    |--------------------------------------------------------------------------
    | Current Student Filters
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
    | Next Promotion Details
    |--------------------------------------------------------------------------
    */

    const [
        nextData,
        setNextData,
    ] = useState({

        academic_year_id: "",
        class_id: "",
        section_id: "",

    });


    /*
    |--------------------------------------------------------------------------
    | Other Local State
    |--------------------------------------------------------------------------
    */

    const [
        selectedStudents,
        setSelectedStudents,
    ] = useState([]);

    const [
        showModal,
        setShowModal,
    ] = useState(false);

    const [
        formNotice,
        setFormNotice,
    ] = useState("");


    /*
    |--------------------------------------------------------------------------
    | Load Master Dropdown Data
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
                        status === "active" ||
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
    | Next Class Sections
    |--------------------------------------------------------------------------
    */

    const nextSectionOptions =
        useMemo(() => {

            if (
                !nextData.class_id
            ) {
                return [];
            }

            return sections.filter(
                (item) => {

                    return (
                        Number(
                            item.class_id
                        ) ===
                        Number(
                            nextData.class_id
                        )
                    );

                }
            );

        }, [
            sections,
            nextData.class_id,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Next Dropdown Change
    |--------------------------------------------------------------------------
    */

    const handleNextDataChange = (
        field,
        value
    ) => {

        setNextData(
            (previous) => {

                const updatedData = {

                    ...previous,

                    [field]: value,

                };

                if (
                    field === "class_id"
                ) {

                    updatedData
                        .section_id = "";

                }

                return updatedData;

            }
        );

    };


    /*
    |--------------------------------------------------------------------------
    | Load Students
    |--------------------------------------------------------------------------
    */

   const handleLoadStudents = async () => {
    setFormNotice("");

    if (
        !filters.academic_year_id ||
        !filters.class_id ||
        !filters.section_id
    ) {
        setFormNotice(
            "Select Academic Year, Class and Section to load students."
        );
        return;
    }

    const payload = {
        academic_year_id: Number(filters.academic_year_id),
        class_id: Number(filters.class_id),
        section_id: Number(filters.section_id),
    };

    console.log("PROMOTION FILTER PAYLOAD:", payload);

    setSelectedStudents([]);

    const result = await dispatch(
        fetchPromotionStudents(payload)
    );

    console.log("PROMOTION API RESULT:", result);

    if (fetchPromotionStudents.rejected.match(result)) {
        setFormNotice(
            result.payload ||
            result.error?.message ||
            "Students could not be loaded."
        );
    }
};

    /*
    |--------------------------------------------------------------------------
    | Open Promotion Modal
    |--------------------------------------------------------------------------
    */

    const handleOpenModal = () => {

        setFormNotice("");

        if (
            selectedStudents.length === 0
        ) {

            setFormNotice(
                "Select at least one student to promote."
            );

            return;

        }

        if (
            !nextData.academic_year_id ||
            !nextData.class_id ||
            !nextData.section_id
        ) {

            setFormNotice(
                "Select the next Academic Year, Class and Section."
            );

            return;

        }

        setShowModal(true);

    };


    /*
    |--------------------------------------------------------------------------
    | Promote Students
    |--------------------------------------------------------------------------
    */

    const handlePromote = async () => {

        const payload = {

            students:

                selectedStudents.map(
                    (student) => ({

                        student_id:
                            Number(
                                student
                                    .student_id
                            ),

                        roll_no:
                            student.roll_no,

                        status:
                            student.status,

                    })
                ),


            fromAcademicYearId:

                Number(
                    filters
                        .academic_year_id
                ),


            toAcademicYearId:

                Number(
                    nextData
                        .academic_year_id
                ),


            fromClassId:

                Number(
                    filters.class_id
                ),


            toClassId:

                Number(
                    nextData.class_id
                ),


            toSectionId:

                Number(
                    nextData.section_id
                ),


            promotedBy: 1,

        };


        const result = await dispatch(

            promoteStudentsThunk(
                payload
            )

        );


        if (
            promoteStudentsThunk
                .fulfilled
                .match(result)
        ) {

            setShowModal(false);

            dispatch(

                fetchPromotionStudents({

                    academic_year_id:

                        Number(
                            filters
                                .academic_year_id
                        ),

                    class_id:

                        Number(
                            filters.class_id
                        ),

                    section_id:

                        Number(
                            filters.section_id
                        ),

                })

            );


            dispatch(

                fetchPromotionHistory({

                    academic_year_id:

                        Number(
                            nextData
                                .academic_year_id
                        ),

                    class_id:

                        Number(
                            nextData
                                .class_id
                        ),

                    section_id:

                        Number(
                            nextData
                                .section_id
                        ),

                })

            );


            setSelectedStudents([]);

        }

    };


    /*
    |--------------------------------------------------------------------------
    | Clear Success/Error Message
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (
            success ||
            error
        ) {

            const timer =
                setTimeout(
                    () => {

                        dispatch(
                            clearPromotionState()
                        );

                    },
                    6000
                );

            return () => {

                clearTimeout(
                    timer
                );

            };

        }

    }, [
        success,
        error,
        dispatch,
    ]);


    /*
    |--------------------------------------------------------------------------
    | Selected Dropdown Names
    |--------------------------------------------------------------------------
    */

    const fromAcademicYear =
        useMemo(() => {

            const item =
                academicYears.find(
                    (year) =>

                        Number(
                            year
                                .academic_year_id
                        ) ===

                        Number(
                            filters
                                .academic_year_id
                        )
                );

            if (!item) {
                return "-";
            }

            return (
                `${item.year_start}-${item.year_end}`
            );

        }, [
            academicYears,
            filters.academic_year_id,
        ]);


    const toAcademicYear =
        useMemo(() => {

            const item =
                academicYears.find(
                    (year) =>

                        Number(
                            year
                                .academic_year_id
                        ) ===

                        Number(
                            nextData
                                .academic_year_id
                        )
                );

            if (!item) {
                return "-";
            }

            return (
                `${item.year_start}-${item.year_end}`
            );

        }, [
            academicYears,
            nextData.academic_year_id,
        ]);


    const fromClass =
        useMemo(() => {

            const item =
                classes.find(
                    (item) =>

                        Number(
                            item.class_id
                        ) ===

                        Number(
                            filters.class_id
                        )
                );

            return (
                item?.class_name ||
                "-"
            );

        }, [
            classes,
            filters.class_id,
        ]);


    const toClass =
        useMemo(() => {

            const item =
                classes.find(
                    (item) =>

                        Number(
                            item.class_id
                        ) ===

                        Number(
                            nextData.class_id
                        )
                );

            return (
                item?.class_name ||
                "-"
            );

        }, [
            classes,
            nextData.class_id,
        ]);


    const fromSection =
        useMemo(() => {

            const item =
                sections.find(
                    (item) =>

                        Number(
                            item.section_id
                        ) ===

                        Number(
                            filters.section_id
                        )
                );

            return (
                item?.section_name ||
                "-"
            );

        }, [
            sections,
            filters.section_id,
        ]);


    const toSection =
        useMemo(() => {

            const item =
                sections.find(
                    (item) =>

                        Number(
                            item.section_id
                        ) ===

                        Number(
                            nextData.section_id
                        )
                );

            return (
                item?.section_name ||
                "-"
            );

        }, [
            sections,
            nextData.section_id,
        ]);


    /*
    |--------------------------------------------------------------------------
    | UI
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6">

            {/* Header */}

            <div>

                <h1 className="text-2xl font-bold text-slate-800">

                    Promote Students

                </h1>

                <p className="mt-1 text-sm text-slate-500">

                    Promote students to the next academic year,
                    class and section.

                </p>

            </div>


            {/* Notice */}

            {formNotice && (

                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700">

                    {formNotice}

                </div>

            )}


            {/* Success */}

            {success && message && (

                <div className="rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">

                    {message}

                    {
                        lastResult
                            ?.skipped
                            ?.length > 0 && (

                            <ul className="mt-2 list-inside list-disc">

                                {
                                    lastResult
                                        .skipped
                                        .map(
                                            (student) => (

                                                <li
                                                    key={
                                                        student
                                                            .student_id
                                                    }
                                                >

                                                    Student ID{" "}

                                                    {
                                                        student
                                                            .student_id
                                                    }

                                                    :{" "}

                                                    {
                                                        student
                                                            .reason
                                                    }

                                                </li>

                                            )
                                        )
                                }

                            </ul>

                        )
                    }

                </div>

            )}


            {/* Error */}

            {error && (

                <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">

                    {error}

                </div>

            )}


            {/* Current Filters */}

            <PromotionFilters

                academicYears={
                    academicYears
                }

                classes={
                    classes
                }

                sections={
                    sections
                }

                filters={
                    filters
                }

                setFilters={
                    setFilters
                }

                onLoadStudents={
                    handleLoadStudents
                }

                loading={
                    loading
                }

            />


            {/* Student Table */}

            <StudentPromotionTable

                students={
                    students
                }

                selectedStudents={
                    selectedStudents
                }

                setSelectedStudents={
                    setSelectedStudents
                }

                loading={
                    loading
                }

            />


            {/* Next Details */}

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">

                <h2 className="mb-5 text-lg font-semibold text-slate-800">

                    Next Academic Details

                </h2>


                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">


                    {/* Next Academic Year */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Next Academic Year

                        </label>

                        <select

                            value={
                                nextData
                                    .academic_year_id ||
                                ""
                            }

                            onChange={
                                (event) =>

                                    handleNextDataChange(

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


                    {/* Next Class */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Next Class

                        </label>

                        <select

                            value={
                                nextData
                                    .class_id ||
                                ""
                            }

                            onChange={
                                (event) =>

                                    handleNextDataChange(

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


                    {/* Next Section */}

                    <div>

                        <label className="mb-2 block text-sm font-medium">

                            Next Section

                        </label>

                        <select

                            value={
                                nextData
                                    .section_id ||
                                ""
                            }

                            onChange={
                                (event) =>

                                    handleNextDataChange(

                                        "section_id",

                                        event
                                            .target
                                            .value

                                    )
                            }

                            disabled={
                                !nextData
                                    .class_id
                            }

                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-100"

                        >

                            <option value="">

                                {
                                    nextData.class_id

                                        ? "Select Section"

                                        : "Select Next Class first"
                                }

                            </option>


                            {
                                nextSectionOptions.map(
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

                </div>


                {/* Selected Count */}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="text-sm text-slate-600">

                        Selected Students:

                        <span className="ml-2 font-bold text-indigo-600">

                            {
                                selectedStudents
                                    .length
                            }

                        </span>

                    </div>


                    <button

                        type="button"

                        onClick={
                            handleOpenModal
                        }

                        disabled={
                            selectedStudents
                                .length === 0 ||

                            promoteLoading
                        }

                        className="w-full rounded-lg bg-indigo-600 px-6 py-2 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"

                    >

                        {
                            promoteLoading

                                ? "Promoting..."

                                : "Promote Students"
                        }

                    </button>

                </div>

            </div>


            {/* History */}

            <PromotionHistoryTable

                history={
                    history
                }

                loading={
                    loading
                }

            />


            {/* Modal */}

            <PromotionModal

                open={
                    showModal
                }

                onClose={
                    () =>
                        setShowModal(
                            false
                        )
                }

                onConfirm={
                    handlePromote
                }

                loading={
                    promoteLoading
                }

                selectedStudents={
                    selectedStudents
                }

                fromAcademicYear={
                    fromAcademicYear
                }

                toAcademicYear={
                    toAcademicYear
                }

                fromClass={
                    fromClass
                }

                toClass={
                    toClass
                }

                fromSection={
                    fromSection
                }

                toSection={
                    toSection
                }

            />

        </div>

    );

};

export default PromotionPage;