const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const baseUploadDir = path.join(
    process.cwd(),
    "uploads"
);

const schoolLogoDir = path.join(
    baseUploadDir,
    "school"
);

const signatureDir = path.join(
    baseUploadDir,
    "signatures"
);

const stampDir = path.join(
    baseUploadDir,
    "stamps"
);

[
    schoolLogoDir,
    signatureDir,
    stampDir,
].forEach((directory) => {

    if (!fs.existsSync(directory)) {

        fs.mkdirSync(
            directory,
            {
                recursive: true,
            }
        );

    }

});


const storage = multer.diskStorage({

    destination(
        req,
        file,
        cb
    ) {

        if (
            file.fieldname ===
            "logo"
        ) {

            return cb(
                null,
                schoolLogoDir
            );

        }


        if (
            file.fieldname ===
            "principal_signature"
        ) {

            return cb(
                null,
                signatureDir
            );

        }


        if (
            file.fieldname ===
            "school_stamp"
        ) {

            return cb(
                null,
                stampDir
            );

        }


        return cb(
            new Error(
                "Invalid school profile upload field."
            )
        );

    },


    filename(
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            )
            .toLowerCase();

        const uniqueName =

            Date.now() +

            "_" +

            crypto
                .randomBytes(6)
                .toString("hex") +

            extension;

        cb(
            null,
            uniqueName
        );

    },

});


const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [

        "image/jpeg",

        "image/jpg",

        "image/png",

        "image/webp",

    ];


    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {

        return cb(
            null,
            true
        );

    }


    return cb(
        new Error(
            "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
    );

};


const schoolProfileUpload =
    multer({

        storage,

        fileFilter,

        limits: {

            fileSize:
                2 *
                1024 *
                1024,

        },

    });


module.exports =
    schoolProfileUpload;