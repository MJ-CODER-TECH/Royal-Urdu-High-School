import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
import { IndianRupee } from "lucide-react";

const FeeCollectionChart = ({ fees = {} }) => {
    const data = [
        { name: "Today", amount: Number(fees.todayCollection || 0) },
        { name: "Month", amount: Number(fees.monthlyCollection || 0) },
        { name: "Pending", amount: Number(fees.pending || 0) },
    ];

    const formatCurrency = (value) =>
        `₹${Number(value).toLocaleString("en-IN")}`;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Fee Collection
                    </h2>
                    <p className="text-sm text-slate-500">
                        Today's, Monthly & Pending Fee
                    </p>
                </div>

                <div className="rounded-full bg-amber-50 p-2.5">
                    <IndianRupee size={20} className="text-amber-600" />
                </div>
            </div>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fontSize: 12, fill: "#64748b" }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: "#f8fafc" }}
                            contentStyle={{
                                borderRadius: "8px",
                                border: "1px solid #e2e8f0",
                                fontSize: "13px",
                            }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#1e293b" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4 text-center">
                <div>
                    <p className="text-xs text-slate-500">Today</p>
                    <p className="mt-0.5 font-bold text-green-600">
                        {formatCurrency(fees.todayCollection || 0)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500">Monthly</p>
                    <p className="mt-0.5 font-bold text-blue-600">
                        {formatCurrency(fees.monthlyCollection || 0)}
                    </p>
                </div>

                <div>
                    <p className="text-xs text-slate-500">Pending</p>
                    <p className="mt-0.5 font-bold text-red-600">
                        {formatCurrency(fees.pending || 0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FeeCollectionChart;