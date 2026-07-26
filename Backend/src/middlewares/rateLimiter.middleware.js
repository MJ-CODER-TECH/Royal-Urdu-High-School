const rateLimit = require("express-rate-limit");

const isProduction = process.env.NODE_ENV === "production";

exports.loginLimiter = rateLimit({
    windowMs: isProduction ? 15 * 60 * 1000 : 1 * 60 * 1000,
    max: isProduction ? 5 : 20,

    message: {
        success: false,
        message: "Too many login attempts. Please try again later.",
    },

    standardHeaders: true,
    legacyHeaders: false,
});