import { useState } from "react";
import {
    Pencil,
    Trash2,
    KeyRound,
    ChevronLeft,
    ChevronRight,
    Users,
} from "lucide-react";
import { useDispatch } from "react-redux";

import {
    getUsers,
    deleteUser,
    changeStatus,
} from "../../redux/user/userThunk";

import StatusBadge from "./StatusBadge";
import ResetPasswordModal from "./ResetPasswordModal";
import usePermission from "../../hooks/usePermission";

const columns = [
    "Username",
    "Role",
    "Status",
    "Last Login",
    "Actions",
];

const UserTable = ({
    users = [],
    loading,
    page,
    limit,
    total,
    setPage,
    onEdit,
}) => {
    const dispatch = useDispatch();

    const canEdit = usePermission("user.update");
    const canDelete = usePermission("user.delete");

    const [passwordUser, setPasswordUser] = useState(null);

    const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));
    const rows = Array.isArray(users) ? users : [];

    const handleDelete = (id) => {
        if (window.confirm("Delete this user? This action cannot be undone.")) {
            dispatch(deleteUser(id));
        }
    };

    const handleStatus = (user) => {
        dispatch(
            changeStatus({
                id: user.user_id,
                isActive: !user.is_active,
            })
        );
    };

    return (
        <>
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {columns.map((col, index) => (
                                    <th
                                        key={col}
                                        className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                                            index === columns.length - 1 ? "text-center" : "text-left"
                                        }`}
                                    >
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            {loading &&
                                Array.from({ length: 6 }).map((_, i) => (
                                    <tr key={i} className="border-b border-slate-100">
                                        {columns.map((_, j) => (
                                            <td key={j} className="px-4 py-3.5">
                                                <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100" />
                                            </td>
                                        ))}
                                    </tr>
                                ))}

                            {!loading && rows.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length} className="py-16">
                                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                                            <Users size={30} strokeWidth={1.5} />
                                            <p className="text-sm">No users found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                rows.map((user, i) => (
                                    <tr
                                        key={user.user_id}
                                        className={`
                                            transition-colors hover:bg-slate-50
                                            ${i !== rows.length - 1 ? "border-b border-slate-100" : ""}
                                        `}
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-slate-900">
                                            {user.username}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {user.role_name}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleStatus(user)}
                                                className="focus:outline-none"
                                            >
                                                <StatusBadge active={!!user.is_active} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {user.last_login || "-"}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                {canEdit && (
                                                    <button
                                                        onClick={() => onEdit(user)}
                                                        title="Edit User"
                                                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>
                                                )}
                                                {canEdit && (
                                                    <button
                                                        onClick={() => setPasswordUser(user)}
                                                        title="Reset Password"
                                                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                                    >
                                                        <KeyRound size={17} />
                                                    </button>
                                                )}
                                                {canDelete && (
                                                    <button
                                                        onClick={() => handleDelete(user.user_id)}
                                                        title="Delete User"
                                                        className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3.5 sm:flex-row">
                    <span className="text-sm text-slate-500">
                        Total: <span className="font-medium text-slate-900">{total || 0}</span> users
                    </span>

                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="
                                rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors
                                hover:bg-slate-50 hover:text-slate-900
                                disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
                            "
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <span className="min-w-[70px] text-center text-sm text-slate-600">
                            {page} / {totalPages}
                        </span>

                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="
                                rounded-lg border border-slate-200 p-2 text-slate-500 transition-colors
                                hover:bg-slate-50 hover:text-slate-900
                                disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent
                            "
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            </div>

            {passwordUser && (
                <ResetPasswordModal
                    user={passwordUser}
                    open={true}
                    onClose={() => setPasswordUser(null)}
                />
            )}
        </>
    );
};

export default UserTable;