const express = require("express");

const router = express.Router();

const controller = require("./timetable.controller");

const auth = require("../../middlewares/auth.middleware");
const authorize = require("../../middlewares/permission.middleware");

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    auth,
    authorize("timetable.view"),
    controller.getAll
);

/*
|--------------------------------------------------------------------------
| CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

router.get(
    "/class-view",
    auth,
    authorize("timetable.view"),
    controller.getClassTimetable
);




/*
|--------------------------------------------------------------------------
| TEACHER TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

router.get(
    "/teacher-view",
    auth,
    authorize("timetable.view"),
    controller.getTeacherTimetable
);

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    auth,
    authorize("timetable.view"),
    controller.getById
);

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    auth,
    authorize("timetable.create"),
    controller.create
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    auth,
    authorize("timetable.update"),
    controller.update
);

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",
    auth,
    authorize("timetable.delete"),
    controller.remove
);

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/status",
    auth,
    authorize("timetable.update"),
    controller.changeStatus
);




module.exports = router;