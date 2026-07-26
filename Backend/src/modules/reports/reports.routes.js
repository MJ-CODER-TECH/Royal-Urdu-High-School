const express = require("express");

const router = express.Router();

const controller = require("./reports.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const permissionMiddleware = require("../../middlewares/permission.middleware");



/*
|--------------------------------------------------------------------------
| STUDENT REPORT
|--------------------------------------------------------------------------
*/

router.get(
    "/student",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.getStudentReport
);

/*
|--------------------------------------------------------------------------
| STUDENT REPORT - PRINT
|--------------------------------------------------------------------------
*/

router.get(
    "/student/print",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.printStudentReport
);

/*
|--------------------------------------------------------------------------
| STUDENT REPORT - PDF
|--------------------------------------------------------------------------
*/

router.get(
    "/student/pdf",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportStudentPdf
);

/*
|--------------------------------------------------------------------------
| STUDENT REPORT - EXCEL
|--------------------------------------------------------------------------
*/

router.get(
    "/student/excel",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportStudentExcel
);

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

router.get(
    "/attendance",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.getAttendanceReport
);



/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT - PRINT
|--------------------------------------------------------------------------
*/

router.get(
    "/attendance/print",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.printAttendanceReport
);

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT - PDF
|--------------------------------------------------------------------------
*/

router.get(
    "/attendance/pdf",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportAttendancePdf
);

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT - EXCEL
|--------------------------------------------------------------------------
*/

router.get(
    "/attendance/excel",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportAttendanceExcel
);




/*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

router.get(
    "/fee",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.getFeeReport
);


/*
|--------------------------------------------------------------------------
| FEE REPORT - PRINT
|--------------------------------------------------------------------------
*/

router.get(
    "/fee/print",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.printFeeReport
);

/*
|--------------------------------------------------------------------------
| FEE REPORT - PDF
|--------------------------------------------------------------------------
*/

router.get(
    "/fee/pdf",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportFeePdf
);

/*
|--------------------------------------------------------------------------
| FEE REPORT - EXCEL
|--------------------------------------------------------------------------
*/

router.get(
    "/fee/excel",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportFeeExcel
);



/*
|--------------------------------------------------------------------------
| EXAM REPORT
|--------------------------------------------------------------------------
*/

router.get(
    "/exam",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.getExamReport
);



/*
|--------------------------------------------------------------------------
| EXAM REPORT - PRINT
|--------------------------------------------------------------------------
*/

router.get(
    "/exam/print",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.printExamReport
);



/*
|--------------------------------------------------------------------------
| EXAM REPORT - PDF
|--------------------------------------------------------------------------
*/

router.get(
    "/exam/pdf",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportExamPdf
);



/*
|--------------------------------------------------------------------------
| EXAM REPORT - EXCEL
|--------------------------------------------------------------------------
*/

router.get(
    "/exam/excel",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportExamExcel
);

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

router.get(
    "/timetable",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.getTimetableReport
);

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT - PRINT
|--------------------------------------------------------------------------
*/

router.get(
    "/timetable/print",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.printTimetableReport
);

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT - PDF
|--------------------------------------------------------------------------
*/

router.get(
    "/timetable/pdf",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportTimetablePdf
);

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT - EXCEL
|--------------------------------------------------------------------------
*/

router.get(
    "/timetable/excel",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportTimetableExcel
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

router.get(
    "/certificate",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.getCertificateReport
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT - PRINT
|--------------------------------------------------------------------------
*/

router.get(
    "/certificate/print",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.printCertificateReport
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT - PDF
|--------------------------------------------------------------------------
*/

router.get(
    "/certificate/pdf",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportCertificatePdf
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT - EXCEL
|--------------------------------------------------------------------------
*/

router.get(
    "/certificate/excel",
    authMiddleware,
    permissionMiddleware("report.view"),
    controller.exportCertificateExcel
);


module.exports = router;