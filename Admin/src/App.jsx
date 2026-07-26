import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession } from "./redux/auth/authThunk";

function App() {
    const dispatch = useDispatch();
    const checkingAuth = useSelector((state) => state.auth.checkingAuth);

    useEffect(() => {
        dispatch(restoreSession());
    }, [dispatch]);

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <Toaster position="top-right" />
            <AppRoutes />
        </>
    );
}

export default App;