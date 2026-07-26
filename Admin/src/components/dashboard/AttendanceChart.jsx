import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { ClipboardCheck } from "lucide-react";

const COLORS = ["#22c55e", "#ef4444"];

const AttendanceChart = ({ attendance = {} }) => {
    const data = [
        { name: "Present", value: Number(attendance.present || 0) },
        { name: "Absent", value: Number(attendance.absent || 0) },
    ];

    const hasData = data.some((d) => d.value > 0);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Today's Attendance
                    </h2>
                    <p className="text-sm text-slate-500">
                        Present vs Absent Students
                    </p>
                </div>

                <div className="rounded-full bg-emerald-50 p-2.5">
                    <ClipboardCheck size={20} className="text-emerald-600" />
                </div>
            </div>

            <div className="h-80">
                {hasData ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                innerRadius={60}
                                paddingAngle={2}
                                label
                            >
                                {data.map((entry, index) => (
                                    <Cell key={index} fill={COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "8px",
                                    border: "1px solid #e2e8f0",
                                    fontSize: "13px",
                                }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                        <ClipboardCheck size={32} strokeWidth={1.5} />
                        <p className="text-sm">No attendance marked yet today</p>
                    </div>
                )}
            </div>

            <div className="mt-4 grid grid-cols-4 gap-4 border-t border-slate-100 pt-4 text-center">
                <div>
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="mt-0.5 font-bold text-blue-600">
                        {attendance.totalStudents || 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500">Present</p>
                    <p className="mt-0.5 font-bold text-green-600">
                        {attendance.present || 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500">Absent</p>
                    <p className="mt-0.5 font-bold text-red-600">
                        {attendance.absent || 0}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500">%</p>
                    <p className="mt-0.5 font-bold text-indigo-600">
                        {attendance.percentage || 0}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AttendanceChart;