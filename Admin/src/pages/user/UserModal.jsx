import { X } from "lucide-react";
import UserForm from "./UserForm";

const UserModal = ({
    open,
    onClose,
    user,
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            {user ? "Edit User" : "Create User"}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {user
                                ? "Update user details and permissions."
                                : "Create a new system user profile."}
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[calc(100vh-150px)] overflow-y-auto p-6">
                    <UserForm
                        user={user}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserModal;