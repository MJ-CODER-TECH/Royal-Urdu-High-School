const pool = require("../../config/database");


exports.createWhatsappLog = async (data) => {

    const sql = `

    INSERT INTO whatsapp_log (

        student_id,
        parent_mobile,
        message_type,
        template_name,
        message,
        media_url,
        meta_message_id,
        status,
        error_message,
        sent_at

    )

    VALUES (?,?,?,?,?,?,?,?,?,?)

    `;

    const [result] = await pool.execute(sql, [

        data.student_id || null,

        data.parent_mobile,

        data.message_type,

        data.template_name,

        data.message,

        data.media_url || null,

        data.meta_message_id || null,

        data.status,

        data.error_message || null,

        data.sent_at || null

    ]);

    return result.insertId;

};


exports.updateWhatsappStatus = async (

    whatsappLogId,

    status,

    metaMessageId = null,

    errorMessage = null

) => {

    const sql = `

    UPDATE whatsapp_log

    SET

        status=?,

        meta_message_id = COALESCE(?, meta_message_id),

        error_message=?,

        sent_at=NOW()

    WHERE whatsapp_log_id=?

    `;

    await pool.execute(sql, [

        status,

        metaMessageId,

        errorMessage,

        whatsappLogId

    ]);

};


/*
|--------------------------------------------------------------------------
| Update Status By Meta Message ID (Webhook ke liye)
|--------------------------------------------------------------------------
| Meta jab delivered/read/failed webhook bhejta hai, uske paas humara
| internal whatsapp_log_id nahi hota — sirf meta_message_id hota hai.
| Isliye us column se match karke status update karte hain.
|--------------------------------------------------------------------------
*/

exports.updateStatusByMetaMessageId = async (

    metaMessageId,

    status,

    errorMessage = null

) => {

    const sql = `

    UPDATE whatsapp_log

    SET

        status = ?,

        error_message = COALESCE(?, error_message)

    WHERE meta_message_id = ?

    `;

    await pool.execute(sql, [

        status,

        errorMessage,

        metaMessageId

    ]);

};


exports.getWhatsappHistory = async (studentId) => {

    const sql = `

    SELECT *

    FROM whatsapp_log

    WHERE student_id=?

    ORDER BY whatsapp_log_id DESC

    `;

    const [rows] = await pool.execute(sql, [

        Number(studentId)

    ]);

    return rows;

};


exports.getPendingMessages = async () => {

    const sql = `

    SELECT *

    FROM whatsapp_log

    WHERE status='Pending'

    ORDER BY whatsapp_log_id ASC

    `;

    const [rows] = await pool.execute(sql);

    return rows;

};