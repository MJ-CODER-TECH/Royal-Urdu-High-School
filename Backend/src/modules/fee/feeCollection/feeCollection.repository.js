const db = require("../../../config/database");

const query = require("./feeCollection.query");



// ======================================
// CREATE COLLECTION
// ======================================

exports.createCollection = async (
    connection,
    data
) => {

    const values = [

        data.receipt_no,
        data.student_id,
        data.payment_date,
        data.payment_mode,
        data.total_amount,
        data.reference_no,
        data.remarks,
        data.collected_by

    ];

    console.log("CREATE COLLECTION VALUES =>", values);

    const [result] = await connection.execute(

        query.CREATE_COLLECTION,

        values

    );

    return result.insertId;

};



// ======================================
// UPDATE RECEIPT NUMBER
// ======================================

exports.updateReceiptNumber = async (

    connection,

    collection_id,

    receipt_no

) => {

    await connection.execute(

        query.UPDATE_RECEIPT_NO,

        [

            receipt_no,

            collection_id

        ]

    );

};



// ======================================
// CREATE COLLECTION ITEM
// ======================================

exports.createCollectionItem = async (

    connection,
    data

) => {

    const values = [

        data.collection_id,
        data.student_fee_id,
        data.fee_head_id,
        data.amount_paid

    ];

    console.log("CREATE ITEM VALUES =>", values);

    await connection.execute(

        query.CREATE_COLLECTION_ITEM,

        values

    );

};



// ======================================
// UPDATE STUDENT FEE
// ======================================

exports.updateStudentFee = async (

    connection,
    student_fee_id,
    amount

) => {

    const values = [

        amount,
        amount,
        amount,
        student_fee_id

    ];

    console.log("UPDATE STUDENT FEE VALUES =>", values);

    await connection.execute(

        query.UPDATE_STUDENT_FEE,

        values

    );

};



// ======================================
// GET STUDENT FEE
// ======================================

exports.getStudentFee = async (

    student_fee_id

) => {

    const [rows] = await db.execute(

        query.GET_STUDENT_FEE,

        [

            student_fee_id

        ]

    );

    return rows[0];

};



// ======================================
// GET RECEIPT
// ======================================

exports.getReceipt = async (

    collection_id

) => {

    const [rows] = await db.execute(

        query.GET_RECEIPT,

        [

            collection_id

        ]

    );

    return rows[0];

};



// ======================================
// GET ALL
// ======================================

exports.getAll = async (filters) => {

    const page = Number(filters.page || 1);
    const limit = Number(filters.limit || 10);
    const offset = (page - 1) * limit;

    const search = filters.search?.trim() || null;
    const keyword = search ? `%${search}%` : null;

    const academic_year_id = filters.academic_year_id
        ? Number(filters.academic_year_id)
        : null;

    const class_id = filters.class_id
        ? Number(filters.class_id)
        : null;

    const section_id = filters.section_id
        ? Number(filters.section_id)
        : null;

    const payment_mode = filters.payment_mode || null;

    const values = [

        search,
        keyword,
        keyword,
        keyword,

        academic_year_id,
        academic_year_id,

        class_id,
        class_id,

        section_id,
        section_id,

        payment_mode,
        payment_mode

    ];

    console.log("GET ALL VALUES =>", values);

    const [rows] = await db.execute(
        query.GET_ALL(limit, offset),
        values
    );

    return rows;

};



// ======================================
// COUNT
// ======================================

exports.countAll = async (filters) => {

    const search = filters.search?.trim() || null;
    const keyword = search ? `%${search}%` : null;

    const academic_year_id = filters.academic_year_id
        ? Number(filters.academic_year_id)
        : null;

    const class_id = filters.class_id
        ? Number(filters.class_id)
        : null;

    const section_id = filters.section_id
        ? Number(filters.section_id)
        : null;

    const payment_mode = filters.payment_mode || null;

    const [rows] = await db.execute(
        query.COUNT_ALL,
        [

            search,
            keyword,
            keyword,
            keyword,

            academic_year_id,
            academic_year_id,

            class_id,
            class_id,

            section_id,
            section_id,

            payment_mode,
            payment_mode

        ]
    );

    return rows[0].total;

};


// ======================================
// SUMMARY
// ======================================

exports.getSummary = async () => {

    const [rows] = await db.execute(

        query.GET_SUMMARY

    );

    return rows[0];

};



// ======================================
// DELETE ITEMS
// ======================================

exports.deleteCollectionItems = async (

    connection,

    collection_id

) => {

    await connection.execute(

        query.DELETE_COLLECTION_ITEMS,

        [

            collection_id

        ]

    );

};



// ======================================
// DELETE RECEIPT
// ======================================

exports.deleteReceipt = async (

    connection,

    collection_id

) => {

    await connection.execute(

        query.DELETE_RECEIPT,

        [

            collection_id

        ]

    );

};



exports.getPendingStudentFees = async (filters) => {

    const {
        search = "",
        academic_year_id,
        class_id,
        section_id
    } = filters;

    let sql = `
        SELECT
            sf.student_fee_id,
            sf.student_id,
            sf.total_fee,
            sf.paid_amount,
            sf.balance_amount,
            sf.fee_head_id,

            s.admission_no,
            s.mobile,

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
            sec.section_name

        FROM student_fees sf

        INNER JOIN student s
            ON s.student_id = sf.student_id

        LEFT JOIN class_master cm
            ON cm.class_id = sf.class_id

        LEFT JOIN section_master sec
            ON sec.section_id = s.section_id

        WHERE sf.balance_amount > 0
    `;

    const params = [];

    if (academic_year_id) {
        sql += ` AND sf.academic_year_id = ? `;
        params.push(academic_year_id);
    }

    if (class_id) {
        sql += ` AND sf.class_id = ? `;
        params.push(class_id);
    }

    if (section_id) {
        sql += ` AND s.section_id = ? `;
        params.push(section_id);
    }

    if (search) {

        sql += `
            AND (
                s.first_name LIKE ?
                OR s.last_name LIKE ?
                OR s.mobile LIKE ?
                OR s.admission_no LIKE ?
            )
        `;

        params.push(
            `%${search}%`,
            `%${search}%`,
            `%${search}%`,
            `%${search}%`
        );
    }


    const [rows] = await db.query(sql, params);

    return rows;
};