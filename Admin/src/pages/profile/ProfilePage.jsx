import { 
    User,
    Mail,
    Shield,
    Calendar,
    CheckCircle,
    KeyRound
} from "lucide-react";

import { useSelector } from "react-redux";

const ProfilePage = () => {
    const user = useSelector(
        state => state.auth.user
    );

    if(!user){
        return (
            <div className="p-6 text-center text-slate-500">
                No profile data found.
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    My Profile
                </h1>
                <p className="text-sm text-slate-500">
                    Manage your account information
                </p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600 shadow-inner">
                        {
                            user?.name
                            ?.charAt(0)
                            ?.toUpperCase()
                        }
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl font-bold text-slate-800">
                            {user.name}
                        </h2>

                        <p className="text-sm text-slate-500 font-medium">
                            @{user.username}
                        </p>

                        <div className="mt-3 flex flex-wrap justify-center md:justify-start gap-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold">
                                {user.role}
                            </span>

                            {
                                user.isActive !== false && (
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-xs font-semibold flex items-center gap-1.5">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                                        Active
                                    </span>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                    icon={<Mail size={20}/>}
                    title="Email"
                    value={
                        user.email || "Not Available"
                    }
                />

                <InfoCard
                    icon={<User size={20}/>}
                    title="Username"
                    value={
                        user.username
                    }
                />

                <InfoCard
                    icon={<Shield size={20}/>}
                    title="Role"
                    value={
                        user.role
                    }
                />

                <InfoCard
                    icon={<Calendar size={20}/>}
                    title="Last Login"
                    value={
                        user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "First Login"
                    }
                />
            </div>

            {/* Permissions */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-2">
                            <KeyRound size={18} className="text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Permissions
                        </h2>
                    </div>

                    <span className="bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                        {
                            user.permissions?.length || 0
                        } Total
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {
                        user.permissions?.map(
                            permission => (
                                <span
                                    key={permission}
                                    className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium"
                                >
                                    {permission}
                                </span>
                            )
                        )
                    }
                </div>
            </div>
        </div>
    );
};

const InfoCard = ({
    icon,
    title,
    value
}) => {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex gap-4 items-center shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                {icon}
            </div>

            <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-500">
                    {title}
                </p>
                <p className="font-semibold text-slate-800 text-sm truncate">
                    {value}
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;