const subjectService =
    require("./subject.service");


// ===========================================
// Get All Subjects
// ===========================================

exports.getSubjects = async (
    req,
    res,
    next
) => {

    try {

        const data =
            await subjectService.getSubjects();


        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        next(error);

    }

};


// ===========================================
// Get Subject By ID
// ===========================================

exports.getSubjectById = async (
    req,
    res,
    next
) => {

    try {

        const data =
            await subjectService.getSubjectById(
                req.params.id
            );


        return res.status(200).json({

            success: true,

            data

        });

    } catch (error) {

        next(error);

    }

};


// ===========================================
// Create Subject
// ===========================================

exports.createSubject = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await subjectService.createSubject(
                req.body
            );


        return res.status(201).json({

            success: true,

            message:
                "Subject created successfully.",

            data: {

                subject_id:
                    result.insertId

            }

        });

    } catch (error) {

        next(error);

    }

};


// ===========================================
// Update Subject
// ===========================================

exports.updateSubject = async (
    req,
    res,
    next
) => {

    try {

        await subjectService.updateSubject(
            req.params.id,
            req.body
        );


        return res.status(200).json({

            success: true,

            message:
                "Subject updated successfully."

        });

    } catch (error) {

        next(error);

    }

};


// ===========================================
// Delete Subject
// ===========================================

exports.deleteSubject = async (
    req,
    res,
    next
) => {

    try {

        await subjectService.deleteSubject(
            req.params.id
        );


        return res.status(200).json({

            success: true,

            message:
                "Subject deleted successfully."

        });

    } catch (error) {

        next(error);

    }

};


// ===========================================
// Change Subject Status
// ===========================================

exports.changeSubjectStatus = async (
    req,
    res,
    next
) => {

    try {

        const {
            is_active
        } = req.body;


        if (
            is_active !== 0 &&
            is_active !== 1 &&
            is_active !== "0" &&
            is_active !== "1"
        ) {

            const error = new Error(
                "is_active must be 0 or 1."
            );

            error.status = 400;

            throw error;

        }


        await subjectService.changeSubjectStatus(

            req.params.id,

            is_active

        );


        return res.status(200).json({

            success: true,

            message:
                "Subject status updated successfully."

        });

    } catch (error) {

        next(error);

    }

};