const express = require('express')
const router = express.Router()

const healthController = require("../controllers/health.controller");
const studentRoutes = require("../modules/student/student.routes")
const authRoutes = require("../modules/auth/auth.routes")
const attendanceRoutes = require("../modules/attendance/attendance.routes");
const monthlyAttendanceRoutes = require("../modules/attendance/reports/monthlyAttendance.routes");
const certificateRoutes = require("../modules/certificate/certificate.routes");
const whatsappRoutes = require("../modules/whatsapp/whatsapp.routes");
const userRoutes = require("../modules/user/user.routes");
const masterRoutes = require("../modules/master/master.routes");
const feeHeadRoutes = require("../modules/fee/feeHead/feeHead.routes");
const feeStructureRoutes = require("../modules/fee/feeStructure/feeStructure.routes");
const studentFeeRoutes = require("../modules/fee/studentFee/studentFee.routes");
const feeCollectionRoutes = require("../modules/fee/feeCollection/feeCollection.routes")
const examRoutes = require("../modules/exam/examMaster/exam.routes");
const markRoutes = require("../modules/exam/examMark/mark.routes");
const examSubjectRoutes = require("../modules/exam/examSubject/examSubject.routes");
const resultRoutes =require("../modules/exam/result/result.routes");
const dashboardRoutes = require("../modules/dashboard/dashboard.routes");
const timetableRoutes = require("../modules/timetable/timetable.routes");
const reportsRoutes = require("../modules/reports/reports.routes");


router.get("/health", healthController.checkHealth);
router.use("/api/v1/students", studentRoutes);
router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/attendance", attendanceRoutes);
router.use("/api/v1/monthly-attendance", monthlyAttendanceRoutes);
router.use("/api/v1/certificates",certificateRoutes);
router.use("/api/v1/whatsapp",whatsappRoutes);
router.use("/api/v1/users", userRoutes);
router.use("/api/v1/master", masterRoutes);
router.use("/api/v1/fee-heads",feeHeadRoutes)
router.use("/api/v1/fee-structure",feeStructureRoutes);
router.use("/api/v1/fee-student",studentFeeRoutes);
router.use("/api/v1/fee-collection", feeCollectionRoutes);
router.use("/api/v1/exam", examRoutes);
router.use("/api/v1/marks", markRoutes);
router.use("/api/v1/exam-subjects",examSubjectRoutes);
router.use("/api/v1/result",resultRoutes);
router.use("/api/v1/dashboard", dashboardRoutes);
router.use("/api/v1/timetable", timetableRoutes);
router.use("/api/v1/reports", reportsRoutes);

module.exports = router;