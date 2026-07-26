const express = require("express");
const router = express.Router();

const controller = require("./monthlyAttendance.controller");
const asyncHandler = require("../../../utils/asyncHandler");
const authMiddleware = require("../../../middlewares/auth.middleware");

router.get("/", authMiddleware, asyncHandler(controller.getMonthlyAttendance));

router.get(
  "/student",
  authMiddleware,
  asyncHandler(controller.getStudentMonthlyAttendance),
);

router.get(
  "/class",
  authMiddleware,
  asyncHandler(controller.getClassMonthlyAttendance),
);

router.get(
  "/calendar",
  authMiddleware,
  asyncHandler(controller.getAttendanceCalendar),
);

router.get(
  "/low-attendance",
  authMiddleware,
  asyncHandler(controller.getLowAttendanceStudents),
);

router.get(
  "/dashboard",
  authMiddleware,
  asyncHandler(controller.getAttendanceDashboard),
);

router.get(
    "/yearly",
    authMiddleware,
    asyncHandler(controller.getYearlyAttendance)
);

router.get(
    "/pdf/monthly",
    authMiddleware,
    asyncHandler(controller.exportMonthlyAttendancePdf)
);

router.get(
    "/register",
    authMiddleware,
    asyncHandler(controller.getAttendanceRegister)
);

router.get(
    "/register-matrix",
    authMiddleware,
    asyncHandler(controller.getAttendanceRegisterMatrix)
);

router.get(
    "/analytics",
    authMiddleware,
    asyncHandler(controller.getAttendanceAnalytics)
);

router.get(
    "/excel/monthly",
    authMiddleware,
    asyncHandler(controller.exportMonthlyAttendanceExcel)
);


module.exports = router;
