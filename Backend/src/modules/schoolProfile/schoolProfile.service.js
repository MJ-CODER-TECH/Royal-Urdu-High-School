const schoolProfileRepository =
    require("./schoolProfile.repository");


/*
|--------------------------------------------------------------------------
| Get School Profile
|--------------------------------------------------------------------------
*/

exports.getSchoolProfile = async () => {

    return await
        schoolProfileRepository.getSchoolProfile();

};


/*
|--------------------------------------------------------------------------
| Create School Profile
|--------------------------------------------------------------------------
*/

exports.createSchoolProfile = async (data) => {

    if (!data.school_name?.trim()) {

        const error = new Error(
            "School name is required."
        );

        error.statusCode = 400;

        throw error;

    }

    return await
        schoolProfileRepository.createSchoolProfile(
            data
        );

};


/*
|--------------------------------------------------------------------------
| Update School Profile
|--------------------------------------------------------------------------
*/

exports.updateSchoolProfile = async (
    schoolId,
    data
) => {

    if (!data.school_name?.trim()) {

        const error = new Error(
            "School name is required."
        );

        error.statusCode = 400;

        throw error;

    }

    const result =
        await schoolProfileRepository
            .updateSchoolProfile(
                schoolId,
                data
            );

    if (result.affectedRows === 0) {

        const error = new Error(
            "School profile not found."
        );

        error.statusCode = 404;

        throw error;

    }

    return result;

};


/*
|--------------------------------------------------------------------------
| Add School Unit
|--------------------------------------------------------------------------
*/

exports.addSchoolUnit = async (
    schoolId,
    data
) => {

    if (!data.school_name?.trim()) {

        const error = new Error(
            "School unit name is required."
        );

        error.statusCode = 400;

        throw error;

    }

    if (!data.udise_no?.trim()) {

        const error = new Error(
            "UDISE number is required."
        );

        error.statusCode = 400;

        throw error;

    }

    return await
        schoolProfileRepository.addSchoolUnit(
            schoolId,
            data
        );

};


/*
|--------------------------------------------------------------------------
| Update School Unit
|--------------------------------------------------------------------------
*/

exports.updateSchoolUnit = async (
    unitId,
    data
) => {

    if (
        !data.school_name?.trim() ||
        !data.udise_no?.trim()
    ) {

        const error = new Error(
            "School name and UDISE number are required."
        );

        error.statusCode = 400;

        throw error;

    }

    const result =
        await schoolProfileRepository
            .updateSchoolUnit(
                unitId,
                data
            );

    if (result.affectedRows === 0) {

        const error = new Error(
            "School unit not found."
        );

        error.statusCode = 404;

        throw error;

    }

    return result;

};


/*
|--------------------------------------------------------------------------
| Delete School Unit
|--------------------------------------------------------------------------
*/

exports.deleteSchoolUnit = async (unitId) => {

    const result =
        await schoolProfileRepository
            .deleteSchoolUnit(unitId);

    if (result.affectedRows === 0) {

        const error = new Error(
            "School unit not found."
        );

        error.statusCode = 404;

        throw error;

    }

    return result;

};