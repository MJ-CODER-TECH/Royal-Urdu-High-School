const { body } = require("express-validator");

exports.createUserValidation = [

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required."),


    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters."),


    body("role_id")
        .isInt()
        .withMessage("Role is required."),


    body("is_active")
        .optional()
        .isBoolean()
        .withMessage("Invalid status.")

];

exports.updateUserValidation = [

    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required."),


    body("role_id")
        .isInt()
        .withMessage("Role is required."),


    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters.")

];
exports.resetPasswordValidation = [

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters.")

];

exports.changeStatusValidation = [

    body("is_active")
        .isBoolean()
        .withMessage("Invalid status.")

];