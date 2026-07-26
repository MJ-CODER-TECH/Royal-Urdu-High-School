const db = require("../../../config/database");
const query = require("./feeHead.query");

exports.createFeeHead = async ({
    fee_name,
    description,
    status,
}) => {

    const [result] = await db.execute(
        query.CREATE_FEE_HEAD,
        [
            fee_name,
            description,
            status,
        ]
    );

    return result.insertId;
};

exports.checkDuplicate = async (fee_name) => {

    const [rows] = await db.execute(
        query.CHECK_DUPLICATE,
        [fee_name]
    );

    return rows[0];
};

exports.getFeeHeadById = async (id) => {

    const [rows] = await db.execute(
        query.GET_FEE_HEAD_BY_ID,
        [id]
    );

    return rows[0];
};

exports.getAllFeeHeads = async ({
    page = 1,
    limit = 10,
    search = "",
    status = "",
}) => {


    page = Number(page);
    limit = Number(limit);

    if (!page || page < 1) page = 1;
    if (!limit || limit < 1) limit = 10;

    let sql = query.GET_ALL_FEE_HEADS;

    const values = [];

    if (search) {

        sql += ` AND fee_name LIKE ?`;

        values.push(`%${search}%`);
    }
if (status) {

    sql += ` AND status=?`;

    values.push(status);
}


const offset = (page - 1) * limit;


sql += `
    ORDER BY fee_head_id DESC
    LIMIT ${limit}
    OFFSET ${offset}
`;


const [rows] = await db.execute(
    sql,
    values
);

    let countSql = query.COUNT;

    const countValues = [];

    if (search) {

        countSql += ` AND fee_name LIKE ?`;

        countValues.push(`%${search}%`);
    }

    if (status) {

        countSql += ` AND status=?`;

        countValues.push(status);
    }

    const [[count]] = await db.execute(
        countSql,
        countValues
    );

    return {

        rows,

        total: count.total,

    };

};

exports.updateFeeHead = async (
    id,
    {
        fee_name,
        description,
        status,
    }
) => {

    await db.execute(
        query.UPDATE_FEE_HEAD,
        [
            fee_name,
            description,
            status,
            id,
        ]
    );

};

exports.deleteFeeHead = async (id) => {

    await db.execute(
        query.DELETE_FEE_HEAD,
        [id]
    );

};