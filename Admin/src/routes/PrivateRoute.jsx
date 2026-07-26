import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ requiredPermission }) => {
    const { isAuthenticated, checkingAuth, user } = useSelector((state) => state.auth);

    if (checkingAuth) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Optional: block access if route needs a specific permission user doesn't have
    if (requiredPermission && !user?.permissions?.includes(requiredPermission)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;