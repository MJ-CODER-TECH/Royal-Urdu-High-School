const TABLE = "exam_subjects";

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

exports.CREATE = `
INSERT INTO ${TABLE}
(
    exam_id,
    class_id,
    subject_id,
    max_marks,
    pass_marks,
    status,
    is_active,
    created_at,
    updated_at
)
VALUES
(
    ?, ?, ?, ?, ?, 'active', 1, NOW(), NOW()
)
`;

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.GET_ALL = `
SELECT
    es.exam_subject_id,

    e.academic_year_id,

    CONCAT(
        ay.year_start,
        '-',
        ay.year_end
    ) AS academic_year,

    es.exam_id,
    e.exam_name,

    es.class_id,
    cm.class_name,

    es.subject_id,
    s.subject_name,

    es.max_marks,
    es.pass_marks,

    es.status,
    es.is_active,

    es.created_at,
    es.updated_at

FROM ${TABLE} es

LEFT JOIN exams e
    ON e.exam_id = es.exam_id

LEFT JOIN academic_year ay
    ON ay.academic_year_id = e.academic_year_id

LEFT JOIN class_master cm
    ON cm.class_id = es.class_id

LEFT JOIN subjects s
    ON s.subject_id = es.subject_id

ORDER BY
    ay.year_start DESC,
    e.exam_name ASC,
    cm.class_name ASC,
    s.subject_name ASC
`;

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

exports.GET_BY_ID = `
SELECT
    *
FROM ${TABLE}
WHERE exam_subject_id = ?
`;

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.UPDATE = `
UPDATE ${TABLE}
SET
    exam_id = ?,
    class_id = ?,
    subject_id = ?,
    max_marks = ?,
    pass_marks = ?,
    updated_at = NOW()
WHERE exam_subject_id = ?
`;

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

exports.DELETE = `
DELETE FROM ${TABLE}
WHERE exam_subject_id = ?
`;

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.CHANGE_STATUS = `
UPDATE ${TABLE}
SET
    status = ?,
    updated_at = NOW()
WHERE exam_subject_id = ?
`;

/*
|--------------------------------------------------------------------------
| CHECK DUPLICATE
|--------------------------------------------------------------------------
*/
exports.CHECK_DUPLICATE = `
SELECT
    exam_subject_id
FROM ${TABLE}
WHERE
    exam_id = ?
    AND class_id = ?
    AND subject_id = ?
    AND exam_subject_id != ?
LIMIT 1
`;