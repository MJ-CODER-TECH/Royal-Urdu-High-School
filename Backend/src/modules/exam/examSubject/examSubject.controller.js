const examSubjectService = require("./examSubject.service");

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

exports.create = async (req, res, next) => {
    try {

        const id = await examSubjectService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Exam Subject created successfully.",
            data: {
                exam_subject_id: id,
            },
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.getAll = async (req, res, next) => {
    try {

        const data = await examSubjectService.getAll();

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

exports.getById = async (req, res, next) => {
    try {

        const data = await examSubjectService.getById(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.update = async (req, res, next) => {
    try {

        await examSubjectService.update(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Exam Subject updated successfully.",
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

exports.delete = async (req, res, next) => {
    try {

        await examSubjectService.delete(
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message: "Exam Subject deleted successfully.",
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.changeStatus = async (req, res, next) => {
    try {

        const { status } = req.body;

        await examSubjectService.changeStatus(
            req.params.id,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Exam Subject status updated successfully.",
        });

    } catch (error) {
        next(error);
    }
};