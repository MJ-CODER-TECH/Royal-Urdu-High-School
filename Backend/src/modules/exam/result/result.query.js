const TABLE = "results";


exports.CREATE = `

INSERT INTO ${TABLE}
(
student_id,
academic_year_id,
class_id,
section_id,
exam_id,
total_marks,
obtained_marks,
percentage,
grade,
result_status
)

VALUES (?,?,?,?,?,?,?,?,?,?)

`;


exports.GET_ALL = `

SELECT 

r.*,

s.roll_no,

TRIM(
    CONCAT(
        COALESCE(s.first_name,''),
        ' ',
        COALESCE(s.middle_name,''),
        ' ',
        COALESCE(s.last_name,'')
    )
) student_name,


e.exam_name


FROM results r


LEFT JOIN student s

ON s.student_id=r.student_id


LEFT JOIN exams e

ON e.exam_id=r.exam_id


ORDER BY r.result_id DESC

`;


exports.GET_BY_ID = `

SELECT *
FROM ${TABLE}
WHERE result_id=?

`;



exports.GET_BY_FILTER = `

SELECT

r.*,

s.roll_no,

TRIM(
    CONCAT(
        COALESCE(s.first_name,''),
        ' ',
        COALESCE(s.middle_name,''),
        ' ',
        COALESCE(s.last_name,'')
    )
) AS student_name,

e.exam_name

FROM results r

LEFT JOIN student s
ON s.student_id = r.student_id

LEFT JOIN exams e
ON e.exam_id = r.exam_id

WHERE
r.exam_id = ?
AND r.class_id = ?
AND r.section_id = ?

ORDER BY s.roll_no ASC

`;



exports.DELETE = `

DELETE FROM ${TABLE}
WHERE result_id=?

`;


exports.GET_MARKS_FOR_RESULT = `

SELECT

m.student_id,

s.roll_no,

m.academic_year_id,

m.class_id,

m.section_id,

m.exam_id,


SUM(m.max_marks) total_marks,

SUM(m.obtained_marks) obtained_marks


FROM marks m


LEFT JOIN student s

ON s.student_id = m.student_id


WHERE

m.academic_year_id=?

AND m.class_id=?

AND m.section_id=?

AND m.exam_id=?


GROUP BY

m.student_id

`;