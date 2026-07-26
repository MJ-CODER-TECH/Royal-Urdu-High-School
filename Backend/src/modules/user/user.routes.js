const express = require("express");
const router = express.Router();

const userController = require("./user.controller");
const validation = require("./user.validation");

const asyncHandler = require("../../utils/asyncHandler");
const validationMiddleware = require("../../middlewares/validation.middleware");
const authMiddleware = require("../../middlewares/auth.middleware");
const permissionMiddleware = require("../../middlewares/permission.middleware");

router.use(authMiddleware);

// Roles
router.get(
    "/roles",
    permissionMiddleware("role.view"),
    asyncHandler(userController.getRoles)
);

// Users
router.get(
    "/",
    permissionMiddleware("user.view"),
    asyncHandler(userController.getAll)
);

router.get(
    "/:id",
    permissionMiddleware("user.view"),
    asyncHandler(userController.getById)
);

router.post(
    "/",
    permissionMiddleware("user.create"),
    validation.createUserValidation,
    validationMiddleware,
    asyncHandler(userController.create)
);

router.put(
    "/:id",
    permissionMiddleware("user.update"),
    validation.updateUserValidation,
    validationMiddleware,
    asyncHandler(userController.update)
);

router.patch(
    "/:id/status",
    permissionMiddleware("user.update"),
    validation.changeStatusValidation,
    validationMiddleware,
    asyncHandler(userController.changeStatus)
);

router.patch(
    "/:id/password",
    permissionMiddleware("user.update"),
    validation.resetPasswordValidation,
    validationMiddleware,
    asyncHandler(userController.resetPassword)
);

router.delete(
    "/:id",
    permissionMiddleware("user.delete"),
    asyncHandler(userController.delete)
);

module.exports = router;