const repository = require("./mark.repository");

/*
|--------------------------------------------------------------------------
| Calculate Grade
|--------------------------------------------------------------------------
*/

const calculateGrade = (
    obtained,
    maxMarks
) => {

    const obtainedMarks =
        Number(obtained) || 0;

    const maximumMarks =
        Number(maxMarks) || 0;

    if (
        !maximumMarks ||
        maximumMarks <= 0
    ) {
        return "";
    }

    const percentage =
        (obtainedMarks / maximumMarks) * 100;

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

exports.createMark = async (
    data
) => {

    const grade =
        calculateGrade(
            data.obtained_marks,
            data.max_marks
        );

    return await repository.createMark([

        Number(
            data.student_id
        ),

        Number(
            data.academic_year_id
        ),

        Number(
            data.class_id
        ),

        Number(
            data.section_id
        ),

        Number(
            data.exam_id
        ),

        Number(
            data.subject_id
        ),

        Number(
            data.max_marks
        ),

        Number(
            data.obtained_marks
        ),

        grade,

        data.remark || "",

        data.status || "Active",

    ]);

};


/*
|--------------------------------------------------------------------------
| BULK CREATE MARKS
|--------------------------------------------------------------------------
*/

exports.bulkCreateMarks = async (
    marks
) => {

    const values = [];

    for (
        const mark of marks
    ) {

        const maxMarks =
            Number(
                mark.max_marks
            ) || 100;

        const obtainedMarks =
            mark.obtained_marks === ""
                ? 0
                : Number(
                    mark.obtained_marks
                ) || 0;

        const grade =
            calculateGrade(
                obtainedMarks,
                maxMarks
            );

        values.push([

            Number(
                mark.student_id
            ),

            Number(
                mark.academic_year_id
            ),

            Number(
                mark.class_id
            ),

            Number(
                mark.section_id
            ),

            Number(
                mark.exam_id
            ),

            Number(
                mark.subject_id
            ),

            maxMarks,

            obtainedMarks,

            grade,

            mark.remark || "",

            mark.status || "Active",

            new Date(),

            new Date(),

        ]);

    }

    return await repository.bulkCreateMarks(
        values
    );

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

exports.getMarkById = async (
    markId
) => {

    return await repository.getMarkById(
        markId
    );

};


/*
|--------------------------------------------------------------------------
| GET MARKS BY FILTER
|--------------------------------------------------------------------------
*/

exports.getMarksByFilter = async (
    filters
) => {

    return await repository.getMarksByFilter(

        Number(
            filters.academic_year_id
        ),

        Number(
            filters.class_id
        ),

        Number(
            filters.section_id
        ),

        Number(
            filters.exam_id
        ),

        Number(
            filters.subject_id
        )

    );

};


/*
|--------------------------------------------------------------------------
| UPDATE MARK
|--------------------------------------------------------------------------
*/

exports.updateMark = async (
    markId,
    data
) => {

    const maxMarks =
        Number(
            data.max_marks
        ) || 100;

    const obtainedMarks =
        data.obtained_marks === ""
            ? 0
            : Number(
                data.obtained_marks
            ) || 0;

    const grade =
        calculateGrade(
            obtainedMarks,
            maxMarks
        );

    return await repository.updateMark(

        maxMarks,

        obtainedMarks,

        grade,

        data.remark || "",

        data.status || "Active",

        Number(
            markId
        )

    );

};


/*
|--------------------------------------------------------------------------
| DELETE MARK
|--------------------------------------------------------------------------
*/

exports.deleteMark = async (
    markId
) => {

    return await repository.deleteMark(
        Number(markId)
    );

};


/*
|--------------------------------------------------------------------------
| CHECK EXISTING MARK
|--------------------------------------------------------------------------
|
| Full academic context check:
|
| Student
| Academic Year
| Class
| Section
| Exam
| Subject
|
*/

exports.checkExistingMark = async (
    data
) => {

    return await repository.checkExistingMark(

        Number(
            data.student_id
        ),

        Number(
            data.academic_year_id
        ),

        Number(
            data.class_id
        ),

        Number(
            data.section_id
        ),

        Number(
            data.exam_id
        ),

        Number(
            data.subject_id
        )

    );

};


/*
|--------------------------------------------------------------------------
| GET STUDENTS FOR MARK ENTRY
|--------------------------------------------------------------------------
*/

exports.getStudentsForMarks = async (
    filters
) => {

    return await repository.getStudentsForMarks(

        Number(
            filters.exam_id
        ),

        Number(
            filters.subject_id
        ),

        Number(
            filters.academic_year_id
        ),

        Number(
            filters.class_id
        ),

        Number(
            filters.section_id
        )

    );

};