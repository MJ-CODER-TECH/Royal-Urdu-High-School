const ApiError = require("../utils/ApiError");

module.exports = (...requiredPermissions) => {

    return (req, res, next) => {

        if (!req.user) {

            return next(
                new ApiError(401, "Unauthorized")
            );

        }

        const permissions = req.user.permissions || [];

        const allowed = requiredPermissions.every(permission =>
            permissions.includes(permission)
        );

        if (!allowed) {

            return next(
                new ApiError(
                    403,
                    "Permission denied."
                )
            );

        }

        next();

    };

};