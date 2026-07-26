const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, "uploads/photos");

    },

    filename(req, file, cb) {

        const uniqueName =
            Date.now() +
            "_" +
            crypto.randomBytes(6).toString("hex") +
            path.extname(file.originalname);

        cb(null, uniqueName);

    }

});

// Allowed image types
const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {

        cb(null, true);

    } else {

        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            )
        );

    }

};

const upload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 2 * 1024 * 1024 // 2 MB

    }

});

module.exports = upload;