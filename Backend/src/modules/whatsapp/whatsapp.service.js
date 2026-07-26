const repository = require("./whatsapp.repository");
const meta = require("./whatsapp.meta");
const template = require("./whatsapp.template");
const { STATUS } = require("./whatsapp.constants");

/*
|--------------------------------------------------------------------------
| Create Pending Log
|--------------------------------------------------------------------------
*/

exports.createPendingLog = async (data) => {

    return await repository.createWhatsappLog({

        student_id: data.student_id || null,

        parent_mobile: meta.normalizeMobile(data.parent_mobile),

        message_type: data.message_type,

        template_name: data.template_name,

        message: data.message,

        media_url: data.media_url || null,

        meta_message_id: null,

        status: STATUS.PENDING,

        error_message: null,

        sent_at: null

    });

};


/*
|--------------------------------------------------------------------------
| Mark As Sent
|--------------------------------------------------------------------------
*/

exports.markAsSent = async (whatsappLogId, metaMessageId) => {

    await repository.updateWhatsappStatus(

        whatsappLogId,

        STATUS.SENT,

        metaMessageId,

        null

    );

};


/*
|--------------------------------------------------------------------------
| Mark As Failed
|--------------------------------------------------------------------------
*/

exports.markAsFailed = async (whatsappLogId, error) => {

    await repository.updateWhatsappStatus(

        whatsappLogId,

        STATUS.FAILED,

        null,

        typeof error === "string" ? error : JSON.stringify(error)

    );

};


/*
|--------------------------------------------------------------------------
| Student History
|--------------------------------------------------------------------------
*/

exports.getStudentWhatsappHistory = async (studentId) => {

    return await repository.getWhatsappHistory(studentId);

};


/*
|--------------------------------------------------------------------------
| Pending Queue
|--------------------------------------------------------------------------
*/

exports.getPendingQueue = async () => {

    return await repository.getPendingMessages();

};


/*
|--------------------------------------------------------------------------
| Admission Confirmation
|--------------------------------------------------------------------------
| PRODUCTION: Meta Business Manager me pehle se "admission_confirmation"
| naam ka APPROVED template bana hona chahiye, is structure ke saath:
|
|   Dear Parent,
|   Your child {{1}} has been successfully admitted to {{2}}.
|   Admission No : {{3}}
|   Class : {{4}}
|   Section : {{5}}
|   Thank you.
|   {{2}}
|--------------------------------------------------------------------------
*/

exports.sendAdmissionConfirmation = async (student) => {

    // Log ke liye readable message bhi save karte hain (audit trail)
    const message = template.admissionConfirmation(student);

    const whatsappLogId = await exports.createPendingLog({

        student_id: student.student_id,

        parent_mobile: student.parent_mobile,

        message_type: "Admission",

        template_name: "admission_confirmation",

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
console.log(JSON.stringify(response, null, 2));
    if (response.success) {

        await exports.markAsSent(whatsappLogId, response.messageId);

    } else {

        await exports.markAsFailed(whatsappLogId, response.error);

    }

    return response;

};


/*
|--------------------------------------------------------------------------
| Student Absent Alert
|--------------------------------------------------------------------------
| PRODUCTION: "student_absent_alert" naam ka APPROVED template chahiye:
|
|   Dear Parent,
|   Your child {{1}} (Class {{2}} - {{3}}) was marked ABSENT on {{4}}.
|   If this is incorrect, kindly contact the school office immediately.
|
| Note: Meta trailing-variable rule ki wajah se school_name yahan
| variable ke taur pe nahi bheja jaata (template ke end me static
| text hona zaroori tha).
|--------------------------------------------------------------------------
*/

exports.sendAbsentAlert = async (student, attendanceDate) => {

    const message = template.studentAbsentAlert(student, attendanceDate);

    const whatsappLogId = await exports.createPendingLog({

        student_id: student.student_id,

        parent_mobile: student.parent_mobile,

        message_type: "Attendance",

        template_name: "student_absent_alert",

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

    if (response.success) {

        await exports.markAsSent(whatsappLogId, response.messageId);

    } else {

        await exports.markAsFailed(whatsappLogId, response.error);

    }

    return response;

};


/*
|--------------------------------------------------------------------------
| Certificate PDF
|--------------------------------------------------------------------------
| PRODUCTION: "certificate_generated" naam ka APPROVED template chahiye,
| jiska HEADER type "Document" set ho, aur body me variables ho:
|
|   Header: [Document attachment]
|   Body:
|   Dear Parent,
|   {{1}} has been generated successfully for {{2}}.
|   Admission No : {{3}}
|   Please find the attached PDF below. Thank you.
|
| Note: (1) pdfUrl publicly accessible HTTPS link hona chahiye (Meta
| server se fetch hota hai) — localhost URL kaam nahi karega.
| (2) Meta trailing-variable rule ki wajah se school_name yahan
| variable ke taur pe nahi bheja jaata.
|--------------------------------------------------------------------------
*/

exports.sendCertificate = async (student, certificateType, pdfUrl) => {

    const message = template.certificateGenerated(student, certificateType);

    const whatsappLogId = await exports.createPendingLog({

        student_id: student.student_id,

        parent_mobile: student.parent_mobile,

        message_type: "Certificate",

        template_name: "certificate_generated",

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

    if (response.success) {

        await exports.markAsSent(whatsappLogId, response.messageId);

    } else {

        await exports.markAsFailed(whatsappLogId, response.error);

    }

    return response;

};


/*
|--------------------------------------------------------------------------
| Generic Send (custom payload — Postman/manual testing ke liye)
|--------------------------------------------------------------------------
| Agar payload me template_name diya hai -> template message bhejo.
| Warna plain text bhejo (sirf session window ke andar kaam karega).
|--------------------------------------------------------------------------
*/

exports.sendWhatsappMessage = async (payload) => {

    const whatsappLogId = await exports.createPendingLog(payload);

    let response;

    if (payload.template_name) {

        response = await meta.sendTemplateMessage(

            payload.parent_mobile,

            payload.template_name,

            payload.language_code || "en_US",

            payload.params || []

        );

    } else {

        response = await meta.sendTextMessage(

            payload.parent_mobile,

            payload.message

        );

    }

    if (response.success) {

        await exports.markAsSent(whatsappLogId, response.messageId);

    } else {

        await exports.markAsFailed(whatsappLogId, response.error);

    }

    return { ...response, whatsappLogId };

};


/*
|--------------------------------------------------------------------------
| Retry Pending / Failed Queue
|--------------------------------------------------------------------------
| Cron job ya manual trigger se call karo — pehle se "Pending" pade hue
| messages (jo kisi wajah se turant nahi bheje ja sake) resend karta hai.
| Sirf template messages retry karo (safe hai) — plain text retry se
| duplicate/inconsistent behaviour ho sakta hai.
|--------------------------------------------------------------------------
*/

exports.processPendingQueue = async () => {

    const pending = await exports.getPendingQueue();

    const results = [];

    for (const item of pending) {

        if (!item.template_name) {

            // Template naam nahi hai toh skip karo — safe retry nahi hai
            continue;

        }

        const response = await meta.sendTemplateMessage(

            item.parent_mobile,

            item.template_name,

            "en_US",

            [] // Body params yahan reconstruct nahi ho sakte agar save nahi kiye — 
               // production me params bhi log table me JSON column me save karna behtar hai

        );

        if (response.success) {

            await exports.markAsSent(item.whatsapp_log_id, response.messageId);

        } else {

            await exports.markAsFailed(item.whatsapp_log_id, response.error);

        }

        results.push({ whatsappLogId: item.whatsapp_log_id, ...response });

    }

    return results;

};


/*
|--------------------------------------------------------------------------
| Webhook: Meta Status Update Handler
|--------------------------------------------------------------------------
| Meta ka delivery/read status webhook isi function ko call karega.
| Isse whatsapp_log table me "Sent" -> "Delivered" -> "Read" automatically
| update hota hai (currently ye statuses code create hi nahi karta tha).
|--------------------------------------------------------------------------
*/

exports.handleStatusWebhook = async (body) => {

    try {

        const entries = body.entry || [];

        for (const entry of entries) {

            const changes = entry.changes || [];

            for (const change of changes) {

                const statuses = change.value?.statuses || [];

                for (const statusUpdate of statuses) {

                    const metaMessageId = statusUpdate.id;

                    const status = statusUpdate.status; // sent | delivered | read | failed

                    if (!metaMessageId || !status) continue;

                    const mappedStatus =

                        status === "delivered" ? STATUS.DELIVERED :

                        status === "read" ? STATUS.READ :

                        status === "failed" ? STATUS.FAILED :

                        STATUS.SENT;

                    await repository.updateStatusByMetaMessageId(

                        metaMessageId,

                        mappedStatus,

                        status === "failed"
                            ? JSON.stringify(statusUpdate.errors || {})
                            : null

                    );

                }

            }

        }

    } catch (error) {

        console.error("[WhatsApp][Webhook] processing error:", error.message);

    }

};