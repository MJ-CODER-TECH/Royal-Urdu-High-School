const { body } = require("express-validator");

/* =====================================
   Create Certificate Validation
===================================== */
exports.createCertificateValidation = [

    body("student_id")
        .notEmpty()
        .withMessage("Student is required.")
        .isInt({ min: 1 })
        .withMessage("Invalid student."),

    body("certificate_type")
        .notEmpty()
        .withMessage("Certificate type is required.")
        .isIn([
            "Bonafide",
            "Transfer Certificate",
            "Leaving Certificate",
            "Character Certificate"
        ])
        .withMessage("Invalid certificate type."),

    body("issue_date")
        .notEmpty()
        .withMessage("Issue date is required.")
        .isDate()
        .withMessage("Invalid issue date."),

    body("reason")
        .notEmpty()
        .withMessage("Reason is required.")
        .trim()
        .isLength({ min: 2, max: 500 })
        .withMessage("Reason must be between 2 and 500 characters."),

    body("remarks")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Remarks cannot exceed 500 characters."),

    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .isIn(["Generated", "Pending", "Cancelled", "Draft"])
        .withMessage("Invalid status.")

    

    // generated_by hata diya — ab ye client se validate nahi hoti,
    // controller mein req.user se derive hoti hai
];
/* =====================================
   Update Certificate Validation
===================================== */

exports.updateCertificateValidation = [

    body("issue_date")
        .optional()
        .isDate()
        .withMessage("Invalid issue date."),

    body("status")
        .optional()
        .isIn([
            "Active",
            "Cancelled"
        ])
        .withMessage("Invalid status."),

    body("remarks")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Remarks cannot exceed 500 characters."),

    body("pdf_path")
        .optional()
        .trim(),

    body("status")
    .optional()
    .isIn(["Generated", "Pending", "Cancelled", "Draft"])
    .withMessage("Invalid status."),

];