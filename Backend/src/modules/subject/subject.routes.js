const express = require("express");

const router = express.Router();

const subjectController =
    require("./subject.controller");

const authMiddleware =
    require("../../middlewares/auth.middleware");

const permissionMiddleware =
    require("../../middlewares/permission.middleware");


// ===========================================
// Subject Management
// ===========================================

router.get(
    "/",
    authMiddleware,
    permissionMiddleware("subject.view"),
    subjectController.getSubjects
);


router.get(
    "/:id",
    authMiddleware,
    permissionMiddleware("subject.view"),
    subjectController.getSubjectById
);


router.post(
    "/",
    authMiddleware,
    permissionMiddleware("subject.create"),
    subjectController.createSubject
);


router.put(
    "/:id",
    authMiddleware,
    permissionMiddleware("subject.update"),
    subjectController.updateSubject
);


router.delete(
    "/:id",
    authMiddleware,
    permissionMiddleware("subject.delete"),
    subjectController.deleteSubject
);


router.patch(
    "/:id/status",
    authMiddleware,
    permissionMiddleware("subject.update"),
    subjectController.changeSubjectStatus
);


module.exports = router;