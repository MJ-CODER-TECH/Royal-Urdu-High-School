import React from "react";

import {
    Edit,
    Trash2,
    BookOpen,
} from "lucide-react";


const SubjectTable = ({
    subjects = [],
    onEdit,
    onDelete,
    canUpdate = true,
    canDelete = true,
}) => {


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


            {/* Header */}

            <div
                className="
                    flex
                    items-center
                    gap-3
                    border-b
                    border-slate-100
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
                        bg-indigo-50
                        text-indigo-600
                    "
                >

                    <BookOpen size={20}/>

                </div>


                <div>

                    <h2
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        Subject List
                    </h2>


                    <p
                        className="
                            text-sm
                            text-slate-500
                        "
                    >
                        Showing {subjects.length} subjects
                    </p>

                </div>


            </div>



            {/* Table */}

            <div
                className="
                    overflow-x-auto
                "
            >

                <table
                    className="
                        min-w-full
                        text-sm
                    "
                >


                    <thead>

                        <tr
                            className="
                                border-b
                                border-slate-200
                                bg-slate-50
                            "
                        >

                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                #
                            </th>


                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                Subject
                            </th>


                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                Class
                            </th>


                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                Code
                            </th>


                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                Theory
                            </th>


                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                Practical
                            </th>


                            <th className="px-5 py-3 text-left font-semibold text-slate-600">
                                Status
                            </th>


                            <th className="px-5 py-3 text-center font-semibold text-slate-600">
                                Actions
                            </th>


                        </tr>


                    </thead>



                    <tbody>


                    {
                        subjects.length === 0 ? (

                            <tr>

                                <td
                                    colSpan="8"
                                    className="
                                        px-5
                                        py-10
                                        text-center
                                        text-slate-500
                                    "
                                >

                                    No subjects found.

                                </td>

                            </tr>

                        )

                        :

                        (

                            subjects.map(
                                (
                                    subject,
                                    index
                                ) => (


                                    <tr

                                        key={
                                            subject.subject_id
                                        }

                                        className="
                                            border-b
                                            border-slate-100
                                            hover:bg-slate-50
                                        "

                                    >


                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-slate-600
                                            "
                                        >

                                            {
                                                index + 1
                                            }

                                        </td>



                                        <td
                                            className="
                                                px-5
                                                py-4
                                                font-semibold
                                                text-slate-900
                                            "
                                        >

                                            {
                                                subject.subject_name
                                            }

                                        </td>



                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-slate-700
                                            "
                                        >

                                            {
                                                subject.class_name || "-"
                                            }

                                        </td>



                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-slate-700
                                            "
                                        >

                                            {
                                                subject.short_code || "-"
                                            }

                                        </td>



                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-slate-700
                                            "
                                        >

                                            {
                                                subject.theory_marks ?? 0
                                            }

                                        </td>



                                        <td
                                            className="
                                                px-5
                                                py-4
                                                text-slate-700
                                            "
                                        >

                                            {
                                                subject.practical_marks ?? 0
                                            }

                                        </td>



                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >

                                            {
                                                Number(
                                                    subject.is_active
                                                ) === 1

                                                ?

                                                (

                                                    <span
                                                        className="
                                                            rounded-full
                                                            bg-emerald-100
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-emerald-700
                                                        "
                                                    >
                                                        Active
                                                    </span>

                                                )

                                                :

                                                (

                                                    <span
                                                        className="
                                                            rounded-full
                                                            bg-red-100
                                                            px-3
                                                            py-1
                                                            text-xs
                                                            font-semibold
                                                            text-red-700
                                                        "
                                                    >
                                                        Inactive
                                                    </span>

                                                )

                                            }

                                        </td>




                                        {/* ACTIONS */}

                                        <td
                                            className="
                                                px-5
                                                py-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    justify-center
                                                    gap-2
                                                "
                                            >


                                                {
                                                    canUpdate && (

                                                        <button

                                                            type="button"

                                                            onClick={() =>
                                                                onEdit(subject)
                                                            }

                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-blue-50
                                                                text-blue-600
                                                                transition
                                                                hover:bg-blue-100
                                                            "

                                                            title="Edit Subject"

                                                        >

                                                            <Edit size={17}/>

                                                        </button>

                                                    )
                                                }





                                                {
                                                    canDelete && (

                                                        <button

                                                            type="button"

                                                            onClick={() =>
                                                                onDelete(
                                                                    subject.subject_id
                                                                )
                                                            }

                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-red-50
                                                                text-red-600
                                                                transition
                                                                hover:bg-red-100
                                                            "

                                                            title="Delete Subject"

                                                        >

                                                            <Trash2 size={17}/>


                                                        </button>

                                                    )
                                                }


                                            </div>


                                        </td>



                                    </tr>


                                )

                            )

                        )

                    }


                    </tbody>



                </table>


            </div>


        </div>

    );

};


export default SubjectTable;