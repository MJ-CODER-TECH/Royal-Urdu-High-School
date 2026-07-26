const express = require("express");
const router = express.Router();

const studentController = require("./student.controller");
const validation = require("./student.validation");

const asyncHandler = require("../../utils/asyncHandler");
const validationMiddleware = require("../../middlewares/validation.middleware");

const authMiddleware = require("../../middlewares/auth.middleware");
// const roleMiddleware = require("../../middlewares/role.middleware");
const permissionMiddleware = require("../../middlewares/permission.middleware");

const upload = require("../../config/upload");

router.post(
    "/",
    authMiddleware,
    // roleMiddleware(1),
    upload.single("photo"),
    //    (req, res, next) => {
    //     console.log("BODY:", req.body);
    //     console.log("FILE:", req.file);
    //     next();
    // },
      permissionMiddleware(

        "student.create"

    ),
    validation.createStudentValidation,
    validationMiddleware,
    asyncHandler(studentController.createStudent)
);

router.get(
    "/",
    authMiddleware,
    permissionMiddleware("student.view"),
    asyncHandler(studentController.getStudents)   // getAllStudents ki jagah
);

router.get(
    "/:studentId",
    authMiddleware,
    permissionMiddleware("student.view"),
    asyncHandler(studentController.getStudentById)
);


// ✅ NEW — Update Student
router.put(
    "/:studentId",
    authMiddleware,
    upload.single("photo"),
    permissionMiddleware("student.update"),
    asyncHandler(studentController.updateStudent)
);

// ✅ NEW — Change Status (Active/Inactive)
router.patch(
    "/:studentId/status",
    authMiddleware,
    permissionMiddleware("student.update"),
    asyncHandler(studentController.changeStatus)
);



router.delete(
    "/:studentId",
    authMiddleware,
    // roleMiddleware(1),
    permissionMiddleware(
    "student.delete"
),
    asyncHandler(studentController.deleteStudent)
);

module.exports = router;