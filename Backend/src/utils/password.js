const bcrypt = require("bcrypt");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

/**
 * Hash Password
 */
exports.hashPassword = async (plainPassword) => {

    return await bcrypt.hash(
        plainPassword,
        SALT_ROUNDS
    );

};

/**
 * Compare Password
 */
exports.comparePassword = async (
    plainPassword,
    hashedPassword
) => {

    return await bcrypt.compare(
        plainPassword,
        hashedPassword
    );

};