const repository = require("./result.repository");

/*
|--------------------------------------------------------------------------
| Calculate Grade
|--------------------------------------------------------------------------
*/

const calculateGrade = (percentage) => {

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
| CREATE RESULT
|--------------------------------------------------------------------------
*/

exports.createResult = async (data) => {

    const percentage =
        (data.obtained_marks / data.total_marks) * 100;

    const grade = calculateGrade(percentage);

    const status =
        percentage >= 35
            ? "PASS"
            : "FAIL";

    return repository.createResult([
        data.student_id,
        data.academic_year_id,
        data.class_id,
        data.section_id,
        data.exam_id,
        data.total_marks,
        data.obtained_marks,
        percentage.toFixed(2),
        grade,
        status
    ]);
};

/*
|--------------------------------------------------------------------------
| GET ALL RESULTS
|--------------------------------------------------------------------------
*/

exports.getAllResults = () => {

    return repository.getAllResults();

};

/*
|--------------------------------------------------------------------------
| GET RESULT BY ID
|--------------------------------------------------------------------------
*/

exports.getResultById = (id) => {

    return repository.getResultById(id);

};

/*
|--------------------------------------------------------------------------
| GET RESULTS BY FILTER
|--------------------------------------------------------------------------
*/

exports.getResultsByFilter = (filters) => {

    return repository.getResultsByFilter(

        filters.exam_id,
        filters.class_id,
        filters.section_id

    );

};

/*
|--------------------------------------------------------------------------
| DELETE RESULT
|--------------------------------------------------------------------------
*/

exports.deleteResult = (id) => {

    return repository.deleteResult(id);

};

/*
|--------------------------------------------------------------------------
| GENERATE RESULT
|--------------------------------------------------------------------------
*/

exports.generateResult = async (filters) => {

    const students =
        await repository.getMarksForResult(

            filters.academic_year_id,
            filters.class_id,
            filters.section_id,
            filters.exam_id

        );

    const results = [];

    for (const student of students) {

        const percentage =
            (student.obtained_marks / student.total_marks) * 100;

        const grade =
            calculateGrade(percentage);

        const status =
            percentage >= 35
                ? "PASS"
                : "FAIL";

        // Check existing result
        const existing =
            await repository.checkExistingResult(

                student.student_id,
                student.exam_id

            );

        if (existing) {

            // Update existing result

            await repository.updateResult(

                student.student_id,
                student.exam_id,
                student.total_marks,
                student.obtained_marks,
                percentage.toFixed(2),
                grade,
                status

            );

        } else {

            // Create new result

            await repository.createResult([

                student.student_id,
                student.academic_year_id,
                student.class_id,
                student.section_id,
                student.exam_id,
                student.total_marks,
                student.obtained_marks,
                percentage.toFixed(2),
                grade,
                status

            ]);

        }

        results.push({

            ...student,

            percentage: percentage.toFixed(2),

            grade,

            result_status: status

        });

    }

    return results;

};