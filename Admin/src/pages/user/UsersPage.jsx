import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus } from "lucide-react";

import { getUsers, getRoles } from "../../redux/user/userThunk";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import UserFilters from "./UserFilters";
import usePermission from "../../hooks/usePermission";

const UsersPage = () => {
    const dispatch = useDispatch();
    const canCreate = usePermission("user.create");

    const {
        users,
        loading,
        pagination,
    } = useSelector((state) => state.user);

    const {
        limit,
        total,
    } = pagination || {};

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [roleId, setRoleId] = useState("");
    const [status, setStatus] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const query = useMemo(() => ({
        page,
        limit,
        search,
        roleId,
        status,
    }), [
        page,
        limit,
        search,
        roleId,
        status,
    ]);

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    // Reset to page 1 whenever a filter changes
    useEffect(() => {
        setPage(1);
    }, [
        search,
        roleId,
        status,
    ]);

    useEffect(() => {
        dispatch(getUsers(query));
    }, [
        dispatch,
        query
    ]);

    const handleAdd = () => {
        setSelectedUser(null);
        setOpenModal(true);
    };

    const handleEdit = (row) => {
        setSelectedUser(row);
        setOpenModal(true);
    };

    const handleClose = () => {
        setSelectedUser(null);
        setOpenModal(false);
    };

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        User Management
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Manage all ERP system users and permissions.
                    </p>
                </div>

                {canCreate && (
                    <button
                        onClick={handleAdd}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <Plus size={18} />
                        Add User
                    </button>
                )}
            </div>

            {/* Filters Section */}
            <UserFilters
                search={search}
                setSearch={setSearch}
                roleId={roleId}
                setRoleId={setRoleId}
                status={status}
                setStatus={setStatus}
            />

            {/* Table Section */}
            <UserTable
                users={users}
                loading={loading}
                page={page}
                limit={limit || 10}
                total={total || 0}
                setPage={setPage}
                onEdit={handleEdit}
            />

            {/* Modal */}
            {openModal && (
                <UserModal
                    open={openModal}
                    onClose={handleClose}
                    user={selectedUser}
                />
            )}
        </div>
    );
};

export default UsersPage;