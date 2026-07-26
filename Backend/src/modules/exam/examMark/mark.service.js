const repository = require("./mark.repository");


/*
|--------------------------------------------------------------------------
| Calculate Grade
|--------------------------------------------------------------------------
*/

const calculateGrade = (obtained, maxMarks) => {

    if (!maxMarks || maxMarks <= 0) return "";

    const percentage = (obtained / maxMarks) * 100;


    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B+";
    if (percentage >= 60) return "B";
    if (percentage >= 50) return "C";
    if (percentage >= 35) return "D";

    return "F";
};


/*
|--------------------------------------------------------------------------
| CREATE MARK
|--------------------------------------------------------------------------
*/

exports.createMark = async (data) => {


    data.grade = calculateGrade(
        data.obtained_marks,
        data.max_marks
    );


    return await repository.createMark([

        data.student_id,
        data.academic_year_id,
        data.class_id,
        data.section_id,
        data.exam_id,
        data.subject_id,

        data.max_marks,
        data.obtained_marks,

        data.grade,

        data.remark || "",

        data.status || "Active"

    ]);

};



/*
|--------------------------------------------------------------------------
| BULK CREATE MARKS
|--------------------------------------------------------------------------
*/

exports.bulkCreateMarks = async (marks) => {


    const values = [];


    for (const mark of marks) {


        const grade = calculateGrade(
            mark.obtained_marks,
            mark.max_marks
        );


        values.push([

            mark.student_id,

            mark.academic_year_id,

            mark.class_id,

            mark.section_id,

            mark.exam_id,

            mark.subject_id,


            mark.max_marks,

            mark.obtained_marks,


            grade,


            mark.remark || "",


            mark.status || "Active",


            new Date(),

            new Date()

        ]);

    }


    return await repository.bulkCreateMarks(values);

};




/*
|--------------------------------------------------------------------------
| GET ALL MARKS
|--------------------------------------------------------------------------
*/

exports.getAllMarks = async () => {

    return await repository.getAllMarks();

};




/*
|--------------------------------------------------------------------------
| GET MARK BY ID
|--------------------------------------------------------------------------
*/

exports.getMarkById = async (markId) => {

    return await repository.getMarkById(markId);

};




/*
|--------------------------------------------------------------------------
| GET MARKS BY FILTER
|--------------------------------------------------------------------------
*/

exports.getMarksByFilter = async (filters) => {


    return await repository.getMarksByFilter(

        filters.academic_year_id,

        filters.class_id,

        filters.section_id,

        filters.exam_id,

        filters.subject_id

    );

};




/*
|--------------------------------------------------------------------------
| UPDATE MARK
|--------------------------------------------------------------------------
*/

exports.updateMark = async (markId, data) => {


    const grade = calculateGrade(

        data.obtained_marks,

        data.max_marks

    );


    return await repository.updateMark(

        data.max_marks,

        data.obtained_marks,

        grade,

        data.remark || "",

        data.status || "Active",

        markId

    );

};




/*
|--------------------------------------------------------------------------
| DELETE MARK
|--------------------------------------------------------------------------
*/

exports.deleteMark = async (markId) => {

    return await repository.deleteMark(markId);

};




/*
|--------------------------------------------------------------------------
| GET STUDENTS FOR MARK ENTRY
|--------------------------------------------------------------------------
*/

exports.getStudentsForMarks = async (filters) => {

    return repository.getStudentsForMarks(
        filters.exam_id,
        filters.subject_id,
        filters.academic_year_id,
        filters.class_id,
        filters.section_id
    );

};