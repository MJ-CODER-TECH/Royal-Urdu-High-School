const express = require("express");
const router = express.Router();

const authController = require("./auth.controller");
const asyncHandler = require("../../utils/asyncHandler");
const authValidation = require("./auth.validation");
const validationMiddleware = require("../../middlewares/validation.middleware");
const authMiddleware = require("../../middlewares/auth.middleware")
const { loginLimiter } = require("../../middlewares/rateLimiter.middleware");


router.post(
    "/login",

    loginLimiter,

    authValidation.loginValidation,

    validationMiddleware,

    asyncHandler(authController.login)

);




router.get(
    "/me",
    authMiddleware,
    asyncHandler(authController.getProfile)
);


router.post(
    "/logout",
    authMiddleware,
    asyncHandler(authController.logout)
);


module.exports = router;