const TABLE = "exams";


exports.GET_ALL_EXAMS = `
SELECT
    e.exam_id,
    e.class_id,
    c.class_name,
    e.academic_year_id,
    ay.year_start,
    ay.year_end,
    e.exam_name,
    e.exam_date,
    e.max_marks,
    e.status
FROM ${TABLE} e

LEFT JOIN class_master c
ON c.class_id = e.class_id

LEFT JOIN academic_year ay
ON ay.academic_year_id = e.academic_year_id

ORDER BY e.exam_id DESC
`;


exports.GET_EXAM_BY_ID = `
SELECT
    *
FROM ${TABLE}
WHERE exam_id = ?
`;


exports.CREATE_EXAM = `
INSERT INTO ${TABLE}
(
    class_id,
    academic_year_id,
    exam_name,
    exam_date,
    max_marks
)
VALUES
(
    ?,?,?,?,?
)
`;


exports.UPDATE_EXAM = `
UPDATE ${TABLE}
SET
    class_id = ?,
    academic_year_id = ?,
    exam_name = ?,
    exam_date = ?,
    max_marks = ?
WHERE exam_id = ?
`;


exports.DELETE_EXAM = `
DELETE FROM ${TABLE}
WHERE exam_id = ?
`;


exports.CHANGE_EXAM_STATUS = `
UPDATE exams
SET
    status = ?
WHERE
    exam_id = ?
`;