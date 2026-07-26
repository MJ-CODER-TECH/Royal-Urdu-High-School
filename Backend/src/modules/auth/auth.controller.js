const authService = require("./auth.service");



/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

exports.login = async (req, res, next) => {

    try {


        const result =
            await authService.login(
                req.body
            );



        res.status(200).json({

            success:true,

            message:"Login Successful.",

            data:result

        });



    } catch(error){

        next(error);

    }

};






/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/


exports.getProfile = async (req, res, next) => {

    try {


        const userId =
            req.user.userId ||
            req.user.user_id;



        if(!userId){

            return res.status(400).json({

                success:false,

                message:"User ID missing from token."

            });

        }




        const result =
            await authService.getProfile(
                userId
            );




        res.status(200).json({

            success:true,

            message:"Profile fetched successfully.",

            data:result

        });



    } catch(error){

        next(error);

    }

};






/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/


exports.logout = async (req, res, next) => {

    try {


        const userId =
            req.user.userId ||
            req.user.user_id;




        if(!userId){


            return res.status(400).json({

                success:false,

                message:"User ID missing from token."

            });


        }





        await authService.logout(
            userId
        );





        res.status(200).json({

            success:true,

            message:"Logout Successful."

        });




    } catch(error){

        next(error);

    }

};