const schoolProfileService =
    require(
        "./schoolProfile.service"
    );


/*
|--------------------------------------------------------------------------
| Build Uploaded File Paths
|--------------------------------------------------------------------------
*/

const getUploadedPaths = (
    files
) => {

    const uploadedPaths = {};


    if (
        files?.logo?.[0]
    ) {

        uploadedPaths.logo_path =

            "uploads/school/" +

            files
                .logo[0]
                .filename;

    }


    if (
        files
            ?.principal_signature
            ?.[0]
    ) {

        uploadedPaths
            .principle_signature_path =

            "uploads/signatures/" +

            files
                .principal_signature[0]
                .filename;

    }


    if (
        files
            ?.school_stamp
            ?.[0]
    ) {

        uploadedPaths
            .school_stamp_path =

            "uploads/stamps/" +

            files
                .school_stamp[0]
                .filename;

    }


    return uploadedPaths;

};


/*
|--------------------------------------------------------------------------
| Get School Profile
|--------------------------------------------------------------------------
*/

exports.getSchoolProfile =
    async (
        req,
        res
    ) => {

        const data =

            await schoolProfileService
                .getSchoolProfile();


        res.status(200).json({

            success:
                true,

            exists:
                Boolean(data),

            data,

        });

    };


/*
|--------------------------------------------------------------------------
| Create School Profile
|--------------------------------------------------------------------------
*/

exports.createSchoolProfile =
    async (
        req,
        res
    ) => {

        const uploadedPaths =

            getUploadedPaths(
                req.files
            );


        const schoolData = {

            ...req.body,

            ...uploadedPaths,

        };


        const result =

            await schoolProfileService
                .createSchoolProfile(
                    schoolData
                );


        res.status(201).json({

            success:
                true,

            message:
                "School profile created successfully.",

            data:
                result,

        });

    };


/*
|--------------------------------------------------------------------------
| Update School Profile
|--------------------------------------------------------------------------
*/

exports.updateSchoolProfile =
    async (
        req,
        res
    ) => {

        const uploadedPaths =

            getUploadedPaths(
                req.files
            );


        const schoolData = {

            ...req.body,

            ...uploadedPaths,

        };


        const result =

            await schoolProfileService
                .updateSchoolProfile(

                    req.params.id,

                    schoolData

                );


        res.status(200).json({

            success:
                true,

            message:
                "School profile updated successfully.",

            data:
                result,

        });

    };


/*
|--------------------------------------------------------------------------
| Add School Unit
|--------------------------------------------------------------------------
*/

exports.addSchoolUnit =
    async (
        req,
        res
    ) => {

        const result =

            await schoolProfileService
                .addSchoolUnit(

                    req.params.schoolId,

                    req.body

                );


        res.status(201).json({

            success:
                true,

            message:
                "School unit added successfully.",

            data:
                result,

        });

    };


/*
|--------------------------------------------------------------------------
| Update School Unit
|--------------------------------------------------------------------------
*/

exports.updateSchoolUnit =
    async (
        req,
        res
    ) => {

        const result =

            await schoolProfileService
                .updateSchoolUnit(

                    req.params.unitId,

                    req.body

                );


        res.status(200).json({

            success:
                true,

            message:
                "School unit updated successfully.",

            data:
                result,

        });

    };


/*
|--------------------------------------------------------------------------
| Delete School Unit
|--------------------------------------------------------------------------
*/

exports.deleteSchoolUnit =
    async (
        req,
        res
    ) => {

        await schoolProfileService
            .deleteSchoolUnit(

                req.params.unitId

            );


        res.status(200).json({

            success:
                true,

            message:
                "School unit deleted successfully.",

        });

    };