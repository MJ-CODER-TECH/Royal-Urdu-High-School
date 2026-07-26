const TABLE = "fee_heads";

exports.CREATE_FEE_HEAD = `
INSERT INTO ${TABLE}
(
    fee_name,
    description,
    status,
    created_at,
    updated_at
)
VALUES
(
    ?,
    ?,
    ?,
    NOW(),
    NOW()
)
`;

exports.GET_ALL_FEE_HEADS = `
SELECT
    fee_head_id,
    fee_name,
    description,
    status,
    created_at,
    updated_at
FROM ${TABLE}
WHERE 1=1
`;

exports.GET_FEE_HEAD_BY_ID = `
SELECT
    fee_head_id,
    fee_name,
    description,
    status,
    created_at,
    updated_at
FROM ${TABLE}
WHERE fee_head_id = ?
LIMIT 1
`;

exports.CHECK_DUPLICATE = `
SELECT
    fee_head_id
FROM ${TABLE}
WHERE LOWER(fee_name)=LOWER(?)
LIMIT 1
`;

exports.UPDATE_FEE_HEAD = `
UPDATE ${TABLE}
SET
    fee_name=?,
    description=?,
    status=?,
    updated_at=NOW()
WHERE fee_head_id=?
`;

exports.DELETE_FEE_HEAD = `
DELETE FROM ${TABLE}
WHERE fee_head_id=?
`;

exports.COUNT = `
SELECT COUNT(*) AS total
FROM ${TABLE}
WHERE 1=1
`;