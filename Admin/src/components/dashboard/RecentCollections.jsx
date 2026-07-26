import { IndianRupee } from "lucide-react";

const RecentCollections = ({ collections = [] }) => {
    const formatCurrency = (amount) =>
        `₹${Number(amount || 0).toLocaleString("en-IN")}`;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Recent Fee Collections
                    </h2>
                    <p className="text-sm text-slate-500">Last 5 fee receipts</p>
                </div>

                <div className="rounded-full bg-green-50 p-2.5">
                    <IndianRupee size={20} className="text-green-600" />
                </div>
            </div>

            {collections.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-slate-400">
                    <IndianRupee size={28} strokeWidth={1.5} />
                    <p className="text-sm">No fee collections found</p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-lg border border-slate-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50">
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Receipt ID
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Student
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Amount
                                    </th>
                                    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Payment Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {collections.map((item, i) => (
                                    <tr
                                        key={item.collection_id}
                                        className={`
                                            transition-colors hover:bg-slate-50
                                            ${i !== collections.length - 1 ? "border-b border-slate-100" : ""}
                                        `}
                                    >
                                        <td className="px-3 py-3 text-sm font-medium text-slate-900">
                                            #{item.collection_id}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-slate-600">
                                            {item.student_name}
                                        </td>
                                        <td className="px-3 py-3 text-sm font-semibold text-green-600">
                                            {formatCurrency(item.total_amount)}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-slate-500">
                                            {item.payment_date
                                                ? new Date(item.payment_date).toLocaleDateString("en-IN")
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

export default RecentCollections;