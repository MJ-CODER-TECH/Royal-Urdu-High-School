const {

    body,

    param,

    query

} = require("express-validator");



// ======================================
// COLLECT FEE
// ======================================

exports.collectFeeValidation = [

    body("student_fee_id")

        .isInt({ min: 1 })

        .withMessage("Student Fee is required."),

   body("fee_head_id")
.optional(),

    body("payment_date")

        .isISO8601()

        .withMessage("Invalid payment date."),

    body("payment_mode")

        .isIn([

            "Cash",

            "UPI",

            "Card",

            "Bank",

            "Cheque"

        ])

        .withMessage("Invalid payment mode."),

    body("amount")

        .isFloat({ min: 0.01 })

        .withMessage("Amount must be greater than zero."),

    body("reference_no")

        .optional()

        .isLength({

            max: 100

        }),

    body("remarks")

        .optional()

        .isLength({

            max: 500

        })

];



// ======================================
// RECEIPT ID
// ======================================

exports.idValidation = [

    param("id")

        .isInt({ min: 1 })

        .withMessage("Invalid receipt id.")

];



// ======================================
// LIST VALIDATION
// ======================================

exports.listValidation = [

    query("page")

        .optional()

        .isInt({ min: 1 }),

    query("limit")

        .optional()

        .isInt({ min: 1 }),

    query("search")

        .optional()

        .isString()

        .isLength({

            max: 100

        })

];