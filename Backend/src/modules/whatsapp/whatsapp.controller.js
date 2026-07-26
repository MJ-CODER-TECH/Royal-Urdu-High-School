const service = require("./whatsapp.service");
const meta = require("./whatsapp.meta");
const template = require("./whatsapp.template");


/*
|--------------------------------------------------------------------------
| Admission Confirmation
|--------------------------------------------------------------------------
*/

exports.sendAdmissionConfirmation = async (req, res) => {

    const student = req.body;

    const message =
        template.admissionConfirmation(student);

    const logId =
        await service.createPendingLog({

            student_id: student.student_id,

            parent_mobile: student.parent_mobile,

            message_type: "Admission",

            template_name: "Admission Confirmation",

            message

        });
const response = await meta.sendTemplateMessage(
    student.parent_mobile,
    "admission_confirmation",
    "en_US",
    [
        student.student_name,
        student.school_name,
        student.admission_no,
        student.class_name,
        student.section_name
    ]
);

console.log("TEMPLATE RESPONSE:");
console.log(response);

    if (response.success) {

        await service.markAsSent(

            logId,

            response.messageId

        );

    } else {

        await service.markAsFailed(

            logId,

            JSON.stringify(response.error)

        );

    }

    res.status(200).json(response);

};



/*
|--------------------------------------------------------------------------
| Student Absent Alert
|--------------------------------------------------------------------------
*/

exports.sendAbsentAlert = async (req, res) => {

    const {

        student,

        attendanceDate

    } = req.body;

    const message =
        template.studentAbsentAlert(

            student,

            attendanceDate

        );

    const logId =
        await service.createPendingLog({

            student_id: student.student_id,

            parent_mobile: student.parent_mobile,

            message_type: "Attendance",

            template_name: "Absent Alert",

            message

        });

   const response = await meta.sendTemplateMessage(
    student.parent_mobile,
    "student_absent_alert",
    "en_US",
    [
        student.student_name,
        student.class_name,
        student.section_name,
        attendanceDate
    ]
);

console.log("TEMPLATE RESPONSE:");
console.log(response);

    if (response.success) {

        await service.markAsSent(

            logId,

            response.messageId

        );

    } else {

        await service.markAsFailed(

            logId,

            JSON.stringify(response.error)

        );

    }

    res.status(200).json(response);

};



/*
|--------------------------------------------------------------------------
| Certificate PDF
|--------------------------------------------------------------------------
*/

exports.sendCertificate = async (req, res) => {

    const {

        student,

        certificateType,

        pdfUrl

    } = req.body;

    const message =
        template.certificateGenerated(

            student,

            certificateType

        );

    const logId =
        await service.createPendingLog({

            student_id: student.student_id,

            parent_mobile: student.parent_mobile,

            message_type: "Certificate",

            template_name: certificateType,

            message,

            media_url: pdfUrl

        });

  const response = await meta.sendDocumentTemplate(
    student.parent_mobile,
    "certificate_generated",
    "en_US",
    pdfUrl,
    `${certificateType}.pdf`,
    [
        certificateType,
        student.student_name,
        student.admission_no
    ]
);

console.log("TEMPLATE RESPONSE:");
console.log(response);

    if (response.success) {

        await service.markAsSent(

            logId,

            response.messageId

        );

    } else {

        await service.markAsFailed(

            logId,

            JSON.stringify(response.error)

        );

    }

    res.status(200).json(response);

};