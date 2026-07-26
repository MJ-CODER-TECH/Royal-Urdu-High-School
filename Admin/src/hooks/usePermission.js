import { useSelector } from "react-redux";
import { useCallback, useMemo } from "react";

const usePermission = () => {

    const permissions = useSelector(
        (state) => state.auth.user?.permissions || []
    );

    const hasPermission = useCallback(
        (permission) => {
            if (!permission) return true;
            return permissions.includes(permission);
        },
        [permissions]
    );

    const hasAnyPermission = useCallback(
        (permissionList = []) => {
            return permissionList.some(permission =>
                permissions.includes(permission)
            );
        },
        [permissions]
    );

    const hasAllPermissions = useCallback(
        (permissionList = []) => {
            return permissionList.every(permission =>
                permissions.includes(permission)
            );
        },
        [permissions]
    );

    return useMemo(() => ({
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
    }), [permissions, hasPermission, hasAnyPermission, hasAllPermissions]);

};

export default usePermission;