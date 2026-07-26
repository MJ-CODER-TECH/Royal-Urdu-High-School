import { useNavigate } from "react-router-dom";
import {
    Users,
    UserCheck,
    UserX,
    GraduationCap,
    BookOpen,
    IndianRupee,
    ClipboardCheck,
    FileText,
} from "lucide-react";

const DashboardCards = ({ dashboard }) => {
    const navigate = useNavigate();

    const cards = [
        {
            title: "Total Students",
            value: dashboard.students?.total || 0,
            icon: Users,
            color: "bg-blue-500",
            path: "/students",
        },
        {
            title: "Active Students",
            value: dashboard.students?.active || 0,
            icon: UserCheck,
            color: "bg-green-500",
            path: "/students",
        },
        {
            title: "Inactive Students",
            value: dashboard.students?.inactive || 0,
            icon: UserX,
            color: "bg-red-500",
            path: "/students",
        },
        {
            title: "Total Users",
            value: dashboard.users?.total || 0,
            icon: Users,
            color: "bg-purple-500",
            path: "/users",
        },
        {
            title: "Classes",
            value: dashboard.classes?.total || 0,
            icon: GraduationCap,
            color: "bg-indigo-500",
            path: "/master/classes",
        },
        {
            title: "Today's Attendance",
            value: `${dashboard.attendance?.percentage || 0}%`,
            icon: ClipboardCheck,
            color: "bg-emerald-500",
            path: "/attendance",
        },
        {
            title: "Today's Collection",
            value: `₹${Number(dashboard.fees?.todayCollection || 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "bg-yellow-500",
            path: "/fees/fee-collection",
        },
        {
            title: "Pending Fees",
            value: `₹${Number(dashboard.fees?.pending || 0).toLocaleString("en-IN")}`,
            icon: IndianRupee,
            color: "bg-orange-500",
            path: "/fees/fee-collection",
        },
        {
            title: "Exams",
            value: dashboard.exams?.total || 0,
            icon: BookOpen,
            color: "bg-cyan-500",
            path: "/exam-management",
        },
        {
            title: "Results",
            value: dashboard.results?.total || 0,
            icon: FileText,
            color: "bg-pink-500",
            path: "/exam/result",
        },
        {
            title: "Certificates",
            value: dashboard.certificates?.total || 0,
            icon: FileText,
            color: "bg-slate-600",
            path: "/certificates",
        },
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card, index) => {
                const Icon = card.icon;

                return (
                    <button
                        key={index}
                        type="button"
                        onClick={() => card.path && navigate(card.path)}
                        className="
                            group rounded-xl border border-slate-200 bg-white p-5
                            text-left shadow-sm transition-all duration-200
                            hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md
                            focus:outline-none focus:ring-2 focus:ring-blue-200
                            active:translate-y-0 active:shadow-sm
                        "
                    >
                        <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm text-slate-500">
                                    {card.title}
                                </p>
                                <h2 className="mt-2 truncate text-2xl font-bold text-slate-900 sm:text-3xl">
                                    {card.value}
                                </h2>
                            </div>

                            <div
                                className={`
                                    shrink-0 rounded-xl p-3 text-white transition-transform
                                    duration-200 group-hover:scale-105 ${card.color}
                                `}
                            >
                                <Icon size={24} />
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default DashboardCards;