import usePermission from "../../hooks/usePermission";

const ProtectedButton = ({

    permission,

    children,

}) => {

    const canAccess =
        usePermission(permission);

    if (!canAccess) return null;

    return children;

};

export default ProtectedButton;