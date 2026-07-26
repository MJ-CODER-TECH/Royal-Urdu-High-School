const express = require("express");
const router = express.Router();

const masterController = require("./master.controller");
const authMiddleware = require("../../middlewares/auth.middleware");
const permissionMiddleware = require("../../middlewares/permission.middleware");

// dont Touch this route ok 

router.get("/classes", masterController.getAllClasses);

// close 

// |--------------------------------------------------------------------------
// | Class Management
// |--------------------------------------------------------------------------

router.get(
    "/class-management",
    authMiddleware,
    permissionMiddleware("class.view"),
    masterController.getClasses
);


router.post(
    "/class-management",
    authMiddleware,
    permissionMiddleware("class.create"),
    masterController.createClass
);


router.put(
    "/class-management/:id",
    authMiddleware,
    permissionMiddleware("class.update"),
    masterController.updateClass
);


router.delete(
    "/class-management/:id",
    authMiddleware,
    permissionMiddleware("class.delete"),
    masterController.deleteClass
);
router.patch(
    "/class-management/:id/status",
    authMiddleware,
    permissionMiddleware("class.update"),
    masterController.changeClassStatus
);


// don't touch this route 
router.get("/sections", masterController.getAllSections);
// close 

/*
|--------------------------------------------------------------------------
| Section Management
|--------------------------------------------------------------------------
*/

router.get(
    "/section-management",
    authMiddleware,
    permissionMiddleware("section.view"),
    masterController.getSections
);


router.post(
    "/section-management",
    authMiddleware,
    permissionMiddleware("section.create"),
    masterController.createSection
);


router.put(
    "/section-management/:id",
    authMiddleware,
    permissionMiddleware("section.update"),
    masterController.updateSection
);


router.delete(
    "/section-management/:id",
    authMiddleware,
    permissionMiddleware("section.delete"),
    masterController.deleteSection
);
router.patch(
    "/section-management/:id/status",
    authMiddleware,
    permissionMiddleware("section.update"),
    masterController.changeSectionStatus
);



// dont touch this route
router.get("/academic-years", masterController.getAllAcademicYears);
// close 


/*
|--------------------------------------------------------------------------
| Academic Year Management
|--------------------------------------------------------------------------
*/
router.get(
    "/academic-year-management",
    authMiddleware,
    permissionMiddleware("academicYear.view"),
    masterController.getAcademicYears
);


router.post(
    "/academic-year-management",
    authMiddleware,
    permissionMiddleware("academicYear.create"),
    masterController.createAcademicYear
);


router.put(
    "/academic-year-management/:id",
    authMiddleware,
    permissionMiddleware("academicYear.update"),
    masterController.updateAcademicYear
);


router.delete(
    "/academic-year-management/:id",
    authMiddleware,
    permissionMiddleware("academicYear.delete"),
    masterController.deleteAcademicYear
);

router.patch(
    "/academic-year-management/:id/status",
    authMiddleware,
    permissionMiddleware("academicYear.update"),
    masterController.changeAcademicYearStatus
);





router.get(
    "/subjects",
    masterController.getAllSubjects
);


module.exports = router;
