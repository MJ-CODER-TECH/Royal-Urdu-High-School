const express = require("express");

const router = express.Router();

const promotionController = require("./promote.controller");

// ==================================================
// Get Students For Promotion
// GET /api/v1/promotion/students
// ==================================================
router.get(
    "/students",
    promotionController.getStudents
);

// ==================================================
// Promote Students
// POST /api/v1/promotion/promote
// ==================================================
router.post(
    "/promote",
    promotionController.promoteStudents
);

// ==================================================
// Promotion History
// GET /api/v1/promotion/history
// ==================================================
router.get(
    "/history",
    promotionController.getHistory
);

module.exports = router;