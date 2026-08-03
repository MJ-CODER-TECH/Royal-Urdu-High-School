const TABLE = "marks";

/*
|--------------------------------------------------------------------------
| CREATE MARK
|--------------------------------------------------------------------------
*/

exports.CREATE = `
INSERT INTO ${TABLE}
(
    student_id,
    academic_year_id,
    class_id,
    section_id,
    exam_id,
    subject_id,
    max_marks,
    obtained_marks,
    grade,
    remark,
    status,
    created_at,
    updated_at
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
    NOW(),
    NOW()
)
`;


/*
|--------------------------------------------------------------------------
| BULK CREATE MARKS
|--------------------------------------------------------------------------
*/

exports.BULK_CREATE = `
INSERT INTO marks
(
    student_id,
    academic_year_id,
    class_id,
    section_id,
    exam_id,
    subject_id,
    max_marks,
    obtained_marks,
    grade,
    remark,
    status,
    created_at,
    updated_at
)
VALUES ?

ON DUPLICATE KEY UPDATE

max_marks = VALUES(max_marks),
obtained_marks = VALUES(obtained_marks),
grade = VALUES(grade),
remark = VALUES(remark),
status = VALUES(status),
updated_at = NOW()
`;


/*
|--------------------------------------------------------------------------
| GET ALL MARKS
|--------------------------------------------------------------------------
*/

exports.GET_ALL = `
SELECT
    m.mark_id,
    m.student_id,

    TRIM(
        CONCAT(
            COALESCE(s.first_name, ''),
            ' ',
            COALESCE(s.middle_name, ''),
            ' ',
            COALESCE(s.last_name, '')
        )
    ) AS student_name,

    sah.roll_no,

    m.academic_year_id,

    CONCAT(
        ay.year_start,
        ' - ',
        ay.year_end
    ) AS academic_year,

    m.class_id,
    c.class_name,

    m.section_id,
    sec.section_name,

    m.exam_id,
    e.exam_name,

    m.subject_id,
    sub.subject_name,

    m.max_marks,
    m.obtained_marks,
    m.grade,
    m.remark,
    m.status

FROM ${TABLE} m

LEFT JOIN student s
    ON s.student_id = m.student_id

LEFT JOIN student_academic_history sah
    ON sah.student_id = m.student_id
    AND sah.academic_year_id = m.academic_year_id

LEFT JOIN academic_year ay
    ON ay.academic_year_id = m.academic_year_id

LEFT JOIN class_master c
    ON c.class_id = m.class_id

LEFT JOIN section_master sec
    ON sec.section_id = m.section_id

LEFT JOIN exams e
    ON e.exam_id = m.exam_id

LEFT JOIN subjects sub
    ON sub.subject_id = m.subject_id

ORDER BY
    CAST(sah.roll_no AS UNSIGNED)
`;


/*
|--------------------------------------------------------------------------
| GET MARK BY ID
|--------------------------------------------------------------------------
*/

exports.GET_BY_ID = `
SELECT *
FROM ${TABLE}
WHERE mark_id = ?
`;


/*
|--------------------------------------------------------------------------
| GET MARKS BY FILTER
|--------------------------------------------------------------------------
*/

exports.GET_BY_FILTER = `
SELECT
    m.*,

    TRIM(
        CONCAT(
            COALESCE(s.first_name, ''),
            ' ',
            COALESCE(s.middle_name, ''),
            ' ',
            COALESCE(s.last_name, '')
        )
    ) AS student_name,

    sah.roll_no

FROM ${TABLE} m

LEFT JOIN student s
    ON s.student_id = m.student_id

LEFT JOIN student_academic_history sah
    ON sah.student_id = m.student_id
    AND sah.academic_year_id = m.academic_year_id

WHERE
    m.academic_year_id = ?
    AND m.class_id = ?
    AND m.section_id = ?
    AND m.exam_id = ?
    AND m.subject_id = ?

ORDER BY
    CAST(sah.roll_no AS UNSIGNED)
`;


/*
|--------------------------------------------------------------------------
| UPDATE MARK
|--------------------------------------------------------------------------
*/

exports.UPDATE = `
UPDATE ${TABLE}

SET
    max_marks = ?,
    obtained_marks = ?,
    grade = ?,
    remark = ?,
    status = ?,
    updated_at = NOW()

WHERE
    mark_id = ?
`;


/*
|--------------------------------------------------------------------------
| DELETE MARK
|--------------------------------------------------------------------------
*/

exports.DELETE = `
DELETE FROM ${TABLE}
WHERE mark_id = ?
`;


/*
|--------------------------------------------------------------------------
| CHECK EXISTING MARK
|--------------------------------------------------------------------------
*/

exports.CHECK_EXIST = `
SELECT
    mark_id

FROM ${TABLE}

WHERE
    student_id = ?
    AND academic_year_id = ?
    AND class_id = ?
    AND section_id = ?
    AND exam_id = ?
    AND subject_id = ?

LIMIT 1
`;


/*
|--------------------------------------------------------------------------
| GET STUDENTS FOR MARK ENTRY
|--------------------------------------------------------------------------
|
| Student ka current academic data:
|
| student_academic_history
|
| admission table use nahi karna because:
|
| admission me student ka record available nahi hai.
|
*/

exports.GET_STUDENTS_FOR_MARKS = `
SELECT
    s.student_id,

    s.roll_no,

    s.admission_no,

    TRIM(
        CONCAT(
            COALESCE(s.first_name, ''),
            ' ',
            COALESCE(s.middle_name, ''),
            ' ',
            COALESCE(s.last_name, '')
        )
    ) AS student_name,

    100 AS max_marks,

    m.mark_id,

    m.max_marks AS saved_max_marks,

    m.obtained_marks,

    m.grade,

    m.remark,

    m.status

FROM student s

LEFT JOIN marks m
    ON m.student_id = s.student_id

    AND m.academic_year_id = ?

    AND m.class_id = ?

    AND m.section_id = ?

    AND m.exam_id = ?

    AND m.subject_id = ?

WHERE

    s.academic_year_id = ?

    AND s.class_id = ?

    AND s.section_id = ?

    AND s.status = 'Active'

ORDER BY
    CAST(s.roll_no AS UNSIGNED) ASC
`;