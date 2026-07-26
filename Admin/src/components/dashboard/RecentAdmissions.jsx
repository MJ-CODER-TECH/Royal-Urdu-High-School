import { UserPlus } from "lucide-react";

const RecentAdmissions = ({ students = [] }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Recent Admissions
                    </h2>
                    <p className="text-sm text-slate-500">
                        Last 5 admitted students
                    </p>
                </div>

                <div className="rounded-full bg-blue-50 p-2.5">
                    <UserPlus size={20} className="text-blue-600" />
                </div>
            </div>

            {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                    <UserPlus size={28} strokeWidth={1.5} />
                    <p className="text-sm">No recent admissions found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Admission No
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Roll No
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Student
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {students.map((student, i) => (
                                    <tr
                                        key={student.student_id}
                                        className={`
                                            transition-colors hover:bg-slate-50
                                            ${i !== students.length - 1 ? "border-b border-slate-100" : ""}
                                        `}
                                    >
                                        <td className="px-3 py-3 text-sm text-slate-600">
                                            {student.admission_no}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-slate-600">
                                            {student.roll_no}
                                        </td>
                                        <td className="px-3 py-3 text-sm font-medium text-slate-900">
                                            {student.student_name}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-slate-500">
                                            {student.created_at
                                                ? new Date(student.created_at).toLocaleDateString("en-IN")
                                                : "-"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentAdmissions;