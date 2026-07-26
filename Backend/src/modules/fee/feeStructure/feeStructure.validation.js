const { body, param, query } = require("express-validator");

exports.createValidation = [

    body("academic_year_id")
        .isInt({ min: 1 })
        .withMessage("Academic Year is required."),

    body("class_id")
        .isInt({ min: 1 })
        .withMessage("Class is required."),

    body("fee_head_id")
        .isInt({ min: 1 })
        .withMessage("Fee Head is required."),

    body("amount")
        .isFloat({ min: 0 })
        .withMessage("Amount must be greater than or equal to 0."),

    body("due_date")
        .isISO8601()
        .withMessage("Invalid Due Date."),

    body("installment_no")
        .optional()
        .isInt({ min: 1 }),

    body("status")
        .optional()
        .isIn(["Active", "Inactive"]),

];

exports.bulkValidation = [

    body("academic_year_id")
        .isInt({ min: 1 }),

    body("class_id")
        .isInt({ min: 1 }),

    body("fees")
        .isArray({ min: 1 })
        .withMessage("Fees array is required."),

    body("fees.*.fee_head_id")
        .isInt({ min: 1 }),

    body("fees.*.amount")
        .isFloat({ min: 0 }),

];

exports.updateValidation = [

    param("id").isInt(),

    body("amount")
        .isFloat({ min: 0 }),

    body("due_date")
        .isISO8601(),

    body("status")
        .isIn(["Active", "Inactive"]),

];

exports.idValidation = [

    param("id")
        .isInt({ min: 1 }),

];

exports.listValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 }),

    query("limit")
        .optional()
        .isInt({ min: 1 }),

    query("search")
        .optional(),

    query("academic_year_id")
        .optional()
        .isInt(),

    query("class_id")
        .optional()
        .isInt(),

    query("status")
        .optional()
        .isIn(["Active", "Inactive"]),

];