const subjectRepository = require("./subject.repository");


// ===========================================
// Get All Subjects
// ===========================================

exports.getSubjects = async () => {

    return await subjectRepository.getSubjects();

};


// ===========================================
// Get Subject By ID
// ===========================================

exports.getSubjectById = async (id) => {

    const subject =
        await subjectRepository.getSubjectById(id);

    if (!subject) {

        const error = new Error(
            "Subject not found."
        );

        error.status = 404;

        throw error;

    }

    return subject;

};


// ===========================================
// Create Subject
// ===========================================

exports.createSubject = async (data) => {

    const {
        subject_name,
        class_id,
        short_code,
        theory_marks,
        practical_marks,
        is_active
    } = data;


    if (
        !subject_name ||
        !class_id
    ) {

        const error = new Error(
            "Subject name and class are required."
        );

        error.status = 400;

        throw error;

    }


    const duplicate =
        await subjectRepository.findDuplicateSubject(
            subject_name.trim(),
            class_id
        );


    if (duplicate) {

        const error = new Error(
            "This subject already exists for the selected class."
        );

        error.status = 409;

        throw error;

    }


    const theoryMarks =
        Number(theory_marks || 0);

    const practicalMarks =
        Number(practical_marks || 0);


    if (
        theoryMarks < 0 ||
        practicalMarks < 0
    ) {

        const error = new Error(
            "Marks cannot be negative."
        );

        error.status = 400;

        throw error;

    }


    return await subjectRepository.createSubject({

        subject_name:
            subject_name.trim(),

        class_id:
            Number(class_id),

        short_code:
            short_code
                ? short_code.trim().toUpperCase()
                : null,

        theory_marks:
            theoryMarks,

        practical_marks:
            practicalMarks,

        is_active:
            is_active ?? 1

    });

};


// ===========================================
// Update Subject
// ===========================================

exports.updateSubject = async (
    id,
    data
) => {

    const existingSubject =
        await subjectRepository.getSubjectById(id);


    if (!existingSubject) {

        const error = new Error(
            "Subject not found."
        );

        error.status = 404;

        throw error;

    }


    const {
        subject_name,
        class_id,
        short_code,
        theory_marks,
        practical_marks,
        is_active
    } = data;


    if (
        !subject_name ||
        !class_id
    ) {

        const error = new Error(
            "Subject name and class are required."
        );

        error.status = 400;

        throw error;

    }


    const duplicate =
        await subjectRepository.findDuplicateSubject(
            subject_name.trim(),
            class_id,
            id
        );


    if (duplicate) {

        const error = new Error(
            "This subject already exists for the selected class."
        );

        error.status = 409;

        throw error;

    }


    const theoryMarks =
        Number(theory_marks || 0);

    const practicalMarks =
        Number(practical_marks || 0);


    if (
        theoryMarks < 0 ||
        practicalMarks < 0
    ) {

        const error = new Error(
            "Marks cannot be negative."
        );

        error.status = 400;

        throw error;

    }


    return await subjectRepository.updateSubject(
        id,
        {

            subject_name:
                subject_name.trim(),

            class_id:
                Number(class_id),

            short_code:
                short_code
                    ? short_code.trim().toUpperCase()
                    : null,

            theory_marks:
                theoryMarks,

            practical_marks:
                practicalMarks,

            is_active:
                is_active ?? 1

        }
    );

};


// ===========================================
// Delete Subject
// ===========================================

exports.deleteSubject = async (id) => {

    const subject =
        await subjectRepository.getSubjectById(id);


    if (!subject) {

        const error = new Error(
            "Subject not found."
        );

        error.status = 404;

        throw error;

    }


    const result =
        await subjectRepository.deleteSubject(id);


    if (result.affectedRows === 0) {

        const error = new Error(
            "Subject could not be deleted."
        );

        error.status = 400;

        throw error;

    }


    return result;

};


// ===========================================
// Change Subject Status
// ===========================================

exports.changeSubjectStatus = async (
    id,
    isActive
) => {

    const subject =
        await subjectRepository.getSubjectById(id);


    if (!subject) {

        const error = new Error(
            "Subject not found."
        );

        error.status = 404;

        throw error;

    }


    return await subjectRepository.changeSubjectStatus(
        id,
        Number(isActive)
    );

};