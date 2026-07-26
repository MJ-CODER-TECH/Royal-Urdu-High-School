const express = require("express");

const router = express.Router();

const controller = require("./studentFee.controller");
const validation = require("./studentFee.validation");

const auth = require("../../../middlewares/auth.middleware");
const permission = require("../../../middlewares/permission.middleware");
const validate = require("../../../middlewares/validation.middleware");

router.post(
    "/assign-class",
    auth,
    permission("studentFee.assign"),
    validation.assignClassValidation,
    validate,
    controller.assignClass
);

router.get(

    "/",

    auth,

    permission("studentFee.view"),

    validation.listValidation,

    validate,

    controller.getStudentFees

);

router.get(

    "/:id",

    auth,

    permission("studentFee.view"),

    validation.idValidation,

    validate,

    controller.getStudentFeeById

);

router.delete(

    "/:id",

    auth,

    permission("studentFee.delete"),

    validation.idValidation,

    validate,

    controller.deleteStudentFee

);


router.post(
    "/generate",
    auth,
    controller.generateStudentFee
);
module.exports = router;