import React, {
    useEffect,
    useState,
} from "react";

import {
    Save,
    X,
    BookOpen,
    GraduationCap,
    Hash,
    ClipboardList,
    FlaskConical,
    LoaderCircle,
} from "lucide-react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    createSubject,
    updateSubject,
} from "../../redux/subject/subjectThunk";

import {
    fetchClasses,
} from "../../redux/master/classMasterThunk";

const SubjectForm = ({
    selectedSubject,
    onClose,
    onSuccess,
}) => {

    const dispatch = useDispatch();

    const {
        loading,
    } = useSelector(
        (state) => state.subject
    );

    const {
        classes = [],
        loading: classesLoading,
    } = useSelector(
        (state) => state.classMaster
    );


    const [formData, setFormData] = useState({

        subject_name: "",

        class_id: "",

        short_code: "",

        theory_marks: "",

        practical_marks: "",

        is_active: 1,

    });


    const [errors, setErrors] = useState({});


    // ==========================================
    // Load Classes Only Once
    // ==========================================

    useEffect(() => {

        dispatch(
            fetchClasses()
        );

    }, [
        dispatch,
    ]);


    // ==========================================
    // Set Add / Edit Data
    // ==========================================

    useEffect(() => {

        if (selectedSubject) {

            setFormData({

                subject_name:
                    selectedSubject.subject_name || "",

                class_id:
                    selectedSubject.class_id
                        ? String(
                            selectedSubject.class_id
                        )
                        : "",

                short_code:
                    selectedSubject.short_code || "",

                theory_marks:
                    selectedSubject.theory_marks ?? "",

                practical_marks:
                    selectedSubject.practical_marks ?? "",

                is_active:
                    Number(
                        selectedSubject.is_active
                    ) === 0
                        ? 0
                        : 1,

            });

        } else {

            setFormData({

                subject_name: "",

                class_id: "",

                short_code: "",

                theory_marks: "",

                practical_marks: "",

                is_active: 1,

            });

        }


        setErrors({});

    }, [
        selectedSubject,
    ]);


    // ==========================================
    // Input Change
    // ==========================================

    const handleChange = (event) => {

        const {
            name,
            value,
            type,
            checked,
        } = event.target;


        setFormData(
            (previous) => ({

                ...previous,

                [name]:

                    type === "checkbox"

                        ? (
                            checked
                                ? 1
                                : 0
                        )

                        : value,

            })
        );


        setErrors(
            (previous) => ({

                ...previous,

                [name]: "",

            })
        );

    };


    // ==========================================
    // Validation
    // ==========================================

    const validateForm = () => {

        const newErrors = {};


        if (
            !formData.subject_name.trim()
        ) {

            newErrors.subject_name =
                "Subject name is required.";

        }


        if (
            !formData.class_id
        ) {

            newErrors.class_id =
                "Please select a class.";

        }


        if (
            formData.theory_marks !== ""
            &&
            Number(
                formData.theory_marks
            ) < 0
        ) {

            newErrors.theory_marks =
                "Theory marks cannot be negative.";

        }


        if (
            formData.practical_marks !== ""
            &&
            Number(
                formData.practical_marks
            ) < 0
        ) {

            newErrors.practical_marks =
                "Practical marks cannot be negative.";

        }


        setErrors(
            newErrors
        );


        return (
            Object.keys(
                newErrors
            ).length === 0
        );

    };


    // ==========================================
    // Submit
    // ==========================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        if (
            !validateForm()
        ) {

            return;

        }


        const payload = {

            subject_name:
                formData.subject_name
                    .trim(),

            class_id:
                Number(
                    formData.class_id
                ),

            short_code:
                formData.short_code
                    .trim()
                    .toUpperCase()
                ||
                null,

            theory_marks:

                formData.theory_marks === ""

                    ? null

                    : Number(
                        formData.theory_marks
                    ),

            practical_marks:

                formData.practical_marks === ""

                    ? null

                    : Number(
                        formData.practical_marks
                    ),

            is_active:
                Number(
                    formData.is_active
                ),

        };


        try {

            if (
                selectedSubject
            ) {

                await dispatch(

                    updateSubject({

                        id:
                            selectedSubject.subject_id,

                        data:
                            payload,

                    })

                ).unwrap();

            } else {

                await dispatch(

                    createSubject(
                        payload
                    )

                ).unwrap();

            }


            // Prefer onSuccess (closes modal AND refetches the list).
            // Fall back to onClose so the form still works if a parent
            // forgets to pass onSuccess.

            if (
                onSuccess
            ) {

                await onSuccess();

            } else if (
                onClose
            ) {

                onClose();

            }

        } catch (error) {

            console.error(
                "Subject save error:",
                error
            );

        }

    };


    return (

        <form
            onSubmit={
                handleSubmit
            }
            className="
                space-y-5
            "
        >


            {/* Subject Name */}

            <div>

                <label
                    className="
                        mb-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >

                    <BookOpen
                        size={16}
                        className="
                            text-blue-600
                        "
                    />

                    Subject Name

                    <span
                        className="
                            text-red-500
                        "
                    >
                        *
                    </span>

                </label>


                <input

                    type="text"

                    name="subject_name"

                    value={
                        formData.subject_name
                    }

                    onChange={
                        handleChange
                    }

                    placeholder="
                        Enter subject name
                    "

                    autoComplete="off"

                    className={`
                        w-full
                        rounded-xl
                        border
                        bg-white
                        px-4
                        py-3
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        placeholder:text-slate-400
                        focus:ring-4
                        ${
                            errors.subject_name

                                ? `
                                    border-red-400
                                    focus:border-red-500
                                    focus:ring-red-500/10
                                `

                                : `
                                    border-slate-200
                                    hover:border-slate-300
                                    focus:border-blue-600
                                    focus:ring-blue-600/10
                                `
                        }
                    `}

                />


                {
                    errors.subject_name && (

                        <p
                            className="
                                mt-1.5
                                text-xs
                                font-medium
                                text-red-500
                            "
                        >

                            {
                                errors.subject_name
                            }

                        </p>

                    )
                }

            </div>


            {/* Class */}

            <div>

                <label
                    className="
                        mb-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >

                    <GraduationCap
                        size={16}
                        className="
                            text-blue-600
                        "
                    />

                    Class

                    <span
                        className="
                            text-red-500
                        "
                    >
                        *
                    </span>

                </label>


                <select

                    name="class_id"

                    value={
                        formData.class_id
                    }

                    onChange={
                        handleChange
                    }

                    disabled={
                        classesLoading
                    }

                    className={`
                        w-full
                        cursor-pointer
                        rounded-xl
                        border
                        bg-white
                        px-4
                        py-3
                        text-sm
                        text-slate-900
                        outline-none
                        transition
                        focus:ring-4
                        disabled:cursor-not-allowed
                        disabled:bg-slate-50
                        ${
                            errors.class_id

                                ? `
                                    border-red-400
                                    focus:border-red-500
                                    focus:ring-red-500/10
                                `

                                : `
                                    border-slate-200
                                    hover:border-slate-300
                                    focus:border-blue-600
                                    focus:ring-blue-600/10
                                `
                        }
                    `}

                >

                    <option value="" className="bg-white text-slate-400">

                        {
                            classesLoading

                                ? "Loading classes..."

                                : "Select Class"
                        }

                    </option>


                    {
                        classes.map(
                            (item) => (

                                <option

                                    key={
                                        item.class_id
                                    }

                                    value={
                                        item.class_id
                                    }

                                    className="bg-white text-slate-900"
                                >

                                    {
                                        item.class_name
                                    }

                                </option>

                            )
                        )
                    }

                </select>


                {
                    errors.class_id && (

                        <p
                            className="
                                mt-1.5
                                text-xs
                                font-medium
                                text-red-500
                            "
                        >

                            {
                                errors.class_id
                            }

                        </p>

                    )
                }

            </div>


            {/* Subject Code */}

            <div>

                <label
                    className="
                        mb-2
                        flex
                        items-center
                        gap-2
                        text-sm
                        font-semibold
                        text-slate-700
                    "
                >

                    <Hash
                        size={16}
                        className="
                            text-blue-600
                        "
                    />

                    Subject Code

                    <span
                        className="
                            text-xs
                            font-normal
                            text-slate-400
                        "
                    >

                        Optional

                    </span>

                </label>


                <input

                    type="text"

                    name="short_code"

                    value={
                        formData.short_code
                    }

                    onChange={
                        handleChange
                    }

                    maxLength={10}

                    placeholder="
                        Example: MATH
                    "

                    autoComplete="off"

                    className="
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-3
                        text-sm
                        uppercase
                        text-slate-900
                        outline-none
                        transition
                        placeholder:normal-case
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-blue-600
                        focus:ring-4
                        focus:ring-blue-600/10
                    "

                />

            </div>


            {/* Marks */}

            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                "
            >


                <div>

                    <label
                        className="
                            mb-2
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >

                        <ClipboardList
                            size={16}
                            className="
                                text-blue-600
                            "
                        />

                        Theory Marks

                    </label>


                    <input

                        type="number"

                        name="theory_marks"

                        value={
                            formData.theory_marks
                        }

                        onChange={
                            handleChange
                        }

                        min="0"

                        placeholder="
                            Example: 80
                        "

                        className={`
                            w-full
                            rounded-xl
                            border
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:ring-4
                            ${
                                errors.theory_marks

                                    ? `
                                        border-red-400
                                        focus:border-red-500
                                        focus:ring-red-500/10
                                    `

                                    : `
                                        border-slate-200
                                        hover:border-slate-300
                                        focus:border-blue-600
                                        focus:ring-blue-600/10
                                    `
                            }
                        `}

                    />


                    {
                        errors.theory_marks && (

                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    font-medium
                                    text-red-500
                                "
                            >

                                {
                                    errors.theory_marks
                                }

                            </p>

                        )
                    }

                </div>


                <div>

                    <label
                        className="
                            mb-2
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >

                        <FlaskConical
                            size={16}
                            className="
                                text-blue-600
                            "
                        />

                        Practical Marks

                    </label>


                    <input

                        type="number"

                        name="practical_marks"

                        value={
                            formData.practical_marks
                        }

                        onChange={
                            handleChange
                        }

                        min="0"

                        placeholder="
                            Example: 20
                        "

                        className={`
                            w-full
                            rounded-xl
                            border
                            bg-white
                            px-4
                            py-3
                            text-sm
                            text-slate-900
                            outline-none
                            transition
                            placeholder:text-slate-400
                            focus:ring-4
                            ${
                                errors.practical_marks

                                    ? `
                                        border-red-400
                                        focus:border-red-500
                                        focus:ring-red-500/10
                                    `

                                    : `
                                        border-slate-200
                                        hover:border-slate-300
                                        focus:border-blue-600
                                        focus:ring-blue-600/10
                                    `
                            }
                        `}

                    />


                    {
                        errors.practical_marks && (

                            <p
                                className="
                                    mt-1.5
                                    text-xs
                                    font-medium
                                    text-red-500
                                "
                            >

                                {
                                    errors.practical_marks
                                }

                            </p>

                        )
                    }

                </div>

            </div>


            {/* Status */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3.5
                "
            >

                <div>

                    <p
                        className="
                            text-sm
                            font-semibold
                            text-slate-700
                        "
                    >

                        Active Subject

                    </p>


                    <p
                        className="
                            mt-0.5
                            text-xs
                            text-slate-500
                        "
                    >

                        Show this subject in active
                        school forms and dropdowns.

                    </p>

                </div>


                <label
                    className="
                        relative
                        inline-flex
                        cursor-pointer
                        items-center
                    "
                >

                    <input

                        type="checkbox"

                        name="is_active"

                        checked={
                            Number(
                                formData.is_active
                            ) === 1
                        }

                        onChange={
                            handleChange
                        }

                        className="
                            peer
                            sr-only
                        "

                    />


                    <div
                        className="
                            relative
                            h-7
                            w-12
                            rounded-full
                            bg-slate-300
                            transition
                            after:absolute
                            after:left-1
                            after:top-1
                            after:h-5
                            after:w-5
                            after:rounded-full
                            after:bg-white
                            after:shadow
                            after:transition
                            peer-checked:bg-emerald-600
                            peer-checked:after:translate-x-5
                        "
                    />

                </label>

            </div>


            {/* Buttons */}

            <div
                className="
                    flex
                    flex-col-reverse
                    gap-3
                    border-t
                    border-slate-200
                    pt-5
                    sm:flex-row
                    sm:justify-end
                "
            >

                <button

                    type="button"

                    onClick={
                        onClose
                    }

                    disabled={
                        loading
                    }

                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    <X size={17} />

                    Cancel

                </button>


                <button

                    type="submit"

                    disabled={
                        loading
                    }

                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >

                    {
                        loading

                            ? (

                                <>

                                    <LoaderCircle
                                        size={17}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Saving...

                                </>

                            )

                            : (

                                <>

                                    <Save size={17} />

                                    {
                                        selectedSubject

                                            ? "Update Subject"

                                            : "Add Subject"
                                    }

                                </>

                            )
                    }

                </button>

            </div>

        </form>

    );

};

export default SubjectForm;