exports.checkHealth = (req, res) => {

    res.status(200).json({

        success: true,

        message: "School ERP API is Healthy",

        timestamp: new Date()

    });

};