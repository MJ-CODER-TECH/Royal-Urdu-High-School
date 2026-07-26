const TABLE = "student_fees";


exports.CREATE_STUDENT_FEE = `
INSERT INTO ${TABLE}
(
    student_id,
    academic_year_id,
    class_id,
    fee_head_id,
    total_fee,
    discount,
    fine,
    previous_balance,
    payable_amount,
    paid_amount,
    balance_amount,
    status,
    created_at,
    updated_at
)
VALUES
(
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
)
`;


exports.CREATE_FEE_ITEM = `

INSERT INTO fee_collection_items
(
    student_fee_id,
    fee_head_id,
    amount_paid
)

VALUES
(
    ?,
    ?,
    ?
)

`;


exports.GET_CLASS_STUDENTS = `

SELECT

student_id,

class_id

FROM student

WHERE class_id = ?

AND status='Active'

`;



exports.GET_FEE_STRUCTURE = `

SELECT

fee_head_id,

amount

FROM fee_structure

WHERE academic_year_id = ?

AND class_id = ?

AND status='Active'

`;



exports.CHECK_ALREADY_ASSIGNED = `

SELECT *

FROM student_fees

WHERE student_id = ?

AND academic_year_id = ?

LIMIT 1

`;



exports.GET_ALL = (limit,offset)=>`

SELECT

sf.student_fee_id,

sf.student_id,

sf.fee_head_id,  


s.admission_no,

TRIM(
    CONCAT(
        COALESCE(s.first_name,''),
        ' ',
        COALESCE(s.middle_name,''),
        ' ',
        COALESCE(s.last_name,'')
    )
) AS student_name,


cm.class_name,


CONCAT(
ay.year_start,
'-',
ay.year_end
) AS academic_year,


sf.total_fee,

sf.discount,

sf.fine,

sf.previous_balance,

sf.payable_amount,

sf.paid_amount,

sf.balance_amount,

sf.status,

sf.created_at


FROM student_fees sf


LEFT JOIN student s
ON s.student_id = sf.student_id


LEFT JOIN class_master cm
ON cm.class_id = sf.class_id


LEFT JOIN academic_year ay
ON ay.academic_year_id = sf.academic_year_id



WHERE

(
? IS NULL
OR s.admission_no LIKE ?
OR CONCAT(
COALESCE(s.first_name,''),
' ',
COALESCE(s.last_name,'')
)
LIKE ?
)


AND
(
? IS NULL
OR sf.class_id=?
)


AND
(
? IS NULL
OR sf.academic_year_id=?
)


AND
(
? IS NULL
OR sf.status=?
)


ORDER BY sf.student_fee_id DESC


LIMIT ${limit}

OFFSET ${offset}

`;




exports.COUNT_ALL = `

SELECT COUNT(*) total

FROM student_fees sf

LEFT JOIN student s
ON s.student_id = sf.student_id


WHERE

(
? IS NULL
OR s.admission_no LIKE ?
OR CONCAT(
COALESCE(s.first_name,''),
' ',
COALESCE(s.last_name,'')
)
LIKE ?
)


AND
(
? IS NULL
OR sf.class_id=?
)


AND
(
? IS NULL
OR sf.academic_year_id=?
)


AND
(
? IS NULL
OR sf.status=?
)

`;




exports.GET_SUMMARY = `

SELECT


COALESCE(SUM(total_fee),0) total_fee,

COALESCE(SUM(payable_amount),0) payable_amount,

COALESCE(SUM(paid_amount),0) paid_amount,

COALESCE(SUM(balance_amount),0) balance_amount


FROM student_fees


WHERE


(
? IS NULL
OR class_id=?
)


AND

(
? IS NULL
OR academic_year_id=?
)


AND

(
? IS NULL
OR status=?
)

`;



exports.CREATE_STUDENT_FEE_ITEM = `

INSERT INTO student_fee_items

(
 student_fee_id,
 fee_head_id,
 amount
)

VALUES
(
 ?,?,?
)

`;
exports.GET_ONE = `

SELECT

sf.student_fee_id,

sf.student_id,

sf.academic_year_id,

sf.class_id,

sf.total_fee,

sf.discount,

sf.fine,

sf.previous_balance,

sf.payable_amount,

sf.paid_amount,

sf.balance_amount,

sf.status,


s.admission_no,


CONCAT(
COALESCE(s.first_name,''),
' ',
COALESCE(s.middle_name,''),
' ',
COALESCE(s.last_name,'')
) AS student_name,


cm.class_name,


CONCAT(
ay.year_start,
'-',
ay.year_end
) AS academic_year


FROM student_fees sf


LEFT JOIN student s

ON s.student_id = sf.student_id


LEFT JOIN class_master cm

ON cm.class_id = sf.class_id


LEFT JOIN academic_year ay

ON ay.academic_year_id = sf.academic_year_id


WHERE sf.student_fee_id = ?

`;

exports.GET_ONE_ITEMS = `

SELECT

sfi.item_id,

sfi.amount,

fh.fee_name


FROM student_fee_items sfi


LEFT JOIN fee_heads fh

ON fh.fee_head_id = sfi.fee_head_id


WHERE sfi.student_fee_id = ?

`;