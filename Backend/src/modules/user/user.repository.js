const pool = require("../../config/database");

exports.getAll = async (filters = {}) => {

    const {
        search,
        roleId,
        status,
    } = filters;

    const conditions = [];
    const params = [];

    if (search) {
        conditions.push(
            "(u.username LIKE ? OR u.name LIKE ?)"
        );
        params.push(`%${search}%`, `%${search}%`);
    }

    if (roleId) {
        conditions.push("u.role_id = ?");
        params.push(roleId);
    }

    if (status !== undefined && status !== "") {
        conditions.push("u.is_active = ?");
        params.push(status);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const sql = `

        SELECT

            u.user_id,
            u.username,
            u.name,
            u.email,
            u.role_id,
            r.role_name,
            u.is_active,
            u.last_login,   
            u.created_at

        FROM user_login u

        INNER JOIN roles r

            ON r.role_id = u.role_id

        ${whereClause}

        ORDER BY u.user_id DESC

    `;

    const [rows] = await pool.query(sql, params);

    return rows;

};

exports.getById = async (userId) => {

    const sql = `

        SELECT

            u.user_id,
            u.username,
            u.name,
            u.email,
            u.role_id,
            r.role_name,
            u.is_active

        FROM user_login u

        INNER JOIN roles r

            ON r.role_id = u.role_id

        WHERE u.user_id = ?

        LIMIT 1

    `;

    const [rows] = await pool.query(sql,[userId]);

    return rows;

};

exports.findByUsername = async (username) => {

    const sql = `

        SELECT
            *
        FROM user_login
        WHERE username = ?
        LIMIT 1

    `;

    const [rows] = await pool.query(sql,[username]);

    return rows;

};

exports.create = async (
    connection,
    user
) => {

    const sql = `

        INSERT INTO user_login
        (
            username,
            name,
            email,
            password_hash,
            role_id,
            is_active,
            created_by
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )

    `;

    const [result] = await connection.execute(sql,[

        user.username,
        user.name ?? null,
        user.email ?? null,
        user.password_hash,
        user.role_id,
        user.is_active,
        user.created_by

    ]);

    return result.insertId;

};

exports.update = async (
    connection,
    userId,
    user
) => {

    const sql = `

        UPDATE user_login

        SET

            username=?,
            name=?,
            email=?,
            role_id=?,
            updated_at=NOW()

        WHERE user_id=?

    `;

    await connection.execute(sql,[

        user.username,
        user.name ?? null,
        user.email ?? null,
        user.role_id,
        userId

    ]);

};

exports.changeStatus = async (
    connection,
    userId,
    status
) => {

    const sql = `

        UPDATE user_login

        SET

            is_active=?,
            updated_at=NOW()

        WHERE user_id=?

    `;

    await connection.execute(sql,[

        status,
        userId

    ]);

};

exports.resetPassword = async (
    connection,
    userId,
    password
) => {

    const sql = `

        UPDATE user_login

        SET

            password_hash=?,
            updated_at=NOW()

        WHERE user_id=?

    `;

    await connection.execute(sql,[

        password,
        userId

    ]);

};

exports.delete = async (
    connection,
    userId
) => {

    const sql = `

        DELETE FROM user_login

        WHERE user_id=?

    `;

    await connection.execute(sql,[userId]);

};

exports.getRoles = async () => {

    const sql = `

        SELECT

            role_id,
            role_name

        FROM roles

        ORDER BY role_name

    `;

    const [rows] = await pool.query(sql);

    return rows;

};