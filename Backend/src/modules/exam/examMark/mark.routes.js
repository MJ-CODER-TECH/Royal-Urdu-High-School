const express = require("express");
const router = express.Router();

const controller = require("./mark.controller");
const auth = require("../../../middlewares/auth.middleware");
const authorize = require("../../../middlewares/permission.middleware");

// Create
router.post(
    "/",
    auth,
    authorize("exam.create"),
    controller.createMark
);

// Bulk Create
router.post(
    "/bulk",
    auth,
    authorize("exam.create"),
    controller.bulkCreateMarks
);

// Get All
router.get(
    "/",
    auth,
    authorize("exam.view"),
    controller.getAllMarks
);

router.get(
    "/students",
    auth,
    authorize("exam.view"),
    controller.getStudentsForMarks
);


// Filter
router.get(
    "/filter",
    auth,
    authorize("exam.view"),
    controller.getMarksByFilter
);

// Get By Id
router.get(
    "/:id",
    auth,
    authorize("exam.view"),
    controller.getMarkById
);

// Update
router.put(
    "/:id",
    auth,
    authorize("exam.update"),
    controller.updateMark
);

// Delete
router.delete(
    "/:id",
    auth,
    authorize("exam.delete"),
    controller.deleteMark
);


module.exports = router;