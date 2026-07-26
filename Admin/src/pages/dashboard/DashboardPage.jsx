import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { getDashboard } from "../../redux/dashboard/dashboardThunk";

import DashboardCards from "../../components/dashboard/DashboardCard";
import AttendanceChart from "../../components/dashboard/AttendanceChart";
import FeeCollectionChart from "../../components/dashboard/FeeCollectionChart";
import RecentAdmissions from "../../components/dashboard/RecentAdmissions";
import RecentCollections from "../../components/dashboard/RecentCollections";
import LowAttendanceTable from "../../components/dashboard/LowAttendanceTable";

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
};

const DashboardPage = () => {
    const dispatch = useDispatch();

    const { dashboard, loading, error } = useSelector((state) => state.dashboard);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getDashboard());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
                    <div className="h-4 w-64 animate-pulse rounded-lg bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                            <div className="mb-4 h-3 w-24 animate-pulse rounded bg-slate-100" />
                            <div className="flex items-center justify-between">
                                <div className="h-7 w-14 animate-pulse rounded bg-slate-200" />
                                <div className="h-11 w-11 animate-pulse rounded-xl bg-slate-100" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-80 animate-pulse rounded-xl border border-slate-200 bg-white" />
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex max-w-sm flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                        <AlertTriangle size={26} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Couldn't load dashboard
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {typeof error === "string"
                                ? error
                                : error?.message || "Something went wrong. Please try again."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => dispatch(getDashboard())}
                        className="
                            flex items-center gap-2 rounded-lg border border-slate-200
                            bg-white px-4 py-2 text-sm font-medium text-slate-700
                            transition-colors hover:bg-slate-50
                        "
                    >
                        <RefreshCw size={15} />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
          {/* Header */}
<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Dashboard
        </h1>
        <p className="text-sm text-slate-500 ">
            Welcome to the dashboard, <span className="italic font-bold">{user?.name || "Administrator"}</span> 
        </p>
    </div>

    {/* <span
        className="
            w-fit shrink-0 rounded-full bg-blue-50 px-3 py-1.5
            text-xs font-semibold text-blue-700
        "
    >
        {user?.role || "Super Admin"}
    </span> */}
</div>
            {/* Cards */}
            <DashboardCards dashboard={dashboard} />

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <AttendanceChart attendance={dashboard.attendance || {}} />
                <FeeCollectionChart fees={dashboard.fees || {}} />
            </div>

            {/* Recent Data */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentAdmissions students={dashboard.recentAdmissions || []} />
                <RecentCollections collections={dashboard.recentCollections || []} />
            </div>

            {/* Low Attendance */}
            <LowAttendanceTable students={dashboard.lowAttendance || []} />
        </div>
    );
};

export default DashboardPage;