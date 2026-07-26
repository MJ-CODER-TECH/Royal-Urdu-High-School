const jwt = require("jsonwebtoken");

exports.generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user.userId,
            username: user.username,
            role: user.role,
            roleId: user.roleId,
            permissions: user.permissions,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN,
        }
    );
};

exports.verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};