const TABLE = "fee_collections";



// ======================================
// CREATE COLLECTION
// ======================================

exports.CREATE_COLLECTION = `
INSERT INTO ${TABLE}
(
    receipt_no,
    student_id,
    payment_date,
    payment_mode,
    total_amount,
    reference_no,
    remarks,
    collected_by,
    created_at,
    updated_at
)
VALUES
(
    ?,?,?,?,?,?,?,?,
    NOW(),
    NOW()
)
`;



// ======================================
// CREATE COLLECTION ITEM
// ======================================

exports.CREATE_COLLECTION_ITEM = `
INSERT INTO fee_collection_items
(
    collection_id,
    student_fee_id,
    fee_head_id,
    amount_paid
)
VALUES
(
    ?,?,?,?
)
`;



// ======================================
// UPDATE STUDENT FEE
// ======================================

exports.UPDATE_STUDENT_FEE = `
UPDATE student_fees

SET

paid_amount = paid_amount + ?,

balance_amount = balance_amount - ?,

status =

CASE

WHEN balance_amount - ? <= 0
THEN 'Paid'

ELSE 'Partial'

END,

updated_at = NOW()

WHERE student_fee_id = ?
`;



// ======================================
// GET STUDENT FEE
// ======================================

exports.GET_STUDENT_FEE = `
SELECT *

FROM student_fees

WHERE student_fee_id = ?
`;



// ======================================
// UPDATE RECEIPT NUMBER
// ======================================

exports.UPDATE_RECEIPT_NO = `
UPDATE fee_collections

SET receipt_no = ?

WHERE collection_id = ?
`;



// ======================================
// GET RECEIPT BY ID
// ======================================

exports.GET_RECEIPT = `
SELECT

fc.*,

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

CONCAT(
    ay.year_start,
    '-',
    ay.year_end
) AS academic_year

FROM fee_collections fc

INNER JOIN student s
ON s.student_id = fc.student_id

INNER JOIN fee_collection_items fci
ON fci.collection_id = fc.collection_id

INNER JOIN student_fees sf
ON sf.student_fee_id = fci.student_fee_id

INNER JOIN class_master cm
ON cm.class_id = sf.class_id

INNER JOIN academic_year ay
ON ay.academic_year_id = sf.academic_year_id

WHERE fc.collection_id = ?
`;



// ======================================
// GET ALL
// ======================================

exports.GET_ALL = (limit, offset) => `
SELECT DISTINCT

fc.collection_id,
fc.receipt_no,
fc.payment_date,
fc.payment_mode,
fc.total_amount,
fc.reference_no,
fc.created_at,

s.student_id,
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

sec.section_name,

CONCAT(
    ay.year_start,
    '-',
    ay.year_end
) AS academic_year

FROM fee_collections fc

INNER JOIN student s
ON s.student_id = fc.student_id

INNER JOIN fee_collection_items fci
ON fci.collection_id = fc.collection_id

INNER JOIN student_fees sf
ON sf.student_fee_id = fci.student_fee_id

INNER JOIN class_master cm
ON cm.class_id = sf.class_id

INNER JOIN academic_year ay
ON ay.academic_year_id = sf.academic_year_id

LEFT JOIN section_master sec
ON sec.section_id = s.section_id

WHERE

(
    ? IS NULL
    OR fc.receipt_no LIKE ?
    OR s.admission_no LIKE ?
    OR TRIM(
    CONCAT(
        COALESCE(s.first_name,''),
        ' ',
        COALESCE(s.middle_name,''),
        ' ',
        COALESCE(s.last_name,'')
    )
) LIKE ?
)

AND
(
    ? IS NULL
    OR sf.academic_year_id = ?
)

AND
(
    ? IS NULL
    OR sf.class_id = ?
)

AND
(
    ? IS NULL
    OR s.section_id = ?
)

AND
(
    ? IS NULL
    OR fc.payment_mode = ?
)

ORDER BY fc.collection_id DESC

LIMIT ${limit}
OFFSET ${offset}
`;



// ======================================
// COUNT ALL
// ======================================

exports.COUNT_ALL = `
SELECT COUNT(DISTINCT fc.collection_id) AS total

FROM fee_collections fc

INNER JOIN student s
ON s.student_id = fc.student_id

INNER JOIN fee_collection_items fci
ON fci.collection_id = fc.collection_id

INNER JOIN student_fees sf
ON sf.student_fee_id = fci.student_fee_id

WHERE

(
    ? IS NULL
    OR fc.receipt_no LIKE ?
    OR s.admission_no LIKE ?
    OR CONCAT(
        s.first_name,
        ' ',
        COALESCE(s.last_name,'')
    ) LIKE ?
)

AND
(
    ? IS NULL
    OR sf.academic_year_id = ?
)

AND
(
    ? IS NULL
    OR sf.class_id = ?
)

AND
(
    ? IS NULL
    OR s.section_id = ?
)

AND
(
    ? IS NULL
    OR fc.payment_mode = ?
)
`;



// ======================================
// SUMMARY
// ======================================

exports.GET_SUMMARY = `
SELECT

COUNT(*) AS total_receipts,

COALESCE(
SUM(total_amount),
0
) AS total_collection,

COALESCE(

SUM(

CASE

WHEN payment_date = CURDATE()

THEN total_amount

ELSE 0

END

),

0

) AS today_collection,

COALESCE(

SUM(

CASE

WHEN MONTH(payment_date)=MONTH(CURDATE())

AND YEAR(payment_date)=YEAR(CURDATE())

THEN total_amount

ELSE 0

END

),

0

) AS monthly_collection

FROM fee_collections
`;



// ======================================
// DELETE ITEMS
// ======================================

exports.DELETE_COLLECTION_ITEMS = `
DELETE

FROM fee_collection_items

WHERE collection_id = ?
`;



// ======================================
// DELETE RECEIPT
// ======================================

exports.DELETE_RECEIPT = `
DELETE

FROM fee_collections

WHERE collection_id = ?
`;