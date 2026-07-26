const { body, param, query } = require("express-validator");

exports.assignClassValidation = [

    body("academic_year_id")
        .isInt({ min: 1 })
        .withMessage("Academic Year is required."),

    body("class_id")
        .isInt({ min: 1 })
        .withMessage("Class is required."),

    body("discount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount must be greater than or equal to 0."),

    body("fine")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Fine must be greater than or equal to 0."),

    body("previous_balance")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Previous Balance must be greater than or equal to 0.")

];

exports.idValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid Student Fee ID.")

];

exports.listValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 }),

    query("limit")
        .optional()
        .isInt({ min: 1 }),

    query("student_id")
        .optional()
        .isInt({ min: 1 }),

    query("class_id")
        .optional()
        .isInt({ min: 1 }),

    query("academic_year_id")
        .optional()
        .isInt({ min: 1 }),

    query("status")
        .optional()
        .isIn(["Pending", "Partial", "Paid"])

];