import {
    useEffect,
} from "react";

import {
    Search,
    RotateCcw,
    SlidersHorizontal,
    GraduationCap,
    CircleCheck,
} from "lucide-react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    fetchClasses,
} from "../../redux/master/classMasterThunk";


const SubjectFilters = ({
    filters = {},
    setFilters,
}) => {


    const dispatch = useDispatch();


    const {
        classes = [],
        loading: classesLoading = false,
    } = useSelector(
        (state) => state.classMaster
    );



    /*
    |--------------------------------------------------------------------------
    | Load Classes
    |--------------------------------------------------------------------------
    */


    useEffect(() => {

        if (
            classes.length === 0 &&
            !classesLoading
        ) {

            dispatch(
                fetchClasses()
            );

        }

    }, [
        dispatch,
        classes.length,
        classesLoading,
    ]);




    /*
    |--------------------------------------------------------------------------
    | Filter Change
    |--------------------------------------------------------------------------
    */


    const handleChange = (
        e
    ) => {


        const {
            name,
            value,
        } = e.target;



        setFilters(
            (prev)=>({

                ...prev,

                [name]:
                    value,

                page:
                    1,

            })
        );


    };





    /*
    |--------------------------------------------------------------------------
    | Reset
    |--------------------------------------------------------------------------
    */


    const handleReset = ()=>{


        setFilters(
            (prev)=>({

                ...prev,

                search:
                    "",

                class_id:
                    "",

                is_active:
                    "",

                page:
                    1,

            })
        );


    };





    const hasActiveFilters =

        Boolean(
            filters.search ||
            filters.class_id ||
            filters.is_active !== ""
        );




    return (

        <div
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >


            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-100
                    bg-slate-50
                    px-5
                    py-4
                "
            >

                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-indigo-600
                        text-white
                    "
                >

                    <SlidersHorizontal
                        size={19}
                    />

                </div>


                <div>

                    <h3
                        className="
                            text-sm
                            font-bold
                            text-slate-800
                        "
                    >

                        Filter Subjects

                    </h3>


                    <p
                        className="
                            text-xs
                            text-slate-500
                        "
                    >

                        Search and filter subjects

                    </p>


                </div>


            </div>





            {/* FILTER BODY */}


            <div
                className="
                    grid
                    grid-cols-1
                    gap-4
                    p-5
                    md:grid-cols-2
                    xl:grid-cols-4
                "
            >



                {/* SEARCH */}


                <div
                    className="
                        xl:col-span-2
                    "
                >


                    <label
                        className="
                            mb-2
                            block
                            text-xs
                            font-semibold
                            uppercase
                            text-slate-500
                        "
                    >

                        Search Subject

                    </label>



                    <div
                        className="
                            relative
                        "
                    >

                        <Search
                            size={18}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />


                        <input

                            type="search"

                            name="search"

                            value={
                                filters.search || ""
                            }


                            onChange={
                                handleChange
                            }


                            placeholder="Search by subject name or code"


                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                py-3
                                pl-10
                                pr-4
                                text-sm
                                outline-none
                                focus:border-indigo-500
                                focus:ring-4
                                focus:ring-indigo-100
                            "

                        />


                    </div>


                </div>






                {/* CLASS */}


                <div>


                    <label
                        className="
                            mb-2
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            uppercase
                            text-slate-500
                        "
                    >

                        <GraduationCap
                            size={14}
                        />

                        Class

                    </label>



                    <select

                        name="class_id"


                        value={
                            filters.class_id || ""
                        }


                        onChange={
                            handleChange
                        }


                        disabled={
                            classesLoading
                        }


                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            text-sm
                            outline-none
                            focus:border-indigo-500
                        "

                    >


                        <option value="">

                            {
                                classesLoading
                                ? 
                                "Loading..."
                                :
                                "All Classes"
                            }

                        </option>



                        {
                            classes.map(
                                (item)=>(

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
                            )
                        }


                    </select>


                </div>







                {/* STATUS */}


                <div>


                    <label
                        className="
                            mb-2
                            flex
                            items-center
                            gap-1
                            text-xs
                            font-semibold
                            uppercase
                            text-slate-500
                        "
                    >

                        <CircleCheck
                            size={14}
                        />

                        Status

                    </label>



                    <select


                        name="is_active"


                        value={
                            filters.is_active ?? ""
                        }


                        onChange={
                            handleChange
                        }


                        className="
                            w-full
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            text-sm
                            outline-none
                            focus:border-indigo-500
                        "

                    >


                        <option value="">

                            All Status

                        </option>


                        <option value="1">

                            Active

                        </option>


                        <option value="0">

                            Inactive

                        </option>


                    </select>


                </div>



            </div>







            {/* FOOTER */}


            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-t
                    bg-slate-50
                    px-5
                    py-3
                "
            >


                <p
                    className="
                        text-xs
                        text-slate-500
                    "
                >

                    {
                        hasActiveFilters

                        ?
                        "Filters applied"

                        :
                        "Showing all subjects"
                    }


                </p>



                <button

                    type="button"


                    onClick={
                        handleReset
                    }


                    disabled={
                        !hasActiveFilters
                    }


                    className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                    "

                >

                    <RotateCcw
                        size={16}
                    />

                    Reset

                </button>


            </div>


        </div>

    );


};


export default SubjectFilters;