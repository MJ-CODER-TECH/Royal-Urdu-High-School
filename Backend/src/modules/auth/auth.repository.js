const pool = require("../../config/database");



/*
|--------------------------------------------------------------------------
| Find User By Username
|--------------------------------------------------------------------------
*/

exports.findByUsername = async (username) => {


    const sql = `

        SELECT

            ul.user_id,

            ul.username,

            ul.name,

            ul.email,

            ul.password_hash,

            ul.role_id,

            ul.is_active,

            ul.last_login,


            r.role_name


        FROM user_login ul


        LEFT JOIN roles r

            ON r.role_id = ul.role_id


        WHERE ul.username = ?


        LIMIT 1

    `;



    const [rows] = await pool.execute(
        sql,
        [username]
    );



    return rows;

};





/*
|--------------------------------------------------------------------------
| Update Last Login
|--------------------------------------------------------------------------
*/


exports.updateLastLogin = async (
    connection,
    userId
) => {


    const sql = `

        UPDATE user_login

        SET last_login = NOW()

        WHERE user_id = ?

    `;



    return await connection.execute(
        sql,
        [userId]
    );


};





/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/


exports.changePassword = async (
    connection,
    userId,
    passwordHash
)=>{


    const sql = `

        UPDATE user_login

        SET password_hash = ?

        WHERE user_id = ?

    `;



    return await connection.execute(
        sql,
        [
            passwordHash,
            userId
        ]
    );


};






/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/


exports.getProfile = async(userId)=>{


    const sql = `


        SELECT


            ul.user_id,

            ul.username,

            ul.name,

            ul.email,

            ul.role_id,

            ul.last_login,

            ul.is_active,


            r.role_name



        FROM user_login ul



        LEFT JOIN roles r

            ON r.role_id = ul.role_id



        WHERE ul.user_id = ?



        LIMIT 1


    `;



    const [rows] =
        await pool.query(
            sql,
            [userId]
        );



    return rows;


};






/*
|--------------------------------------------------------------------------
| Get Permissions By Role
|--------------------------------------------------------------------------
*/


exports.getPermissionsByRole = async(roleId)=>{


    const sql = `


        SELECT


            p.permission_name



        FROM role_permissions rp



        INNER JOIN permissions p

            ON p.permission_id = rp.permission_id



        WHERE rp.role_id = ?



        ORDER BY p.permission_name


    `;



    const [rows] =
        await pool.query(
            sql,
            [roleId]
        );



    return rows;


};







/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/


exports.logout = async(userId)=>{


    const sql = `


        UPDATE user_login


        SET last_logout = NOW()


        WHERE user_id = ?


    `;



    return await pool.execute(
        sql,
        [userId]
    );


};