const service = require("./certificate.service");
const pdfService = require("./certificatePdf.service")

/* ==============================
   Create Certificate
============================== */

exports.createCertificate = async (req, res) => {

    const payload = {
        ...req.body,
        generated_by: req.user?.name || req.user?.username || "Admin",
    };

    const data = await service.createCertificate(payload);

    res.status(201).json({
        success: true,
        message: "Certificate generated successfully.",
        data
    });

};

/* ==============================
   Get All Certificates
============================== */

exports.getCertificates = async (req, res) => {

    const data = await service.getCertificates(req.query);

    res.status(200).json({
        success: true,
        ...data
    });

};

/* ==============================
   Get Certificate By ID
============================== */

exports.getCertificateById = async (req, res) => {

    const data = await service.getCertificateById(
        req.params.id
    );

    res.status(200).json({
        success: true,
        data
    });

};

/* ==============================
   Update Certificate
============================== */

exports.updateCertificate = async (req, res) => {

    const data = await service.updateCertificate(
        req.params.id,
        req.body
    );

    res.status(200).json({
        success: true,
        ...data
    });

};

/* ==============================
   Delete Certificate
============================== */

exports.deleteCertificate = async (req, res) => {

    const data = await service.deleteCertificate(
        req.params.id
    );

    res.status(200).json({
        success: true,
        ...data
    });

};




exports.generateBonafidePdf = async (req, res) => {

    const result = await pdfService.generateBonafidePdf(
        req.params.student_id,
        req.user?.name || "Admin"
    );

    return res.download(
        result.filePath,
        `${result.certificateNo}.pdf`
    );

};



exports.getStudentCertificates = async (req, res) => {

    const data = await service.getStudentCertificates(
        req.params.student_id
    );

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });

};


exports.generateTransferCertificatePdf = async (req, res) => {

    const result =
        await pdfService.generateTransferCertificatePdf(

            req.params.student_id,

            req.user?.name || "Admin",

            req.body

        );

    return res.download(
        result.filePath
    );

};


exports.generateLeavingCertificatePdf = async (req, res) => {

    const result =
        await pdfService.generateLeavingCertificatePdf(

            req.params.student_id,

            req.user?.name || "Admin",

            req.body

        );

    return res.download(result.filePath);

};


exports.generateCharacterCertificatePdf = async (req, res) => {

    const result =
        await pdfService.generateCharacterCertificatePdf(

            req.params.student_id,

            req.user?.name || "Admin",

            req.body

        );

    return res.download(
        result.filePath
    );

};


exports.downloadCertificatePdf = async (req, res) => {

    const service = require("./certificate.service");

    const record = await service.getPdfPathById(req.params.id);

    if (!record || !record.pdf_path) {
        return res.status(404).json({
            success: false,
            message: "PDF not generated yet for this certificate.",
        });
    }

    return res.download(
        record.pdf_path,
        `${record.certificate_no}.pdf`
    );

};




