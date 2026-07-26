import usePermission from "../../hooks/usePermission";

const ProtectedComponent = ({

    permission,

    children,

}) => {

    const canAccess =
        usePermission(permission);

    if (!canAccess) return null;

    return children;

};

export default ProtectedComponent;