const { body, param, query } = require("express-validator");

exports.createFeeHeadValidation = [

    body("fee_name")
        .trim()
        .notEmpty()
        .withMessage("Fee Head Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Fee Head Name must be between 2 and 100 characters."),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters."),

    body("status")
        .optional()
        .isIn(["Active", "Inactive"])
        .withMessage("Invalid status."),
];

exports.updateFeeHeadValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid Fee Head ID."),

    body("fee_name")
        .trim()
        .notEmpty()
        .withMessage("Fee Head Name is required."),

    body("description")
        .optional()
        .trim(),

    body("status")
        .isIn(["Active", "Inactive"])
        .withMessage("Invalid status."),
];

exports.idValidation = [

    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid Fee Head ID."),
];

exports.listValidation = [

    query("page")
        .optional()
        .isInt({ min: 1 }),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }),

    query("search")
        .optional()
        .trim(),

    query("status")
        .optional()
        .isIn(["Active", "Inactive"]),
];