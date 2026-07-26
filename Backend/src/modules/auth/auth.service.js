const pool = require("../../config/database");

const ApiError =
require("../../utils/ApiError");

const authRepository =
require("./auth.repository");

const passwordUtil =
require("../../utils/password");

const tokenUtil =
require("../../utils/generateToken");





/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/


exports.login = async(loginData)=>{


    const users =
        await authRepository.findByUsername(
            loginData.username
        );



    if(users.length === 0){


        throw new ApiError(
            401,
            "Invalid username or password."
        );

    }





    const user = users[0];





    if(!user.is_active){


        throw new ApiError(
            403,
            "Your account has been deactivated."
        );


    }





    const passwordMatched =

        await passwordUtil.comparePassword(
            loginData.password,
            user.password_hash
        );





    if(!passwordMatched){


        throw new ApiError(
            401,
            "Invalid username or password."
        );


    }






    const connection =
        await pool.getConnection();





    try{


        await connection.beginTransaction();






        await authRepository.updateLastLogin(
            connection,
            user.user_id
        );







        const permissionRows =

            await authRepository
            .getPermissionsByRole(
                user.role_id
            );







        const permissions =

            permissionRows.map(
                item =>
                item.permission_name
            );







        /*
        |--------------------------------------------------------------------------
        | JWT DATA
        |--------------------------------------------------------------------------
        */


        const tokenUser = {


            userId:user.user_id,


            username:user.username,


            role:user.role_name,


            roleId:user.role_id,


            permissions


        };







        const accessToken =

            tokenUtil.generateAccessToken(
                tokenUser
            );







        await connection.commit();







        return {


            accessToken,



            user:{


                userId:user.user_id,


                username:user.username,


                name:user.name,


                email:user.email,


                role:user.role_name,


                roleId:user.role_id,


                permissions


            }


        };





    }
    catch(error){


        await connection.rollback();

        throw error;


    }
    finally{


        connection.release();


    }



};









/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/


exports.getProfile = async(userId)=>{


    const users =

        await authRepository.getProfile(
            userId
        );





    if(users.length === 0){


        throw new ApiError(
            404,
            "User not found."
        );


    }





    const user = users[0];






    const permissionRows =

        await authRepository
        .getPermissionsByRole(
            user.role_id
        );








    return {


        userId:user.user_id,


        username:user.username,


        name:user.name,


        email:user.email,


        role:user.role_name,


        roleId:user.role_id,


        lastLogin:user.last_login,


        isActive:user.is_active,



        permissions:

            permissionRows.map(
                p=>p.permission_name
            )


    };



};







/*
|--------------------------------------------------------------------------
| LOGOUT
|--------------------------------------------------------------------------
*/

exports.logout = async(userId)=>{


    if(!userId){

        throw new ApiError(
            400,
            "User ID missing."
        );

    }



    await authRepository.logout(
        userId
    );


    return true;

};