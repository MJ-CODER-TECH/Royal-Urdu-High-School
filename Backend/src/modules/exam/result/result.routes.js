const express = require("express");

const router = express.Router();

const controller = require("./result.controller");

const auth = require("../../../middlewares/auth.middleware");
const authorize = require("../../../middlewares/permission.middleware");

/*
|--------------------------------------------------------------------------
| RESULT MANAGEMENT
|--------------------------------------------------------------------------
*/

router.post(
    "/generate",
    auth,
    authorize("result.create"),
    controller.generate
);

router.post(
    "/",
    auth,
    authorize("result.create"),
    controller.create
);

router.get(
    "/",
    auth,
    authorize("result.view"),
    controller.getAll
);

router.get(
    "/filter",
    auth,
    authorize("result.view"),
    controller.getByFilter
);

router.get(
    "/:id",
    auth,
    authorize("result.view"),
    controller.getById
);

// router.put(
//     "/:id",
//     auth,
//     authorize("result.update"),
//     controller.update
// );

router.delete(
    "/:id",
    auth,
    authorize("result.delete"),
    controller.delete
);

module.exports = router;