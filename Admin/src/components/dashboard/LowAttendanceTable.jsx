import { AlertTriangle } from "lucide-react";

const LowAttendanceTable = ({ students = [] }) => {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Low Attendance Students
                    </h2>
                    <p className="text-sm text-slate-500">
                        Students below 75% attendance
                    </p>
                </div>

                <div className="rounded-full bg-red-50 p-2.5">
                    <AlertTriangle size={20} className="text-red-600" />
                </div>
            </div>

            {students.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                    <AlertTriangle size={28} strokeWidth={1.5} />
                    <p className="text-sm">No low attendance students found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Roll No
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Student Name
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Attendance %
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
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
                                            {student.roll_no}
                                        </td>
                                        <td className="px-3 py-3 text-sm font-medium text-slate-900">
                                            {student.student_name}
                                        </td>
                                        <td className="px-3 py-3 text-sm font-semibold text-red-600">
                                            {student.attendance_percentage}%
                                        </td>
                                        <td className="px-3 py-3">
                                            <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                                                Low Attendance
                                            </span>
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

export default LowAttendanceTable;