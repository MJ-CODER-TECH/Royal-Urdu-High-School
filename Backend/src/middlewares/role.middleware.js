const ApiError = require("../utils/ApiError");

module.exports = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {

            return next(
                new ApiError(
                    401,
                    "Unauthorized."
                )
            );

        }

        if (!allowedRoles.includes(req.user.roleId)) {

            return next(
                new ApiError(
                    403,
                    "Access denied."
                )
            );

        }

        next();

    };

};