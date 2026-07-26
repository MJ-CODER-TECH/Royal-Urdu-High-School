const { body } = require("express-validator");

exports.createAttendanceValidation = [

    body("student_id")
        .notEmpty()
        .withMessage("Student is required")
        .isInt({ min: 1 })
        .withMessage("Invalid student id"),

    body("attendance_date")
        .notEmpty()
        .withMessage("Attendance date is required")
        .isISO8601()
        .withMessage("Invalid date"),

    body("status")
        .notEmpty()
        .withMessage("Attendance status is required")
        .isIn([
            "Present",
            "Absent",
            "Leave",
            "Holiday",
            "Half Day",
            "Late"
        ])
        .withMessage("Invalid attendance status"),

    body("remarks")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Remarks can not exceed 500 characters")

];

exports.updateAttendanceValidation = [

    body("attendance_date")
        .optional()
        .isISO8601(),

    body("status")
        .optional()
        .isIn([
            "Present",
            "Absent",
            "Leave",
            "Holiday",
            "Half Day",
            "Late"
        ]),

    body("remarks")
        .optional()
        .isLength({ max: 500 })

];



exports.createBulkAttendanceValidation = [

    body("class_id")
        .isInt({ min: 1 })
        .withMessage("Valid class is required"),

    body("section_id")
        .isInt({ min: 1 })
        .withMessage("Valid section is required"),

    body("attendance_date")
        .isISO8601()
        .withMessage("Valid attendance date is required"),

    body("attendance")
        .isArray({ min: 1 })
        .withMessage("Attendance array is required"),

    body("attendance.*.student_id")
        .isInt({ min: 1 })
        .withMessage("Valid student id is required"),

    body("attendance.*.status")
        .isIn([
            "Present",
            "Absent",
            "Leave",
            "Holiday",
            "Half Day",
            "Late"
        ])
        .withMessage("Invalid attendance status")

];