const express = require("express");
const router = express.Router();

const attendanceController = require("./attendance.controller");
const validation = require("./attendance.validation");

const asyncHandler = require("../../utils/asyncHandler");
const validationMiddleware = require("../../middlewares/validation.middleware");

const authMiddleware = require("../../middlewares/auth.middleware");
// const roleMiddleware = require("../../middlewares/role.middleware");
const permissionMiddleware = require("../../middlewares/permission.middleware");

// Create Attendance
router.post(
    "/",
    authMiddleware,
    // roleMiddleware(1),
    permissionMiddleware(
    "attendance.mark"
),
    validation.createAttendanceValidation,
    validationMiddleware,
    asyncHandler(attendanceController.createAttendance)
);

// Get All Attendance
router.get(
    "/",
    authMiddleware,
    permissionMiddleware("attendance.view"),
    asyncHandler(attendanceController.getAllAttendance)
);

router.get(
    "/:attendanceId",
    authMiddleware,
    permissionMiddleware("attendance.view"),
    asyncHandler(attendanceController.getAttendanceById)
);

router.get(
    "/student/:studentId",
    authMiddleware,
    permissionMiddleware("attendance.view"),
    asyncHandler(attendanceController.getAttendanceByStudent)
);

// Get Attendance By Date
router.get(
    "/date/:attendanceDate",
    authMiddleware,
    permissionMiddleware("attendance.view"),
    asyncHandler(attendanceController.getAttendanceByDate)
);

// Update Attendance
router.put(
    "/:attendanceId",
    authMiddleware,
    permissionMiddleware("attendance.update"),
    validation.updateAttendanceValidation,
    validationMiddleware,
    asyncHandler(attendanceController.updateAttendance)
);

// Delete Attendance
router.delete(
    "/:attendanceId",
    authMiddleware,
    permissionMiddleware("attendance.delete"),
    asyncHandler(attendanceController.deleteAttendance)
);

router.post(
    "/bulk",
    authMiddleware,
    permissionMiddleware("attendance.mark"),
    validation.createBulkAttendanceValidation,
    validationMiddleware,
    asyncHandler(attendanceController.bulkAttendance)
);



module.exports = router;