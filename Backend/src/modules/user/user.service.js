const pool = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const userRepository = require("./user.repository");
const passwordUtil = require("../../utils/password");

exports.getAll = async (filters) => {

    return await userRepository.getAll(filters);

};

exports.getById = async (userId) => {

    const users = await userRepository.getById(userId);

    if (users.length === 0) {

        throw new ApiError(
            404,
            "User not found."
        );

    }

    return users[0];

};

exports.create = async (payload, currentUserId) => {

    const exists =
        await userRepository.findByUsername(
            payload.username
        );

    if (exists.length > 0) {

        throw new ApiError(
            409,
            "Username already exists."
        );

    }

    const password_hash =
        await passwordUtil.hashPassword(
            payload.password
        );

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        const insertId =
            await userRepository.create(
                connection,
                {

                    username: payload.username,

                    name: payload.name,

                    email: payload.email,

                    password_hash,

                    role_id: payload.role_id,

                    is_active: payload.is_active ?? 1,

                    created_by: currentUserId

                }
            );

        await connection.commit();

        return await this.getById(insertId);

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};

exports.update = async (
    userId,
    payload
) => {

    const users =
        await userRepository.getById(userId);

    if (users.length === 0) {

        throw new ApiError(
            404,
            "User not found."
        );

    }

    const duplicate =
        await userRepository.findByUsername(
            payload.username
        );

    if (
        duplicate.length &&
        duplicate[0].user_id !== Number(userId)
    ) {

        throw new ApiError(
            409,
            "Username already exists."
        );

    }

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        await userRepository.update(
            connection,
            userId,
            payload
        );

        await connection.commit();

        return await this.getById(userId);

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};

exports.changeStatus = async (
    userId,
    status
) => {

    const users =
        await userRepository.getById(userId);

    if (users.length === 0) {

        throw new ApiError(
            404,
            "User not found."
        );

    }

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        await userRepository.changeStatus(
            connection,
            userId,
            status
        );

        await connection.commit();

        return true;

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};

exports.resetPassword = async (
    userId,
    password
) => {

    const users =
        await userRepository.getById(userId);

    if (users.length === 0) {

        throw new ApiError(
            404,
            "User not found."
        );

    }

    const password_hash =
        await passwordUtil.hashPassword(
            password
        );

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        await userRepository.resetPassword(
            connection,
            userId,
            password_hash
        );

        await connection.commit();

        return true;

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};

exports.delete = async (
    userId
) => {

    const users =
        await userRepository.getById(userId);

    if (users.length === 0) {

        throw new ApiError(
            404,
            "User not found."
        );

    }

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();

        await userRepository.delete(
            connection,
            userId
        );

        await connection.commit();

        return true;

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};

exports.getRoles = async () => {

    return await userRepository.getRoles();

};