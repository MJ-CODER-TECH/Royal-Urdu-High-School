const { body } = require("express-validator");



exports.sendAdmissionValidation = [

    body("student.student_id")
        .notEmpty(),

    body("student.parent_mobile")
        .notEmpty(),

    body("student.student_name")
        .notEmpty()

];



exports.sendAbsentValidation = [

    body("student.student_id")
        .notEmpty(),

    body("student.parent_mobile")
        .notEmpty(),

    body("attendanceDate")
        .notEmpty()

];



exports.sendCertificateValidation = [

    body("student.student_id")
        .notEmpty(),

    body("student.parent_mobile")
        .notEmpty(),

    body("certificateType")
        .notEmpty(),

    body("pdfUrl")
        .notEmpty()

];