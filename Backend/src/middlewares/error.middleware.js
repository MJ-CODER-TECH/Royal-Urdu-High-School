const errorMiddleware = (err, req, res, next) => {

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {

        return res.status(400).json({

            success: false,

            message: "Maximum file size allowed is 2 MB."

        });

    }

    // Multer invalid file type
    if (
        err.message ===
        "Only JPG, JPEG, PNG and WEBP images are allowed."
    ) {

        return res.status(400).json({

            success: false,

            message: err.message

        });

    }

    const statusCode = err.statusCode || 500;

    console.error({
        time: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        message: err.message,
        stack: err.stack,
    });

    const isProduction =
        process.env.NODE_ENV === "production";

    res.status(statusCode).json({

        success: false,

        message:
            isProduction && statusCode >= 500
                ? "Internal Server Error"
                : err.message || "Internal Server Error",

    });

};

module.exports = errorMiddleware;