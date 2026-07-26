const markService = require("./mark.service");

exports.createMark = async (req, res, next) => {
    try {
        const result = await markService.createMark(req.body);

        return res.status(201).json({
            success: true,
            message: "Mark created successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.bulkCreateMarks = async (req, res, next) => {
    try {
        const result = await markService.bulkCreateMarks(req.body.marks);

        return res.status(201).json({
            success: true,
            message: "Marks saved successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllMarks = async (req, res, next) => {
    try {
        const result = await markService.getAllMarks();

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.getMarkById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await markService.getMarkById(id);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.getMarksByFilter = async (req, res, next) => {
    try {
        const result = await markService.getMarksByFilter(req.query);

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.updateMark = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await markService.updateMark(id, req.body);

        return res.status(200).json({
            success: true,
            message: "Mark updated successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteMark = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await markService.deleteMark(id);

        return res.status(200).json({
            success: true,
            message: "Mark deleted successfully.",
            data: result
        });
    } catch (error) {
        next(error);
    }
};


exports.getStudentsForMarks = async (
    req,
    res,
    next
) => {

    try {

        const data =
            await markService.getStudentsForMarks(
                req.query
            );

        return res.status(200).json({

            success: true,

            data,

        });

    } catch (error) {

        next(error);

    }

};