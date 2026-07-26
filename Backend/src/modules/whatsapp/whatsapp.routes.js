const express = require("express");
const router = express.Router();

const controller = require("./whatsapp.controller");
const service = require("./whatsapp.service");

const asyncHandler = require("../../utils/asyncHandler");
const authMiddleware = require("../../middlewares/auth.middleware");


/*
|--------------------------------------------------------------------------
| Admission Confirmation
|--------------------------------------------------------------------------
*/

router.post(

    "/send/admission",

    authMiddleware,

    asyncHandler(controller.sendAdmissionConfirmation)

);


/*
|--------------------------------------------------------------------------
| Student Absent Alert
|--------------------------------------------------------------------------
*/

router.post(

    "/send/absent",

    authMiddleware,

    asyncHandler(controller.sendAbsentAlert)

);


/*
|--------------------------------------------------------------------------
| Certificate PDF
|--------------------------------------------------------------------------
*/

router.post(

    "/send/certificate",

    authMiddleware,

    asyncHandler(controller.sendCertificate)

);



// router.get("/test-template", async (req, res) => {

//     const meta = require("./whatsapp.meta");

//     const response = await meta.sendTemplateMessage(
//         "919146328932",
//         "student_absent_alert",
//         "en_US",
//         [
//             "Ahmed Shaikh",
//             "English",
//             "Nursery",
//             "13 July 2026"
//         ]
//     );

//     res.json(response);

// });

/*
|--------------------------------------------------------------------------
| Meta Webhook — VERIFY (GET)
|--------------------------------------------------------------------------
| Meta Developer Console me webhook setup karte waqt ye URL verify karne
| ke liye call hota hai ek baar. WHATSAPP_WEBHOOK_VERIFY_TOKEN .env me
| set karo aur wahi string Meta console me bhi daalo.
|--------------------------------------------------------------------------
*/

router.get("/webhook", (req, res) => {

    const VERIFY_TOKEN = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

    const mode = req.query["hub.mode"];

    const token = req.query["hub.verify_token"];

    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {

        return res.status(200).send(challenge);

    }

    return res.sendStatus(403);

});


/*
|--------------------------------------------------------------------------
| Meta Webhook — STATUS UPDATES (POST)
|--------------------------------------------------------------------------
| Meta yahan message sent/delivered/read/failed status bhejta hai.
| No auth middleware — Meta ke apne servers call karte hain isko.
|--------------------------------------------------------------------------
*/

router.post(

    "/webhook",

    asyncHandler(async (req, res) => {

        await service.handleStatusWebhook(req.body);

        // Meta ko turant 200 return karna zaroori hai (warna retries badhte hain)
        res.sendStatus(200);

    })

);


module.exports = router;