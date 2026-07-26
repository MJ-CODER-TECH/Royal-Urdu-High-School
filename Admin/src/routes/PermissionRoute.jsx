import Navigate from "react-router-dom";
import usePermission from "../hooks/usePermission";

const PermissionRoute = ({

    permission,

    children,

}) => {

    const allowed =
        usePermission(permission);

    if (!allowed) {

        return null;

    }

    return children;

};

export default PermissionRoute;