import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
    createUser,
    updateUser,
    getRoles,
} from "../../redux/user/userThunk";

const schema = (isEdit) =>
    z
        .object({
            username: z
                .string()
                .min(3, "Username is required"),

            name: z
                .string()
                .min(3, "Name is required"),

            email: z
                .string()
                .email("Invalid Email")
                .optional()
                .or(z.literal("")),

            roleId: z.coerce
                .number()
                .min(1, "Role is required"),

            password: isEdit
                ? z.string().optional()
                : z.string().min(6, "Password is required (min 6 characters)"),

            confirmPassword: z
                .string()
                .optional(),

            isActive: z.boolean(),
        })
        .refine(
            (data) => {
                if (data.password) {
                    return data.password === data.confirmPassword;
                }
                return true;
            },
            {
                path: ["confirmPassword"],
                message: "Passwords do not match",
            }
        );

const UserForm = ({ user, onClose }) => {
    const dispatch = useDispatch();
    const { roles, submitting } = useSelector((state) => state.user);

    const isEdit = !!user;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema(isEdit)),
        defaultValues: {
            username: "",
            name: "",
            email: "",
            roleId: "",
            password: "",
            confirmPassword: "",
            isActive: true,
        },
    });

    useEffect(() => {
        dispatch(getRoles());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            reset({
                username: user.username || "",
                name: user.name || "",
                email: user.email || "",
                roleId: user.role_id || user.roleId || "",
                password: "",
                confirmPassword: "",
                isActive: user.isActive ?? user.is_active ?? true,
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        const payload = {
            username: data.username,
            name: data.name,
            email: data.email,
            role_id: Number(data.roleId),
            is_active: data.isActive,
        };

        if (data.password) {
            payload.password = data.password;
        }

        if (user) {
            await dispatch(
                updateUser({
                    id: user.user_id || user.id,
                    data: payload,
                })
            );
        } else {
            await dispatch(createUser(payload));
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Username */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Username
                </label>
                <input
                    {...register("username")}
                    placeholder="Enter username"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.username && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* Name */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full Name
                </label>
                <input
                    {...register("name")}
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.name && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Email */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email Address
                </label>
                <input
                    type="email"
                    {...register("email")}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.email && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Role */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Role
                </label>
                <select
                    {...register("roleId")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                    <option value="">Select Role</option>
                    {roles?.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                            {role.role_name}
                        </option>
                    ))}
                </select>
                {errors.roleId && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.roleId.message}
                    </p>
                )}
            </div>

            {/* Password */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                </label>
                <input
                    type="password"
                    placeholder={
                        user
                            ? "Leave blank to keep current password"
                            : "Enter password"
                    }
                    {...register("password")}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.password && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                    Confirm Password
                </label>
                <input
                    type="password"
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            {/* Active Status Checkbox */}
            <div className="flex items-center gap-2 pt-1">
                <input
                    type="checkbox"
                    id="isActive"
                    {...register("isActive")}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Active User
                </label>
            </div>

            {/* Footer / Actions */}
            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 mt-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {submitting
                        ? "Saving..."
                        : user
                        ? "Update User"
                        : "Create User"}
                </button>
            </div>
        </form>
    );
};

export default UserForm;