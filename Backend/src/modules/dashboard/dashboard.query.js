/*
|--------------------------------------------------------------------------
| DASHBOARD QUERIES
|--------------------------------------------------------------------------
*/

exports.GET_TOTAL_STUDENTS = `
SELECT
    COUNT(*) AS total_students
FROM student
WHERE status = 'Active'
`;



exports.GET_ACTIVE_STUDENTS = `
SELECT
    COUNT(*) AS active_students
FROM student
WHERE status = 'Active'
`;



exports.GET_INACTIVE_STUDENTS = `
SELECT
    COUNT(*) AS inactive_students
FROM student
WHERE status = 'Inactive'
`;



exports.GET_TOTAL_USERS = `
SELECT
    COUNT(*) AS total_users
FROM user_login
WHERE is_active = 1
`;



exports.GET_TOTAL_CLASSES = `
SELECT
    COUNT(*) AS total_classes
FROM class_master
WHERE is_active = 1
`;


/*
|--------------------------------------------------------------------------
| TODAY ATTENDANCE
|--------------------------------------------------------------------------
*/

exports.GET_TODAY_ATTENDANCE = `
SELECT

COUNT(*) AS total_students,

SUM(
CASE
WHEN status = 'Present'
THEN 1
ELSE 0
END
) AS present_students,

SUM(
CASE
WHEN status = 'Absent'
THEN 1
ELSE 0
END
) AS absent_students

FROM attendance

WHERE attendance_date = CURDATE()
`;



/*
|--------------------------------------------------------------------------
| FEE SUMMARY
|--------------------------------------------------------------------------
*/

exports.GET_PENDING_FEES = `
SELECT

COALESCE(
SUM(balance_amount),
0
) AS pending_fee

FROM student_fees

WHERE balance_amount > 0
`;



exports.GET_TODAY_COLLECTION = `
SELECT
COALESCE(
SUM(total_amount),
0
) AS today_collection
FROM fee_collections
WHERE DATE(payment_date) = CURDATE()
`;



exports.GET_MONTHLY_COLLECTION = `
SELECT
COALESCE(
SUM(total_amount),
0
) AS monthly_collection
FROM fee_collections
WHERE
MONTH(payment_date) = MONTH(CURDATE())
AND YEAR(payment_date) = YEAR(CURDATE())
`;



/*
|--------------------------------------------------------------------------
| EXAMS
|--------------------------------------------------------------------------
*/

exports.GET_TOTAL_EXAMS = `
SELECT
COUNT(*) AS total_exams
FROM exams
`;



exports.GET_TOTAL_RESULTS = `
SELECT
COUNT(*) AS total_results
FROM results
`;



/*
|--------------------------------------------------------------------------
| CERTIFICATES
|--------------------------------------------------------------------------
*/

exports.GET_TOTAL_CERTIFICATES = `
SELECT
COUNT(*) AS total_certificates
FROM certificates
`;



/*
|--------------------------------------------------------------------------
| RECENT ADMISSIONS
|--------------------------------------------------------------------------
*/

exports.GET_RECENT_ADMISSIONS = `
SELECT

student_id,

admission_no,

roll_no,

CONCAT(
first_name,
' ',
last_name
) AS student_name,

created_at

FROM student

ORDER BY created_at DESC

LIMIT 5
`;



/*
|--------------------------------------------------------------------------
| RECENT FEE COLLECTIONS
|--------------------------------------------------------------------------
*/

exports.GET_RECENT_COLLECTIONS = `
SELECT

fc.collection_id,

fc.student_id,

CONCAT(
s.first_name,
' ',
s.last_name
) AS student_name,

fc.total_amount,

fc.payment_date,

fc.created_at

FROM fee_collections fc

LEFT JOIN student s
ON s.student_id = fc.student_id

ORDER BY fc.created_at DESC

LIMIT 5
`;



/*
|--------------------------------------------------------------------------
| LOW ATTENDANCE STUDENTS
|--------------------------------------------------------------------------
*/

exports.GET_LOW_ATTENDANCE = `
SELECT

a.student_id,

CONCAT(
s.first_name,
' ',
s.last_name
) AS student_name,

s.roll_no,

ROUND(

SUM(
CASE
WHEN a.status='Present'
THEN 1
ELSE 0
END
)
/
COUNT(*)
*100,

2

) AS attendance_percentage

FROM attendance a

LEFT JOIN student s
ON s.student_id=a.student_id

GROUP BY a.student_id

HAVING attendance_percentage < 75

ORDER BY attendance_percentage ASC

LIMIT 5
`;



/*
|--------------------------------------------------------------------------
| RESULT ANALYSIS
|--------------------------------------------------------------------------
*/

exports.GET_RESULT_ANALYSIS = `
SELECT

COUNT(*) AS total_results,

SUM(
CASE
WHEN result_status = 'PASS'
THEN 1
ELSE 0
END
) AS pass_count,

SUM(
CASE
WHEN result_status = 'FAIL'
THEN 1
ELSE 0
END
) AS fail_count,

ROUND(

COALESCE(

(
SUM(
CASE
WHEN result_status='PASS'
THEN 1
ELSE 0
END
)

/

NULLIF(COUNT(*),0)

)

*100,

0

),

2

) AS pass_percentage,

ROUND(

(
SUM(
CASE
WHEN result_status = 'FAIL'
THEN 1
ELSE 0
END
)
/
COUNT(*)
)
*100,

2

) AS fail_percentage

FROM results

WHERE status = 'Active'
`;