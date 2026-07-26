const { body } = require("express-validator");

exports.createStudentValidation = [

    body("first_name")
        .trim()
        .notEmpty()
        .withMessage("First name is required"),

    body("last_name")
        .trim()
        .notEmpty()
        .withMessage("Last name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format"),

    body("gender")
        .trim()
        .notEmpty()
        .withMessage("Gender is required"),

    body("dob")
        .trim()
        .notEmpty()
        .withMessage("Date of birth is required"),

    body("mobile")
        .trim()
        .notEmpty()
        .withMessage("Mobile number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Mobile number must be 10 digits long")
        .isNumeric()
        .withMessage("Mobile number must contain only digits"),

    body("parent_mobile")
        .trim()
        .notEmpty()
        .withMessage("Parent mobile is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Parent mobile must be 10 digits long")
        .isNumeric()
        .withMessage("Parent mobile must contain only digits"),

];