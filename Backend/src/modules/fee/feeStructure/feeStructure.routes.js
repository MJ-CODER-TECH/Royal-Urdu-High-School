const express = require("express");

const router = express.Router();

const controller = require("./feeStructure.controller");
const validation = require("./feeStructure.validation");

const auth = require("../../../middlewares/auth.middleware");
const permission = require("../../../middlewares/permission.middleware");
const validate = require("../../../middlewares/validation.middleware");

router.post(
    "/",
    auth,
    permission("feeStructure.create"),
    validation.createValidation,
    validate,
    controller.create
);

router.post(
    "/bulk",
    auth,
    permission("feeStructure.create"),
    validation.bulkValidation,
    validate,
    controller.bulkCreate
);

router.get(
    "/",
    auth,
    permission("feeStructure.view"),
    validation.listValidation,
    validate,
    controller.getAll
);

router.get(
    "/:id",
    auth,
    permission("feeStructure.view"),
    validation.idValidation,
    validate,
    controller.getById
);

router.put(
    "/:id",
    auth,
    permission("feeStructure.update"),
    validation.updateValidation,
    validate,
    controller.update
);

router.delete(
    "/:id",
    auth,
    permission("feeStructure.delete"),
    validation.idValidation,
    validate,
    controller.delete
);

module.exports = router;