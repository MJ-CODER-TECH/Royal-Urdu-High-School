import React, {
    useEffect,
    useState,
} from "react";


import {
    Plus,
    RefreshCcw,
} from "lucide-react";


import {
    useDispatch,
    useSelector,
} from "react-redux";


import SubjectTable from "./SubjectTable";
import SubjectModal from "./SubjectModal";
import SubjectFilters from "./SubjectFilters";


import {
    fetchSubjects,
    deleteSubject,
} from "../../redux/subject/subjectThunk";



const SubjectPage = () => {


    const dispatch = useDispatch();



    const {
        subjects = [],
        loading,
    } = useSelector(
        (state) => state.subject
    );



    const [
        isModalOpen,
        setIsModalOpen
    ] = useState(false);



    const [
        selectedSubject,
        setSelectedSubject
    ] = useState(null);





    // ==================================
    // FILTER STATE
    // ==================================

    const [
        filters,
        setFilters
    ] = useState({

        search: "",

        class_id: "",

        is_active: "",

    });







    // ==================================
    // LOAD SUBJECTS
    // ==================================

    useEffect(()=>{


        dispatch(
            fetchSubjects()
        );


    },[
        dispatch
    ]);








    // ==================================
    // FILTER LOGIC
    // ==================================

    const filteredSubjects =

        subjects.filter(
            (item)=>{


                const searchText =
                    filters.search
                        .toLowerCase();



                const searchMatch =


                    item.subject_name
                        ?.toLowerCase()
                        .includes(
                            searchText
                        )


                    ||

                    item.short_code
                        ?.toLowerCase()
                        .includes(
                            searchText
                        );





                const classMatch =


                    filters.class_id


                    ?


                    String(
                        item.class_id
                    )
                    ===
                    String(
                        filters.class_id
                    )


                    :


                    true;







                const statusMatch =


                    filters.is_active !== ""


                    ?


                    String(
                        item.is_active
                    )
                    ===
                    String(
                        filters.is_active
                    )


                    :


                    true;







                return (

                    searchMatch

                    &&

                    classMatch

                    &&

                    statusMatch

                );


            }

        );









    // ==================================
    // ADD SUBJECT
    // ==================================

    const handleAdd = ()=>{


        setSelectedSubject(null);


        setIsModalOpen(true);


    };








    // ==================================
    // EDIT SUBJECT
    // ==================================

    const handleEdit = (
        subject
    )=>{


        setSelectedSubject(
            subject
        );


        setIsModalOpen(true);


    };









    // ==================================
    // DELETE SUBJECT
    // ==================================

    const handleDelete = async(
        id
    )=>{


        const confirmDelete =

            window.confirm(
                "Are you sure you want to delete this subject?"
            );



        if(!confirmDelete){

            return;

        }





        try{


            await dispatch(
                deleteSubject(id)
            )
            .unwrap();




            dispatch(
                fetchSubjects()
            );



        }
        catch(error){


            console.error(
                "Delete failed:",
                error
            );


        }



    };









    // ==================================
    // AFTER SAVE
    // ==================================

    const handleSuccess = ()=>{


        setIsModalOpen(false);


        setSelectedSubject(null);



        dispatch(
            fetchSubjects()
        );


    };








    // ==================================
    // RESET FILTER
    // ==================================

    const handleReset = ()=>{


        setFilters({

            search:"",

            class_id:"",

            is_active:"",

        });


    };








    return (


        <div
            className="
                space-y-6
            "
        >




            {/* HEADER */}


            <div
                className="
                    flex
                    flex-col
                    gap-4
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >


                <div>


                    <h1
                        className="
                            text-2xl
                            font-bold
                            text-slate-900
                        "
                    >

                        Subject Management

                    </h1>



                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >

                        Manage subjects, marks and class mapping.

                    </p>


                </div>






                <div
                    className="
                        flex
                        gap-3
                    "
                >




                    <button

                        type="button"


                        onClick={()=>


                            dispatch(
                                fetchSubjects()
                            )


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
                            py-2.5
                            text-sm
                            font-semibold
                            text-slate-700
                            hover:bg-slate-50
                        "

                    >


                        <RefreshCcw size={17}/>


                        Refresh


                    </button>








                    <button


                        type="button"


                        onClick={
                            handleAdd
                        }


                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-blue-600
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-white
                            hover:bg-blue-700
                        "


                    >


                        <Plus size={17}/>


                        Add Subject


                    </button>



                </div>



            </div>









            {/* FILTER */}



            <SubjectFilters

                filters={
                    filters
                }


                setFilters={
                    setFilters
                }


            />









            {/* TABLE */}



            <SubjectTable


                subjects={
                    filteredSubjects
                }



                onEdit={
                    handleEdit
                }



                onDelete={
                    handleDelete
                }



            />









            {/* MODAL */}



            <SubjectModal


                isOpen={
                    isModalOpen
                }



                onClose={()=>{


                    setIsModalOpen(false);


                    setSelectedSubject(null);


                }}




                selectedSubject={
                    selectedSubject
                }




                onSuccess={
                    handleSuccess
                }



            />



        </div>


    );

};



export default SubjectPage;