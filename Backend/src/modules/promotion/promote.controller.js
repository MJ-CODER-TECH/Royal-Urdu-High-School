const promotionService = require("./promote.service");

// ===========================================
// Get Students For Promotion
// ===========================================
exports.getStudents = async (req, res, next) => {
    try {

        const data = await promotionService.getStudents(req.query);

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

// ===========================================
// Promote Students
// ===========================================
exports.promoteStudents = async (req, res, next) => {
    try {

        // JWT login hone ke baad ye use karenge:
        // const promotedBy = req.user.user_id;

        const promotedBy = 1; // Temporary, until auth is wired in

        const result = await promotionService.promoteStudents(
            req.body,
            promotedBy
        );

        return res.status(200).json(result);

    } catch (error) {
        next(error);
    }
};

// ===========================================
// Promotion History
// ===========================================
exports.getHistory = async (req, res, next) => {
    try {

        const data = await promotionService.getHistory(req.query);

        return res.status(200).json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};