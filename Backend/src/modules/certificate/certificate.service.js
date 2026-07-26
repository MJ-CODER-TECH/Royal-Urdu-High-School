const ApiError = require("../../utils/ApiError");
const repository = require("./certificate.repository");
const studentRepository = require("../student/student.repository");
const whatsappService = require("../whatsapp/whatsapp.service");

/* ===========================
   Generate Certificate Number
=========================== */

// const generateCertificateNumber = async (type) => {

//     const year = new Date().getFullYear();

//     const prefixMap = {
//         "Bonafide": "BON",
//         "Transfer Certificate": "TC",
//         "Leaving Certificate": "LC",
//         "Character Certificate": "CC"
//     };

//     const prefix = prefixMap[type];

//     if (!prefix) {
//         throw new ApiError(400, "Invalid certificate type.");
//     }

//     let number;

//     while (true) {

//         const random = String(
//             Math.floor(Math.random() * 999999) + 1
//         ).padStart(6, "0");

//         number = `${prefix}-${year}-${random}`;

//         const exists =
//             await repository.isCertificateNumberExists(number);

//         if (!exists) break;

//     }

//     return number;

// };

const generateCertificateNumber = async (type) => {

    let number;

    while (true) {
        const seq = await repository.getNextSequenceNumber();
        number = String(seq).padStart(2, "0"); // 01, 02, 03...

        const exists = await repository.isCertificateNumberExists(number);

        if (!exists) break;
    }

    return number;

};
/* ===========================
   Create Certificate
=========================== */

exports.createCertificate = async (data) => {

    data.certificate_no =
        await generateCertificateNumber(
            data.certificate_type
        );

    const result =
        await repository.createCertificate(data);

    // WhatsApp bhejo — sirf tab jab PDF ka public URL available hai
    // (jaise data.pdf_url, agar aapka PDF-generation step controller
    // ya kisi upstream service me isse pehle set karta hai).
    // WhatsApp fail hone se certificate creation fail nahi hona chahiye,
    // isliye alag try-catch me rakha hai.
    if (data.pdf_url) {

        try {

            const student =
                await studentRepository.getStudentWhatsappData(
                    data.student_id
                );

                console.log(student);

            if (student) {

                await whatsappService.sendCertificate(

                    student,

                    data.certificate_type,

                    data.pdf_url

                );

            } else {

                console.error(
                    `[WhatsApp] Certificate alert skipped — student ${data.student_id} ka WhatsApp data nahi mila.`
                );

            }

        } catch (whatsappError) {

            console.error(
                "[WhatsApp] Certificate message failed:",
                whatsappError.message
            );

        }

    } else {

        console.warn(
            "[WhatsApp] Certificate created but data.pdf_url missing — WhatsApp message skip hua."
        );

    }

    return {

        certificate_id: result.insertId,

        certificate_no: data.certificate_no

    };

};

/* ===========================
   Get All
=========================== */

exports.getCertificates = async (query) => {

    return await repository.getCertificates(query);

};

/* ===========================
   Get By ID
=========================== */

exports.getCertificateById = async (id) => {

    const rows =
        await repository.getCertificateById(id);

    if (!rows.length) {

        throw new ApiError(
            404,
            "Certificate not found."
        );

    }

    return rows[0];

};

/* ===========================
   Update
=========================== */

exports.updateCertificate = async (

    id,

    data

) => {

    const certificate =
        await repository.getCertificateById(id);

    if (!certificate.length) {

        throw new ApiError(
            404,
            "Certificate not found."
        );

    }

    await repository.updateCertificate(

        id,

        data

    );

    return {

        message:
            "Certificate updated successfully."

    };

};

/* ===========================
   Delete
=========================== */

exports.deleteCertificate = async (id) => {

    const certificate =
        await repository.getCertificateById(id);

    if (!certificate.length) {

        throw new ApiError(
            404,
            "Certificate not found."
        );

    }

    await repository.deleteCertificate(id);

    return {

        message:
            "Certificate deleted successfully."

    };

};

exports.getBonafideData = async (studentId) => {

    const student =
        await repository.getStudentForCertificate(studentId);

    if (!student.length) {
        throw new ApiError(404, "Student not found.");
    }

    const school =
        await repository.getSchoolDetails();

    const academicYear =
        await repository.getCurrentAcademicYear();

    return {
        student: student[0],
        school,
        academicYear
    };

};


exports.getStudentCertificates = async (studentId) => {

    return await repository.getStudentCertificates(
        studentId
    );

};


exports.getPdfPathById = async (id) => {

    const record = await repository.getPdfPathById(id);

    if (!record) {
        throw new ApiError(404, "Certificate not found.");
    }

    return record;

};