import { useState } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "./LoginSchema";
import logo from "../../assets/logo/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/auth/authThunk";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loading = useSelector((state) => state.auth.loading);
    const [showPassword, setShowPassword] = useState(false);

const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
} = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            remember: true,
        },
    });

const onSubmit = async (values) => {

    if (loading) return;

    const result = await dispatch(login(values));

    if (login.fulfilled.match(result)) {

        reset();

        const user = result.payload.user;

        toast.success(

            `Welcome ${user.name || user.username}`

        );

        navigate("/dashboard", {
            replace: true,
        });

    } else {

        toast.error(

            result.payload ||

            "Unable to login."

        );

    }

};

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
            <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
                {/* Left: form panel */}
                <div className="flex w-full flex-col justify-center px-8 py-10 sm:px-12 md:w-1/2">
                    {/* LOGO — swap this block with your own logo image/svg */}
                    <div className="mb-8 flex items-center gap-2">
                        {/* <img src="/logo.svg" alt="Academia" className="h-9 w-9" /> */}
                        <div className="flex h-15 w-15 items-center justify-center">
                            {/* placeholder mark — replace with your logo icon */}
                            {/* <span className="text-sm font-bold">A</span> */}
<img
    src={logo}
    alt="Royal Urdu High School"
    className="h-14 w-14 object-contain"
/>                        </div>
                        <div className="leading-tight">
                            <p className="text-lg font-extrabold tracking-wide text-slate-900">
                                ROYAL URDU HIGH SCHOOL
                            </p>
                            <p className="text-[10px] font-medium tracking-[0.2em] text-slate-400">
                                SCHOOL MANAGEMENT SYSTEM
                            </p>
                        </div>
                    </div>

                    <h1 className="mb-6 text-xl font-semibold text-slate-800">
                        Login to your account
                    </h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Username */}
                        <div>
                            <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                                <User size={18} className="shrink-0 text-slate-400" />
                             <input
    {...register("username")}
    autoFocus
    autoComplete="username"
    disabled={loading}
    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    placeholder="Enter Username"
/>
                            </div>
                            <p className="mt-1 text-sm text-red-500">
                                {errors.username?.message}
                            </p>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center gap-3 rounded-lg bg-slate-100 px-4 py-3 focus-within:ring-2 focus-within:ring-blue-500">
                                <Lock size={18} className="shrink-0 text-slate-400" />
                             <input
    {...register("password")}
    type={showPassword ? "text" : "password"}
    autoComplete="current-password"
    disabled={loading}
    className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    placeholder="Enter Password"
/>
                                <button
    type="button"
    disabled={loading}
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="shrink-0 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-red-500">
                                {errors.password?.message}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                            <input
    type="checkbox"
    disabled={loading}
    {...register("remember")}
    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
/>
                                Remember Me
                            </label>

                            {/* <button
                                type="button"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Forget Password?
                            </button> */}
                        </div>

                      <button
    type="submit"
    disabled={loading}
    className="flex w-full items-center justify-center rounded-lg bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
>

    {loading ? (

        <div className="flex items-center gap-2">

            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>

            <span>Signing In...</span>

        </div>

    ) : (

        "Login"

    )}

</button>
                    </form>
                </div>

                {/* Right: illustration panel */}
                <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-slate-100 md:flex">
                    <svg
                        viewBox="0 0 400 400"
                        className="h-full w-full"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* backdrop curve */}
                        <path d="M0 0 H400 V400 H120 C40 400 0 340 0 260 Z" fill="#E8EEF3" />

                        {/* sparkles */}
                        <g fill="#F2B84B">
                            <circle cx="70" cy="90" r="3" />
                            <circle cx="330" cy="60" r="3" />
                            <circle cx="350" cy="180" r="2.5" />
                        </g>
                        <g fill="#3FBFAE">
                            <circle cx="130" cy="60" r="2.5" />
                            <circle cx="60" cy="220" r="2.5" />
                        </g>
                        <g fill="#EF6C8E">
                            <circle cx="300" cy="120" r="2.5" />
                            <circle cx="90" cy="300" r="2.5" />
                        </g>

                        {/* book stack */}
                        <g>
                            <rect x="120" y="290" width="200" height="26" rx="6" fill="#F2B84B" />
                            <rect x="120" y="260" width="200" height="26" rx="6" fill="#3FBFAE" />
                            <rect x="120" y="230" width="200" height="26" rx="6" fill="#EF6C8E" />
                            <rect x="120" y="200" width="200" height="26" rx="6" fill="#2E3A59" />
                        </g>

                        {/* folder */}
                        <path
                            d="M90 340 L90 190 L150 190 L165 210 L230 210 L230 340 Z"
                            fill="#F2B84B"
                            opacity="0.9"
                        />

                        {/* laptop 1 */}
                        <g transform="translate(150,150)">
                            <rect x="0" y="0" width="60" height="38" rx="4" fill="#2E3A59" />
                            <rect x="4" y="4" width="52" height="26" rx="2" fill="#AFC6E0" />
                            <rect x="-4" y="38" width="68" height="6" rx="2" fill="#1E2740" />
                        </g>

                        {/* laptop 2 */}
                        <g transform="translate(250,130)">
                            <rect x="0" y="0" width="55" height="34" rx="4" fill="#2E3A59" />
                            <rect x="4" y="4" width="47" height="24" rx="2" fill="#AFC6E0" />
                            <rect x="-4" y="34" width="63" height="6" rx="2" fill="#1E2740" />
                        </g>

                        {/* leaves */}
                        <g fill="#3FBFAE" opacity="0.85">
                            <ellipse cx="80" cy="330" rx="20" ry="45" transform="rotate(-20 80 330)" />
                            <ellipse cx="60" cy="350" rx="16" ry="38" transform="rotate(10 60 350)" />
                        </g>
                        <g fill="#EF6C8E" opacity="0.85">
                            <ellipse cx="330" cy="330" rx="18" ry="42" transform="rotate(15 330 330)" />
                        </g>

                        {/* people (simple silhouettes, seated) */}
                        <g>
                            <circle cx="180" cy="130" r="14" fill="#EFB59B" />
                            <path d="M160 175 Q180 150 200 175 L200 210 L160 210 Z" fill="#EF6C8E" />
                        </g>
                        <g>
                            <circle cx="278" cy="110" r="13" fill="#EFB59B" />
                            <path d="M260 150 Q278 128 296 150 L296 180 L260 180 Z" fill="#3FBFAE" />
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default Login;