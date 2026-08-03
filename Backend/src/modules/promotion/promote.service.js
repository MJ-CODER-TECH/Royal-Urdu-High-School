const db = require("../../config/database");
const repository = require("./promote.repository");

// ===========================================
// Get Students For Promotion
// ===========================================
exports.getStudents = async (filters) => {

    const {
        academic_year_id,
        class_id,
        section_id
    } = filters;

    if (!academic_year_id || !class_id || !section_id) {
        const err = new Error(
            "academic_year_id, class_id and section_id are required."
        );
        err.status = 400;
        throw err;
    }

    return await repository.getStudentsForPromotion(filters);
};

// ===========================================
// Promote Students
//
// Design note: a batch promotion should not fail
// entirely just because one student in the batch
// was already promoted for the target year. Each
// student is evaluated independently; the ones
// already promoted are skipped and reported back,
// the rest go through in the same transaction.
// ===========================================
exports.promoteStudents = async (data, promotedBy) => {

    const {
        fromAcademicYearId,
        toAcademicYearId,
        fromClassId,
        toClassId,
        toSectionId,
        students
    } = data;

    // -----------------------------------------
    // Validation (fail fast, before opening a
    // connection, on clearly bad input)
    // -----------------------------------------

    if (!Array.isArray(students) || students.length === 0) {
        const err = new Error("No students selected for promotion.");
        err.status = 400;
        throw err;
    }

    if (!toAcademicYearId || !toClassId || !toSectionId) {
        const err = new Error(
            "Next Academic Year, Class and Section are required."
        );
        err.status = 400;
        throw err;
    }

    const invalidStudent = students.find((s) => !s || !s.student_id);

    if (invalidStudent) {
        const err = new Error("One or more students are missing a student_id.");
        err.status = 400;
        throw err;
    }

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const promoted = [];
        const skipped = [];

        for (const student of students) {

            const alreadyPromoted = await repository.checkAlreadyPromoted(
                student.student_id,
                toAcademicYearId,
                connection
            );

            if (alreadyPromoted) {

                skipped.push({
                    student_id: student.student_id,
                    reason: "Already promoted for this academic year."
                });

                continue;

            }

            await repository.updateStudent(
                {
                    student_id: student.student_id,
                    academic_year_id: toAcademicYearId,
                    class_id: toClassId,
                    section_id: toSectionId,
                    roll_no: student.roll_no
                },
                connection
            );

            await repository.insertHistory(
                {
                    student_id: student.student_id,
                    academic_year_id: toAcademicYearId,
                    class_id: toClassId,
                    section_id: toSectionId,
                    roll_no: student.roll_no,
                    status: student.status || "PROMOTED"
                },
                connection
            );

            promoted.push(student.student_id);

        }

        if (promoted.length > 0) {

            await repository.createPromotionLog(
                {
                    fromAcademicYearId,
                    toAcademicYearId,
                    fromClassId,
                    toClassId,
                    promotedBy,
                    totalStudents: promoted.length
                },
                connection
            );

        }

        await connection.commit();

        const messageParts = [];

        if (promoted.length > 0) {
            messageParts.push(`${promoted.length} student(s) promoted successfully.`);
        }

        if (skipped.length > 0) {
            messageParts.push(`${skipped.length} student(s) skipped (already promoted).`);
        }

        return {
            success: promoted.length > 0,
            message: messageParts.join(" ") || "No students were promoted.",
            data: {
                promoted,
                skipped
            }
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

// ===========================================
// Promotion History
// ===========================================
exports.getHistory = async (filters) => {

    const { academic_year_id, class_id } = filters;

    if (!academic_year_id || !class_id) {
        const err = new Error("academic_year_id and class_id are required.");
        err.status = 400;
        throw err;
    }

    return await repository.getPromotionHistory(filters);
};