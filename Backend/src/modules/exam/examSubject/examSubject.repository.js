const db = require("../../../config/database");
const query = require("./examSubject.query");

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

exports.create = async (data) => {

    const [
        exam_id,
        class_id,
        subject_id,
        max_marks,
        pass_marks,
    ] = data;

    const [result] = await db.query(
        query.CREATE,
        [
            exam_id,
            class_id,
            subject_id,
            max_marks,
            pass_marks,
        ]
    );

    return result.insertId;
};

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.getAll = async () => {

    const [rows] = await db.query(
        query.GET_ALL
    );

    return rows;
};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

exports.getById = async (id) => {

    const [rows] = await db.query(
        query.GET_BY_ID,
        [id]
    );

    return rows[0];
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.update = async (id, data) => {

    const [
        exam_id,
        class_id,
        subject_id,
        max_marks,
        pass_marks,
    ] = data;

    await db.query(
    query.UPDATE,
    [
        exam_id,
        class_id,
        subject_id,
        max_marks,
        pass_marks,
        id,
    ]
);

    return true;
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

exports.delete = async (id) => {

    await db.query(
        query.DELETE,
        [id]
    );

    return true;
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.changeStatus = async (
    id,
    status
) => {

    await db.query(
        query.CHANGE_STATUS,
        [
            status,
            id,
        ]
    );

    return true;
};

/*
|--------------------------------------------------------------------------
| CHECK DUPLICATE
|--------------------------------------------------------------------------
*/

exports.checkDuplicate = async (
    exam_id,
    class_id,
    subject_id,
    exam_subject_id = 0
) => {

    const [rows] = await db.query(
        query.CHECK_DUPLICATE,
        [
            exam_id,
            class_id,
            subject_id,
            exam_subject_id,
        ]
    );

    return rows[0];
};