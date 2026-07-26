const db = require("../../../config/database");
const query = require("./feeStructure.query");


exports.create = async (data) => {

    const [result] = await db.execute(
        query.CREATE,
        [
            data.academic_year_id,
            data.class_id,
            data.fee_head_id,
            data.amount,
            data.due_date,
            data.installment_no,
            data.status
        ]
    );

    return result.insertId;

};


exports.checkDuplicate = async (data) => {

    const [rows] = await db.execute(

        query.CHECK_DUPLICATE,

        [

            data.academic_year_id,

            data.class_id,

            data.fee_head_id,

            data.installment_no

        ]

    );

    return rows[0];

};


exports.getById = async (id) => {

    const [rows] = await db.execute(

        query.GET_BY_ID,

        [id]

    );

    return rows[0];

};



exports.getAll = async (filters) => {

    let sql = query.GET_ALL;

    const params = [];


    if(filters.academicYearId){

        sql += `
        AND fs.academic_year_id = ?
        `;

        params.push(filters.academicYearId);

    }


    if(filters.classId){

        sql += `
        AND fs.class_id = ?
        `;

        params.push(filters.classId);

    }


    if(filters.feeHeadId){

        sql += `
        AND fs.fee_head_id = ?
        `;

        params.push(filters.feeHeadId);

    }


    if(filters.status){

        sql += `
        AND fs.status = ?
        `;

        params.push(filters.status);

    }


    if(filters.search){

        sql += `
        AND (
            cm.class_name LIKE ?
            OR fh.fee_name LIKE ?
        )
        `;

        params.push(
            `%${filters.search}%`,
            `%${filters.search}%`
        );

    }


    const [rows] = await db.execute(
        sql,
        params
    );


    return rows;

};

exports.update = async (id, data) => {

    await db.execute(

        query.UPDATE,

        [

            data.amount,

            data.due_date,

            data.installment_no,

            data.status,

            id

        ]

    );

};



exports.delete = async (id) => {

    await db.execute(

        query.DELETE,

        [id]

    );

};