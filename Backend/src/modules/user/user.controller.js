const userService = require("./user.service");

exports.getAll = async (req, res) => {

    const {

        search,

        roleId,

        status,

    } = req.query;

    const result =
        await userService.getAll({

            search,

            roleId,

            status,

        });

    res.status(200).json({

        success: true,

        message: "Users fetched successfully.",

        data: result

    });

};

exports.getById = async (req, res) => {

    const result =
        await userService.getById(
            req.params.id
        );

    res.status(200).json({

        success: true,

        message: "User fetched successfully.",

        data: result

    });

};

exports.create = async (req, res) => {

    const result =
        await userService.create(

            req.body,

            req.user.userId

        );

    res.status(201).json({

        success: true,

        message: "User created successfully.",

        data: result

    });

};

exports.update = async (req, res) => {

    const result =
        await userService.update(

            req.params.id,

            req.body

        );

    res.status(200).json({

        success: true,

        message: "User updated successfully.",

        data: result

    });

};

exports.changeStatus = async (req, res) => {

    await userService.changeStatus(

        req.params.id,

        req.body.is_active

    );

    res.status(200).json({

        success: true,

        message: "User status updated successfully."

    });

};

exports.resetPassword = async (req, res) => {

    await userService.resetPassword(

        req.params.id,

        req.body.password

    );

    res.status(200).json({

        success: true,

        message: "Password reset successfully."

    });

};

exports.delete = async (req, res) => {

    await userService.delete(

        req.params.id

    );

    res.status(200).json({

        success: true,

        message: "User deleted successfully."

    });

};

exports.getRoles = async (req, res) => {

    const result =
        await userService.getRoles();

    res.status(200).json({

        success: true,

        message: "Roles fetched successfully.",

        data: result

    });

};