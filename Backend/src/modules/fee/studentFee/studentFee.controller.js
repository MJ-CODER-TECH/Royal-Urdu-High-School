const service = require("./studentFee.service");

exports.assignClass = async (req, res, next) => {

    console.log("BODY =>", req.body);

    try {

        const result = await service.assignClass(req.body);

        return res.status(201).json({
            success: true,
            data: result
        });

    } catch (error) {

        console.error(error);

        console.error(error.stack);

        next(error);

    }

};
exports.getStudentFees = async (req, res, next) => {

    try {

        const result =
            await service.getStudentFees(
                req.query
            );

        return res.json({

            success: true,

            data: result.rows,

            pagination: {

                page: result.page,

                limit: result.limit,

                total: result.total,

                totalPages: Math.ceil(
                    result.total /
                    result.limit
                )

            },

            summary: result.summary

        });

    }

    catch (error) {

        next(error);

    }

};

exports.getStudentFeeById = async (req, res, next) => {

    try {

        const result = await service.getStudentFeeById(req.params.id);

        return res.status(200).json({

            success: true,

            data: result,

        });

    } catch (error) {

        next(error);

    }

};

exports.deleteStudentFee = async (req, res, next) => {

    try {

        await service.deleteStudentFee(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Student Fee deleted successfully."

        });

    } catch (error) {

        next(error);

    }

};



exports.generateStudentFee = async (req, res, next) => {

    console.log("========== GENERATE FEE BODY ==========");
    console.log(req.body);
    console.log("========================================");

    try {

        const result =
            await service.generateStudentFee(
                req.body,
                req.user.userId
            );


        return res.status(201).json({

            success: true,
            data: result

        });


    } catch(error) {

        console.error(error);
        next(error);

    }

};