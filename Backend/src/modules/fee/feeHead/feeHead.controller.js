const service = require("./feeHead.service");

exports.createFeeHead = async (req, res, next) => {

    try {

        const data = await service.createFeeHead(req.body);

        return res.status(201).json({

            success: true,

            message: "Fee Head created successfully.",

            data,

        });

    } catch (error) {

        next(error);

    }

};

exports.getAllFeeHeads = async (req, res, next) => {

    try {

        const result = await service.getAllFeeHeads(req.query);

        return res.status(200).json({

            success: true,

            message: "Fee Heads fetched successfully.",

            data: result.rows,

            pagination: {

                page: Number(req.query.page) || 1,

                limit: Number(req.query.limit) || 10,

                total: result.total,

                totalPages: Math.ceil(
                    result.total /
                    (Number(req.query.limit) || 10)
                ),

            },

        });

    } catch (error) {

        next(error);

    }

};

exports.getFeeHeadById = async (req, res, next) => {

    try {

        const data = await service.getFeeHeadById(req.params.id);

        return res.status(200).json({

            success: true,

            data,

        });

    } catch (error) {

        next(error);

    }

};

exports.updateFeeHead = async (req, res, next) => {

    try {

        const data = await service.updateFeeHead(
            req.params.id,
            req.body
        );

        return res.status(200).json({

            success: true,

            message: "Fee Head updated successfully.",

            data,

        });

    } catch (error) {

        next(error);

    }

};

exports.deleteFeeHead = async (req, res, next) => {

    try {

        await service.deleteFeeHead(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Fee Head deleted successfully.",

        });

    } catch (error) {

        next(error);

    }

};