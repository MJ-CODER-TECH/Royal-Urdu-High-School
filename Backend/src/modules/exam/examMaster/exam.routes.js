const express = require("express");
const router = express.Router();

const examController = require("./exam.controller");

const authMiddleware = require("../../../middlewares/auth.middleware");
const permissionMiddleware = require("../../../middlewares/permission.middleware");

/*
|--------------------------------------------------------------------------
| Exam Management
|--------------------------------------------------------------------------
*/

router.get(
    "/exam-management",
    authMiddleware,
    permissionMiddleware("exam.view"),
    examController.getExams
);

router.get(
    "/exam-management/:id",
    authMiddleware,
    permissionMiddleware("exam.view"),
    examController.getExamById
);

router.post(
    "/exam-management",
    authMiddleware,
    permissionMiddleware("exam.create"),
    examController.createExam
);

router.put(
    "/exam-management/:id",
    authMiddleware,
    permissionMiddleware("exam.update"),
    examController.updateExam
);

router.delete(
    "/exam-management/:id",
    authMiddleware,
    permissionMiddleware("exam.update"),
    examController.deleteExam
);

router.patch(
    "/exam-management/:id/status",
    authMiddleware,
    permissionMiddleware("exam.publish"),
    examController.changeExamStatus
);

module.exports = router;