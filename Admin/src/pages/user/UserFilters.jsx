import { Search } from "lucide-react";
import { useSelector } from "react-redux";

const UserFilters = ({
    search,
    setSearch,
    roleId,
    setRoleId,
    status,
    setStatus,
}) => {
    const { roles } = useSelector((state) => state.user);

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="grid gap-4 md:grid-cols-3">
                {/* Search */}
                <div className="relative">
                    <Search
                        size={18}
                        className="absolute left-3 top-2.5 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search username or name..."
                        className="w-full rounded-lg border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                {/* Role */}
                <select
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">All Roles</option>
                    {roles?.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                            {role.role_name}
                        </option>
                    ))}
                </select>

                {/* Status */}
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">All Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>
            </div>
        </div>
    );
};

export default UserFilters;