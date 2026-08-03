const db = require("../../config/database");

// =======================================
// Get Students For Promotion
// =======================================
exports.getStudentsForPromotion = async ({
academic_year_id,
class_id,
section_id
}) => {

const [rows] = await db.query(
    `
    SELECT
        s.student_id,
        s.admission_no,
        s.roll_no,

        CONCAT_WS(
            ' ',
            s.first_name,
            s.middle_name,
            s.last_name
        ) AS student_name,

        s.class_id,
        s.section_id,

        cm.class_name,
        sm.section_name,

        s.status

    FROM student s

    JOIN class_master cm
        ON cm.class_id = s.class_id

    JOIN section_master sm
        ON sm.section_id = s.section_id

    WHERE
        s.academic_year_id = ?
        AND s.class_id = ?
        AND s.section_id = ?
        AND s.status = 'Active'

    ORDER BY CAST(s.roll_no AS UNSIGNED)
    `,
    [
        academic_year_id,
        class_id,
        section_id
    ]
);

return rows;

};

// =======================================
// Check Already Promoted
// =======================================
exports.checkAlreadyPromoted = async (
studentId,
academicYearId,
connection
) => {

const [rows] = await connection.query(
    `
    SELECT history_id

    FROM student_academic_history

    WHERE
        student_id = ?
        AND academic_year_id = ?

    LIMIT 1
    `,
    [
        studentId,
        academicYearId
    ]
);

return rows.length > 0;

};

// =======================================
// Update Current Student Class
// =======================================
exports.updateStudent = async (
data,
connection
) => {

const [result] = await connection.query(
    `
    UPDATE student

    SET
        academic_year_id = ?,
        class_id = ?,
        section_id = ?,
        roll_no = ?

    WHERE student_id = ?
    `,
    [
        data.academic_year_id,
        data.class_id,
        data.section_id,
        data.roll_no,
        data.student_id
    ]
);

if (result.affectedRows === 0) {

    const error = new Error(
        `Student ID ${data.student_id} was not found in the student table.`
    );

    error.status = 404;

    throw error;
}

};

// =======================================
// Insert Academic History
// =======================================
// =======================================
// Insert Academic History
// =======================================
exports.insertHistory = async (
    data,
    connection
) => {

    const [result] = await connection.query(
        `
        INSERT INTO student_academic_history
        (
            student_id,
            academic_year_id,
            class_id,
            section_id,
            roll_no,
            status,
            promoted_at
        )
        VALUES (?, ?, ?, ?, ?, ?, NOW())
        `,
        [
            data.student_id,
            data.academic_year_id,
            data.class_id,
            data.section_id,
            data.roll_no,
            data.status
        ]
    );

    return result;

};
// =======================================
// Promotion Log
// =======================================
exports.createPromotionLog = async (
data,
connection
) => {

await connection.query(
    `
    INSERT INTO promotion_log
    (
        from_academic_year_id,
        to_academic_year_id,
        from_class_id,
        to_class_id,
        promoted_by,
        total_students
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
        data.fromAcademicYearId,
        data.toAcademicYearId,
        data.fromClassId,
        data.toClassId,
        data.promotedBy,
        data.totalStudents
    ]
);

};

// =======================================
// Promotion History
// =======================================
exports.getPromotionHistory = async ({
academic_year_id,
class_id,
section_id
}) => {

const params = [
    academic_year_id,
    class_id
];

let sectionClause = "";

if (section_id) {

    sectionClause = `
        AND sah.section_id = ?
    `;

    params.push(
        section_id
    );
}


const [rows] = await db.query(
    `
    SELECT

        sah.history_id,

        s.admission_no,

        CONCAT_WS(
            ' ',
            s.first_name,
            s.middle_name,
            s.last_name
        ) AS student_name,

        cm.class_name,

        sm.section_name,

        sah.status,

        sah.promoted_at


    FROM student_academic_history sah


    JOIN student s

        ON s.student_id = sah.student_id


    JOIN class_master cm

        ON cm.class_id = sah.class_id


    JOIN section_master sm

        ON sm.section_id = sah.section_id


    WHERE

        sah.academic_year_id = ?

        AND sah.class_id = ?

        ${sectionClause}


    ORDER BY

        sah.promoted_at DESC
    `,
    params
);


return rows;


};



