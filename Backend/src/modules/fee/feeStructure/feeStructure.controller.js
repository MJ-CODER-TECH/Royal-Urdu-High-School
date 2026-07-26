const service = require("./feeStructure.service");

exports.create = async (req, res, next) => {

    try {

        const data = await service.create(req.body);

        return res.status(201).json({

            success: true,

            message: "Fee Structure created successfully.",

            data,

        });

    } catch (error) {

        next(error);

    }

};

exports.bulkCreate = async (req, res, next) => {

    try {

        await service.bulkCreate(req.body);

        return res.status(201).json({

            success: true,

            message: "Fee Structure saved successfully."

        });

    } catch (error) {

        next(error);

    }

};

exports.getAll = async(req,res)=>{


const filters = {

    academicYearId:req.query.academicYearId,

    classId:req.query.classId,

    feeHeadId:req.query.feeHeadId,

    status:req.query.status,

    search:req.query.search

};


const data = await service.getAll(filters);



res.json({

 success:true,

 data

});


}

exports.getById = async (req, res, next) => {

    try {

        const data = await service.getById(req.params.id);

        return res.status(200).json({

            success: true,

            data,

        });

    } catch (error) {

        next(error);

    }

};

exports.update = async (req, res, next) => {

    try {

        const data = await service.update(

            req.params.id,

            req.body

        );

        return res.status(200).json({

            success: true,

            message: "Updated successfully.",

            data,

        });

    } catch (error) {

        next(error);

    }

};

exports.delete = async (req, res, next) => {

    try {

        await service.delete(req.params.id);

        return res.status(200).json({

            success: true,

            message: "Deleted successfully.",

        });

    } catch (error) {

        next(error);

    }

};