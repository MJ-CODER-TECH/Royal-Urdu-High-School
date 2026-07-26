import { Link } from "react-router-dom";
import {
    Users,
    ClipboardList,
    Receipt,
    GraduationCap,
    CalendarDays,
    FileText,
} from "lucide-react";

// Static data configuration moved outside the component to prevent re-creation on re-renders
const reports = [
    {
        title: "Student Report",
        description: "Student admission, class, section and academic year reports.",
        icon: Users,
        color: "bg-blue-100 text-blue-600",
        path: "/reports/students",
    },
    {
        title: "Attendance Report",
        description: "Daily and monthly attendance reports.",
        icon: ClipboardList,
        color: "bg-green-100 text-green-600",
        path: "/reports/attendance",
    },
    {
        title: "Fee Report",
        description: "Fee collection, pending and payment reports.",
        icon: Receipt,
        color: "bg-yellow-100 text-yellow-700",
        path: "/reports/fees",
    },
    {
        title: "Exam Report",
        description: "Marks, results and examination reports.",
        icon: GraduationCap,
        color: "bg-purple-100 text-purple-600",
        path: "/reports/exams",
    },
    {
        title: "Timetable Report",
        description: "Class and teacher timetable reports.",
        icon: CalendarDays,
        color: "bg-indigo-100 text-indigo-600",
        path: "/reports/timetable",
    },
    {
        title: "Certificate Report",
        description: "Bonafide, TC, LC and certificate reports.",
        icon: FileText,
        color: "bg-pink-100 text-pink-600",
        path: "/reports/certificates",
    },
];

const ReportsPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">
                    Reports Management
                </h1>
                <p className="mt-1 text-gray-500">
                    View, Print, Export PDF and Excel reports.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {reports.map((report) => {
                    const Icon = report.icon;

                    return (
                        <Link
                            key={report.title}
                            to={report.path}
                            className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className={`mb-4 inline-flex rounded-lg p-3 ${report.color}`}>
                                <Icon size={28} />
                            </div>

                            <h2 className="text-xl font-semibold">
                                {report.title}
                            </h2>

                            <p className="mt-2 text-sm text-gray-500">
                                {report.description}
                            </p>

                            <div className="mt-5 text-sm font-medium text-blue-600">
                                Open Report →
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default ReportsPage;