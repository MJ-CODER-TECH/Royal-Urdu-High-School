const TABLE = "fee_structure";

exports.CREATE = `
INSERT INTO ${TABLE}
(
    academic_year_id,
    class_id,
    fee_head_id,
    amount,
    due_date,
    installment_no,
    status,
    created_at,
    updated_at
)
VALUES
(
    ?,?,?,?,?,?,?,NOW(),NOW()
)
`;

exports.BULK_CREATE = `
INSERT INTO ${TABLE}
(
    academic_year_id,
    class_id,
    fee_head_id,
    amount,
    due_date,
    installment_no,
    status,
    created_at,
    updated_at
)
VALUES ?
`;

exports.GET_ALL = `
SELECT

fs.structure_id,
fs.academic_year_id,

CONCAT(ay.year_start,'-',ay.year_end) AS academic_year,

fs.class_id,
cm.class_name,

fs.fee_head_id,
fh.fee_name,

fs.amount,
fs.due_date,
fs.installment_no,
fs.status

FROM fee_structure fs

INNER JOIN academic_year ay
ON ay.academic_year_id = fs.academic_year_id

INNER JOIN class_master cm
ON cm.class_id = fs.class_id

INNER JOIN fee_heads fh
ON fh.fee_head_id = fs.fee_head_id

WHERE 1=1
`;
exports.GET_BY_ID = `
SELECT *
FROM fee_structure
WHERE structure_id=?
`;

exports.DELETE = `
DELETE FROM fee_structure
WHERE structure_id=?
`;

exports.UPDATE = `
UPDATE fee_structure
SET
amount=?,
due_date=?,
installment_no=?,
status=?,
updated_at=NOW()
WHERE structure_id=?
`;

exports.CHECK_DUPLICATE = `
SELECT structure_id
FROM fee_structure
WHERE
academic_year_id=?
AND class_id=?
AND fee_head_id=?
AND installment_no=?
LIMIT 1
`;