const express = require("express");
const router = express.Router();

const controller = require("./certificate.controller");

const asyncHandler = require("../../utils/asyncHandler");
const authMiddleware = require("../../middlewares/auth.middleware");
const validationMiddleware = require("../../middlewares/validation.middleware");
const validation = require("./certificate.validation");
const permissionMiddleware = require("../../middlewares/permission.middleware");



router.get(
    "/:id/download",
    authMiddleware,
    permissionMiddleware("certificate.print"),
    asyncHandler(controller.downloadCertificatePdf)
);
/* =====================================
   Create Certificate
===================================== */

router.post(
    "/",
    authMiddleware,
    permissionMiddleware("certificate.create"),
    validation.createCertificateValidation,
    validationMiddleware,
    asyncHandler(controller.createCertificate)
);;

/* =====================================
   Get All Certificates
===================================== */

router.get(
    "/",
    authMiddleware,
    permissionMiddleware("certificate.view"),
    asyncHandler(controller.getCertificates)
);
/* =====================================
   Get Certificate By ID
===================================== */

router.get(
    "/:id",
    authMiddleware,
    permissionMiddleware("certificate.view"),
    asyncHandler(controller.getCertificateById)
);

/* =====================================
   Update Certificate
===================================== */

router.put(
    "/:id",
    authMiddleware,
    permissionMiddleware("certificate.update"),
    validation.updateCertificateValidation,
    validationMiddleware,
    asyncHandler(controller.updateCertificate)
);

/* =====================================
   Delete Certificate
===================================== */

router.delete(
    "/:id",
    authMiddleware,
    permissionMiddleware("certificate.delete"),
    asyncHandler(controller.deleteCertificate)
);


router.get(
    "/bonafide/:student_id/pdf",
    authMiddleware,
    permissionMiddleware("certificate.print"),
    asyncHandler(controller.generateBonafidePdf)
);

router.get(
    "/student/:student_id",
    authMiddleware,
    permissionMiddleware("certificate.view"),
    asyncHandler(controller.getStudentCertificates)
);

router.post(
    "/tc/:student_id/pdf",
    authMiddleware,
    permissionMiddleware("certificate.print"),
    asyncHandler(controller.generateTransferCertificatePdf)
);

router.post(
    "/lc/:student_id/pdf",
    authMiddleware,
    permissionMiddleware("certificate.print"),
    asyncHandler(controller.generateLeavingCertificatePdf)
);

router.post(
    "/character/:student_id/pdf",
    authMiddleware,
    permissionMiddleware("certificate.print"),
    asyncHandler(controller.generateCharacterCertificatePdf)
);



module.exports = router;