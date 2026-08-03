import React, { useMemo, useState } from "react";

const StudentPromotionTable = ({
    students = [],
    selectedStudents = [],
    setSelectedStudents,
    loading = false
}) => {

    const [search, setSearch] = useState("");

    // ===========================================
    // Search Filter (name or admission no)
    // ===========================================

    const visibleStudents = useMemo(() => {

        const term = search.trim().toLowerCase();

        if (!term) return students;

        return students.filter((student) =>
            student.student_name?.toLowerCase().includes(term) ||
            String(student.admission_no ?? "").toLowerCase().includes(term)
        );

    }, [students, search]);

    // ===========================================
    // Select All (applies to visible/filtered rows)
    // ===========================================

    const handleSelectAll = (e) => {

        if (e.target.checked) {

            const merged = [
                ...selectedStudents,
                ...visibleStudents.filter(
                    (s) => !selectedStudents.some(
                        (sel) => sel.student_id === s.student_id
                    )
                )
            ];

            setSelectedStudents(merged);

        } else {

            setSelectedStudents(
                selectedStudents.filter(
                    (sel) => !visibleStudents.some(
                        (s) => s.student_id === sel.student_id
                    )
                )
            );

        }

    };

    // ===========================================
    // Select Single Student
    // ===========================================

    const handleSelectStudent = (student) => {

        const exists = selectedStudents.some(
            (item) => item.student_id === student.student_id
        );

        if (exists) {

            setSelectedStudents(
                selectedStudents.filter(
                    (item) => item.student_id !== student.student_id
                )
            );

        } else {

            setSelectedStudents([
                ...selectedStudents,
                student
            ]);

        }

    };

    const allVisibleSelected =
        visibleStudents.length > 0 &&
        visibleStudents.every((s) =>
            selectedStudents.some((sel) => sel.student_id === s.student_id)
        );

    // ===========================================
    // Loading
    // ===========================================

    if (loading) {

        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500">
                    Loading students...
                </p>
            </div>
        );

    }

    // ===========================================
    // Empty
    // ===========================================

    if (students.length === 0) {

        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-slate-500">
                    No students found. Choose a year, class and section above,
                    then load the list.
                </p>
            </div>
        );

    }

    return (

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">

                <h2 className="text-lg font-semibold text-slate-800">
                    Student List
                </h2>

                <div className="flex items-center gap-3">

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name or admission no"
                        className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none sm:w-56"
                    />

                    <span className="whitespace-nowrap rounded-lg bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
                        Selected: {selectedStudents.length}
                    </span>

                </div>

            </div>

            {visibleStudents.length === 0 ? (

                <p className="p-8 text-center text-slate-500">
                    No students match "{search}".
                </p>

            ) : (

                <>

                    {/* Mobile: card list */}

                    <div className="divide-y md:hidden">

                        <label className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600">
                            <input
                                type="checkbox"
                                checked={allVisibleSelected}
                                onChange={handleSelectAll}
                            />
                            Select all
                        </label>

                        {visibleStudents.map((student) => {

                            const checked = selectedStudents.some(
                                (item) => item.student_id === student.student_id
                            );

                            return (
                                <div
                                    key={student.student_id}
                                    className="flex items-start gap-3 px-4 py-3"
                                >
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleSelectStudent(student)}
                                        className="mt-1"
                                    />

                                    <div className="flex-1">
                                        <p className="font-medium text-slate-700">
                                            {student.student_name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            Roll No: {student.roll_no} · Admission: {student.admission_no}
                                        </p>
                                    </div>

                                    <span
                                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
                                            student.status === "Active"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {student.status}
                                    </span>
                                </div>
                            );

                        })}

                    </div>

                    {/* Desktop: table */}

                    <div className="hidden overflow-x-auto md:block">

                        <table className="min-w-full">

                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-4 py-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={allVisibleSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-left">Roll No</th>
                                    <th className="px-4 py-3 text-left">Admission No</th>
                                    <th className="px-4 py-3 text-left">Student Name</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {visibleStudents.map((student) => {

                                    const checked = selectedStudents.some(
                                        (item) => item.student_id === student.student_id
                                    );

                                    return (
                                        <tr
                                            key={student.student_id}
                                            className="border-b hover:bg-slate-50"
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={checked}
                                                    onChange={() => handleSelectStudent(student)}
                                                />
                                            </td>
                                            <td className="px-4 py-3">{student.roll_no}</td>
                                            <td className="px-4 py-3">{student.admission_no}</td>
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {student.student_name}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                        student.status === "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                </>

            )}

        </div>

    );

};

export default StudentPromotionTable;