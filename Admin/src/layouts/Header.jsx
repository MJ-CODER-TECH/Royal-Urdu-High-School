import {
    Search,
    Bell,
    MessageCircle,
    Maximize2,
    Minimize2,
    LogOut,
    User,
    ChevronDown,
    Menu,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import { logout } from "../redux/auth/authThunk";

const Header = ({ onMenuClick }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth.user);

    const [openProfile, setOpenProfile] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const profileRef = useRef(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keep fullscreen icon in sync with actual browser state
    useEffect(() => {
        const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handleFsChange);
        return () => document.removeEventListener("fullscreenchange", handleFsChange);
    }, []);

    const handleLogout = async () => {
        await dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
    };

    const handleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <header
            className="
                sticky
                top-0
                z-30
                flex
                h-16
                items-center
                justify-between
                gap-2
                border-b
                border-slate-200
                bg-white
                px-3
                shadow-sm
                sm:px-6
            "
        >
            {/* Left side: hamburger (mobile only) + search */}
            <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* Hamburger — mobile only, opens Sidebar's drawer */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    className="
                        shrink-0 rounded-lg p-2 text-slate-600
                        transition-colors hover:bg-slate-100 hover:text-slate-900
                        active:scale-95 md:hidden
                    "
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* Search */}
                <div className="relative w-full max-w-xs sm:w-96 sm:max-w-none">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-200
                            bg-slate-50
                            py-2
                            pl-10
                            pr-4
                            text-sm
                            text-slate-700
                            outline-none
                            transition-colors
                            placeholder:text-slate-400
                            focus:border-blue-400
                            focus:bg-white
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {/* Icon buttons group */}
                <div className="hidden items-center gap-1 sm:flex">
                    <button
                        className="
                            relative rounded-lg p-2.5 text-slate-500
                            transition-colors hover:bg-slate-100 hover:text-slate-900
                            active:scale-95
                        "
                        aria-label="Notifications"
                    >
                        <Bell size={20} />
                        {/* Notification badge — remove/wire to real count as needed */}
                        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    <button
                        className="
                            rounded-lg p-2.5 text-slate-500
                            transition-colors hover:bg-slate-100 hover:text-slate-900
                            active:scale-95
                        "
                        aria-label="Messages"
                    >
                        <MessageCircle size={20} />
                    </button>

                    <button
                        onClick={handleFullscreen}
                        className="
                            rounded-lg p-2.5 text-slate-500
                            transition-colors hover:bg-slate-100 hover:text-slate-900
                            active:scale-95
                        "
                        aria-label="Toggle fullscreen"
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>

                {/* Divider */}
                <div className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <button
                        onClick={() => setOpenProfile((prev) => !prev)}
                        className="
                            flex items-center gap-2 rounded-lg p-1.5
                            transition-colors hover:bg-slate-100
                        "
                    >
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name || "Admin"}&background=1e293b&color=fff`}
                            alt="profile"
                            className="h-9 w-9 shrink-0 rounded-full ring-2 ring-slate-100 sm:h-10 sm:w-10"
                        />

                        {/* Name/role — hidden on small screens to save space */}
                        <div className="hidden text-left leading-tight sm:block">
                            <p className="text-sm font-semibold text-slate-900">
                                {user?.name || "Administrator"}
                            </p>

                            <p className="text-xs text-slate-500">
                                {user?.role || "Super Admin"}
                            </p>
                        </div>

                        <ChevronDown
                            size={18}
                            className={`hidden text-slate-400 transition-transform duration-200 sm:block ${
                                openProfile ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    <div
                        className={`
                            absolute right-0 z-40 mt-2 w-56 origin-top-right
                            rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg
                            transition-all duration-150 ease-out
                            ${
                                openProfile
                                    ? "visible translate-y-0 opacity-100"
                                    : "invisible -translate-y-1 opacity-0"
                            }
                        `}
                    >
                        {/* Mobile-only name/role inside dropdown, since it's hidden in the trigger */}
                        <div className="border-b border-slate-100 px-3 py-2 sm:hidden">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user?.name || "Administrator"}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {user?.email || user?.role || "admin@example.com"}
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                navigate("/profile");
                                setOpenProfile(false);
                            }}
                            className="
                                flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
                                text-sm text-slate-700 transition-colors hover:bg-slate-50
                            "
                        >
                            <User size={17} />
                            My Profile
                        </button>

                        <button
                            onClick={handleLogout}
                            className="
                                flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
                                text-sm text-red-600 transition-colors hover:bg-red-50
                            "
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;