const timetableService = require("./timetable.service");

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.getAll = async (req, res, next) => {
    try {

        console.log("QUERY =>", req.query);

        const data = await timetableService.getAll(req.query);

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
        const data = await timetableService.getById(req.params.id);

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
| CREATE
|--------------------------------------------------------------------------
*/

exports.create = async (req, res, next) => {
    try {
        const id = await timetableService.create(req.body);

        return res.status(201).json({
            success: true,
            message: "Timetable created successfully.",
            timetable_id: id,
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
        await timetableService.update(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Timetable updated successfully.",
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

exports.remove = async (req, res, next) => {
    try {
        await timetableService.remove(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Timetable deleted successfully.",
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

        await timetableService.changeStatus(
            req.params.id,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Status updated successfully.",
        });
    } catch (error) {
        next(error);
    }
};




/*
|--------------------------------------------------------------------------
| CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

exports.getClassTimetable = async (req, res, next) => {

    try {

        const data =
            await timetableService.getClassTimetable(req.query);


        return res.status(200).json({

            success:true,
            data,

        });


    } catch(error){

        next(error);

    }

};




/*
|--------------------------------------------------------------------------
| TEACHER TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

exports.getTeacherTimetable = async(req,res,next)=>{

    try{

        const data =
            await timetableService.getTeacherTimetable(
                req.query
            );


        return res.status(200).json({

            success:true,
            data,

        });


    }catch(error){

        next(error);

    }

};