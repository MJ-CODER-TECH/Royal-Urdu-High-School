const pool = require("../../config/database");


// ===========================================
// Get All Subjects
// ===========================================

exports.getSubjects = async () => {

    const [rows] = await pool.execute(`
        SELECT
            s.subject_id,
            s.subject_name,
            s.class_id,
            c.class_name,
            s.short_code,
            s.theory_marks,
            s.practical_marks,
            s.is_active

        FROM subjects s

        LEFT JOIN class_master c
            ON c.class_id = s.class_id

        ORDER BY
            s.class_id ASC,
            s.subject_name ASC
    `);

    return rows;

};


// ===========================================
// Get Subject By ID
// ===========================================

exports.getSubjectById = async (id) => {

    const [rows] = await pool.execute(`
        SELECT
            subject_id,
            subject_name,
            class_id,
            short_code,
            theory_marks,
            practical_marks,
            is_active

        FROM subjects

        WHERE subject_id = ?

        LIMIT 1
    `, [id]);

    return rows[0];

};


// ===========================================
// Check Duplicate Subject
// ===========================================

exports.findDuplicateSubject = async (
    subjectName,
    classId,
    excludeId = null
) => {

    let sql = `
        SELECT subject_id

        FROM subjects

        WHERE
            LOWER(subject_name) = LOWER(?)
            AND class_id = ?
    `;

    const params = [
        subjectName,
        classId
    ];

    if (excludeId) {

        sql += `
            AND subject_id != ?
        `;

        params.push(excludeId);

    }

    sql += `
        LIMIT 1
    `;

    const [rows] = await pool.execute(
        sql,
        params
    );

    return rows[0];

};


// ===========================================
// Create Subject
// ===========================================

exports.createSubject = async (data) => {

    const [result] = await pool.execute(`
        INSERT INTO subjects
        (
            subject_name,
            class_id,
            short_code,
            theory_marks,
            practical_marks,
            is_active
        )

        VALUES
        (
            ?, ?, ?, ?, ?, ?
        )
    `, [
        data.subject_name,
        data.class_id,
        data.short_code || null,
        data.theory_marks,
        data.practical_marks,
        data.is_active
    ]);

    return result;

};


// ===========================================
// Update Subject
// ===========================================

exports.updateSubject = async (
    id,
    data
) => {

    const [result] = await pool.execute(`
        UPDATE subjects

        SET
            subject_name = ?,
            class_id = ?,
            short_code = ?,
            theory_marks = ?,
            practical_marks = ?,
            is_active = ?

        WHERE subject_id = ?
    `, [
        data.subject_name,
        data.class_id,
        data.short_code || null,
        data.theory_marks,
        data.practical_marks,
        data.is_active,
        id
    ]);

    return result;

};


// ===========================================
// Delete Subject
// ===========================================

exports.deleteSubject = async (id) => {

    const [result] = await pool.execute(`
        DELETE FROM subjects

        WHERE subject_id = ?
    `, [id]);

    return result;

};


// ===========================================
// Change Subject Status
// ===========================================

exports.changeSubjectStatus = async (
    id,
    isActive
) => {

    const [result] = await pool.execute(`
        UPDATE subjects

        SET is_active = ?

        WHERE subject_id = ?
    `, [
        isActive,
        id
    ]);

    return result;

};