const express = require("express");

const router = express.Router();

const controller = require("./examSubject.controller");

const auth = require("../../../middlewares/auth.middleware");
const authorize = require("../../../middlewares/permission.middleware");

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    auth,
    authorize("exam.create"),
    controller.create
);

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    auth,
    authorize("exam.view"),
    controller.getAll
);

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",
    auth,
    authorize("exam.view"),
    controller.getById
);

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",
    auth,
    authorize("exam.update"),
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
    authorize("exam.delete"),
    controller.delete
);

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
    "/:id/status",
    auth,
    authorize("exam.update"),
    controller.changeStatus
);

module.exports = router;