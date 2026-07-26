import { useSelector } from "react-redux";

const PermissionGuard = ({ permission, children }) => {

    const user = useSelector(state => state.auth.user);

    const permissions = user?.permissions || [];

    console.log("USER =>", user);
    console.log("PERMISSIONS =>", permissions);
    console.log("CHECK =>", permission);

    const hasPermission = permissions.includes(permission);

    if (!hasPermission) {
        return null;
    }

    return children;
};

export default PermissionGuard;