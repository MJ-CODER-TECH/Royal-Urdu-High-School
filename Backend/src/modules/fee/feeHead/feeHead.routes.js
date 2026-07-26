const express = require("express");

const router = express.Router();

const controller = require("./feeHead.controller");
const validation = require("./feeHead.validation");

const auth = require("../../../middlewares/auth.middleware");
const permission = require("../../../middlewares/permission.middleware");
const validate = require("../../../middlewares/validation.middleware");

router.post(
    "/",
    auth,
    permission("feeHead.create"),
    validation.createFeeHeadValidation,
    validate,
    controller.createFeeHead
);

router.get(
    "/",
    auth,
    permission("feeHead.view"),
    validation.listValidation,
    validate,
    controller.getAllFeeHeads
);

router.get(
    "/:id",
    auth,
    permission("feeHead.view"),
    validation.idValidation,
    validate,
    controller.getFeeHeadById
);

router.put(
    "/:id",
    auth,
    permission("feeHead.update"),
    validation.updateFeeHeadValidation,
    validate,
    controller.updateFeeHead
);

router.delete(
    "/:id",
    auth,
    permission("feeHead.delete"),
    validation.idValidation,
    validate,
    controller.deleteFeeHead
);

module.exports = router;