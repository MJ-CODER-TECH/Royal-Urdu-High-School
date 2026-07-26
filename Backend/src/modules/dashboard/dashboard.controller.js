const dashboardService = require("./dashboard.service");

/*
|--------------------------------------------------------------------------
| GET DASHBOARD
|--------------------------------------------------------------------------
*/

exports.getDashboard = async (
    req,
    res,
    next
) => {

    try {

        const data =
            await dashboardService.getDashboard();

        return res.status(200).json({

            success: true,

            message: "Dashboard data fetched successfully.",

            data

        });

    } catch (error) {

        next(error);

    }

};