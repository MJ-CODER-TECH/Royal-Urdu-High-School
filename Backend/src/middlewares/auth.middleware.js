const ApiError = require("../utils/ApiError");
const tokenUtil = require("../utils/generateToken");

module.exports = (req, res, next) => {

    const authHeader =
        req.headers.authorization;

    if (!authHeader) {

        return next(
            new ApiError(
                401,
                "Access token is required."
            )
        );

    }

    const [type, token] =
        authHeader.split(" ");

    if (
        type !== "Bearer" ||
        !token
    ) {

        return next(
            new ApiError(
                401,
                "Invalid authorization header."
            )
        );

    }

    try {

        req.user =
            tokenUtil.verifyAccessToken(token);

        next();

    }

    catch {

        return next(
            new ApiError(
                401,
                "Token expired or invalid."
            )
        );

    }

};