const express = require("express");

const router = express.Router();

const controller = require("./dashboard.controller");

const authMiddleware = require("../../middlewares/auth.middleware");
const permissionMiddleware = require("../../middlewares/permission.middleware");

/*
|--------------------------------------------------------------------------
| DASHBOARD
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    authMiddleware,
    permissionMiddleware("dashboard.view"),
    controller.getDashboard
);


// router.get(
//     "/",
//     authMiddleware,
//     controller.getDashboard
// );

module.exports = router;