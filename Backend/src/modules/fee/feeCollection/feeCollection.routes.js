const express = require("express");

const router = express.Router();

const controller = require("./feeCollection.controller");

const validation = require("./feeCollection.validation");

const auth = require("../../../middlewares/auth.middleware");
const permission = require("../../../middlewares/permission.middleware");
const validate = require("../../../middlewares/validation.middleware");



// ======================================
// COLLECT FEE
// ======================================

router.post(

    "/pay",

    auth,

    permission("feeCollection.collect"),

    validation.collectFeeValidation,

    validate,

    controller.collectFee

);



// ======================================
// GET ALL RECEIPTS
// ======================================

router.get(

    "/",

    auth,

    permission("feeCollection.view"),

    validation.listValidation,

    validate,

    controller.getAllReceipts

);



// ======================================
// GET RECEIPT BY ID
// ======================================

router.get(

    "/:id",

    auth,

    permission("feeCollection.view"),

    validation.idValidation,

    validate,

    controller.getReceiptById

);



// ======================================
// DELETE RECEIPT
// ======================================

router.delete(

    "/:id",

    auth,

    permission("feeCollection.delete"),

    validation.idValidation,

    validate,

    controller.deleteReceipt

);



router.get(
    "/fee-student/pending",
    auth,
    permission("feeCollection.view"),
    controller.getPendingStudentFees
);
module.exports = router;