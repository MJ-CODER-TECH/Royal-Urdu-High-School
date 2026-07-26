const db = require("../../../config/database");
const query = require("./mark.query");


/*
|--------------------------------------------------------------------------
| CREATE MARK
|--------------------------------------------------------------------------
*/

exports.createMark = async (data) => {

    const [
        student_id,
        academic_year_id,
        class_id,
        section_id,
        exam_id,
        subject_id,
        max_marks,
        obtained_marks,
        grade,
        remark,
        status

    ] = data;


    const [result] = await db.query(
        query.CREATE,
        [
            student_id,
            academic_year_id,
            class_id,
            section_id,
            exam_id,
            subject_id,
            max_marks,
            obtained_marks,
            grade,
            remark,
            status
        ]
    );


    return result;

};



/*
|--------------------------------------------------------------------------
| BULK CREATE MARKS
|--------------------------------------------------------------------------
*/

exports.bulkCreateMarks = async (values) => {

    const [result] = await db.query(
        query.BULK_CREATE,
        [values]
    );

    return result;

};




/*
|--------------------------------------------------------------------------
| GET ALL MARKS
|--------------------------------------------------------------------------
*/

exports.getAllMarks = async () => {

    const [rows] = await db.query(
        query.GET_ALL
    );

    return rows;

};




/*
|--------------------------------------------------------------------------
| GET MARK BY ID
|--------------------------------------------------------------------------
*/

exports.getMarkById = async (markId) => {

    const [rows] = await db.query(
        query.GET_BY_ID,
        [markId]
    );

    return rows[0];

};




/*
|--------------------------------------------------------------------------
| GET MARKS BY FILTER
|--------------------------------------------------------------------------
*/

exports.getMarksByFilter = async (
    academic_year_id,
    class_id,
    section_id,
    exam_id,
    subject_id
) => {


    const [rows] = await db.query(
        query.GET_BY_FILTER,
        [
            academic_year_id,
            class_id,
            section_id,
            exam_id,
            subject_id
        ]
    );


    return rows;

};




/*
|--------------------------------------------------------------------------
| UPDATE MARK
|--------------------------------------------------------------------------
*/

exports.updateMark = async (
    max_marks,
    obtained_marks,
    grade,
    remark,
    status,
    markId
) => {


    const [result] = await db.query(
        query.UPDATE,
        [
            max_marks,
            obtained_marks,
            grade,
            remark,
            status,
            markId
        ]
    );


    return result;

};




/*
|--------------------------------------------------------------------------
| DELETE MARK
|--------------------------------------------------------------------------
*/

exports.deleteMark = async (markId) => {

    const [result] = await db.query(
        query.DELETE,
        [markId]
    );


    return result;

};




/*
|--------------------------------------------------------------------------
| CHECK EXISTING MARK
|--------------------------------------------------------------------------
*/

exports.checkExistingMark = async (
    student_id,
    exam_id,
    subject_id
) => {


    const [rows] = await db.query(
        query.CHECK_EXIST,
        [
            student_id,
            exam_id,
            subject_id
        ]
    );


    return rows.length ? rows[0] : null;

};




/*
|--------------------------------------------------------------------------
| GET STUDENTS FOR MARK ENTRY
|--------------------------------------------------------------------------
*/

exports.getStudentsForMarks = async (
    exam_id,
    subject_id,
    academic_year_id,
    class_id,
    section_id
) => {

    const [rows] = await db.query(
        query.GET_STUDENTS_FOR_MARKS,
        [
            exam_id,
            subject_id,
            academic_year_id,
            class_id,
            section_id
        ]
    );

    return rows;
};