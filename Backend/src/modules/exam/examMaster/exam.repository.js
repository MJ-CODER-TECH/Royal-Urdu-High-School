const db = require("../../../config/database");

const query = require("./exam.query");


exports.getExams = async () => {

    const [rows] = await db.execute(
        query.GET_ALL_EXAMS
    );

    return rows;

};


exports.getExamById = async (id) => {

    const [rows] = await db.execute(
        query.GET_EXAM_BY_ID,
        [id]
    );

    return rows[0];

};


exports.createExam = async (data) => {

    const {
        class_id,
        academic_year_id,
        exam_name,
        exam_date,
        max_marks
    } = data;


    const [result] = await db.execute(
        query.CREATE_EXAM,
        [
            class_id,
            academic_year_id,
            exam_name,
            exam_date,
            max_marks
        ]
    );


    return {
        exam_id: result.insertId
    };

};


exports.updateExam = async (id,data)=>{

    const {
        class_id,
        academic_year_id,
        exam_name,
        exam_date,
        max_marks
    } = data;


    await db.execute(
        query.UPDATE_EXAM,
        [
            class_id,
            academic_year_id,
            exam_name,
            exam_date,
            max_marks,
            id
        ]
    );


    return true;

};


exports.deleteExam = async(id)=>{

    await db.execute(
        query.DELETE_EXAM,
        [id]
    );


    return true;

};


exports.changeExamStatus = async (
    id,
    status
) => {

    await db.execute(
        query.CHANGE_EXAM_STATUS,
        [
            status,
            id
        ]
    );

    return true;

};