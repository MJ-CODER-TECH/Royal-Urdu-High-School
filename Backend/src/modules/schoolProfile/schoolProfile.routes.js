const express = require("express");
const router = express.Router();

const schoolProfileController =
    require("./schoolProfile.controller");

const authMiddleware =
    require("../../middlewares/auth.middleware");

const permissionMiddleware =
    require("../../middlewares/permission.middleware");

const schoolProfileUpload =
    require("../../middlewares/schoolProfileUpload.middleware");


router.get(
    "/",
    authMiddleware,
    permissionMiddleware("schoolProfile.view"),
    schoolProfileController.getSchoolProfile
);


router.post(
    "/",
    authMiddleware,
    permissionMiddleware("schoolProfile.create"),

    schoolProfileUpload.fields([
        {
            name:"logo",
            maxCount:1,
        },
        {
            name:"principal_signature",
            maxCount:1,
        },
        {
            name:"school_stamp",
            maxCount:1,
        },
    ]),

    schoolProfileController.createSchoolProfile
);


router.put(
    "/:id",

    authMiddleware,

    permissionMiddleware("schoolProfile.update"),

    schoolProfileUpload.fields([
        {
            name:"logo",
            maxCount:1,
        },
        {
            name:"principal_signature",
            maxCount:1,
        },
        {
            name:"school_stamp",
            maxCount:1,
        },
    ]),

    schoolProfileController.updateSchoolProfile
);


router.post(
    "/:schoolId/units",

    authMiddleware,

    permissionMiddleware("schoolProfile.update"),

    schoolProfileController.addSchoolUnit
);


router.put(
    "/units/:unitId",

    authMiddleware,

    permissionMiddleware("schoolProfile.update"),

    schoolProfileController.updateSchoolUnit
);


router.delete(
    "/units/:unitId",

    authMiddleware,

    permissionMiddleware("schoolProfile.update"),

    schoolProfileController.deleteSchoolUnit
);


module.exports = router;