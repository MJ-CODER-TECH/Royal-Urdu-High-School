const pool = require("../../config/database");


/*
|--------------------------------------------------------------------------
| Get School Profile
|--------------------------------------------------------------------------
*/

exports.getSchoolProfile = async () => {

    const [schools] =
        await pool.execute(`
            SELECT
                school_id,
                school_name,
                address,
                phone,
                email,
                website,
                logo_path,
                principle_name,
                principle_signature_path,
                school_stamp_path,
                affiliation_no,
                udise_no
            FROM school_master
            ORDER BY school_id ASC
            LIMIT 1
        `);


    if (
        schools.length === 0
    ) {

        return null;

    }


    const school =
        schools[0];


    const [units] =
        await pool.execute(

            `
            SELECT
                school_unit_id,
                school_id,
                school_name,
                udise_no,
                is_active,
                created_at,
                updated_at
            FROM school_units
            WHERE school_id = ?
            ORDER BY school_unit_id ASC
            `,

            [
                school.school_id
            ]

        );


    return {

        ...school,

        school_units:
            units,

    };

};


/*
|--------------------------------------------------------------------------
| Create School Profile
|--------------------------------------------------------------------------
*/

exports.createSchoolProfile =
    async (
        data
    ) => {

        const connection =
            await pool.getConnection();


        try {

            await connection
                .beginTransaction();


            const [
                existingSchools
            ] =
                await connection
                    .execute(`

                        SELECT
                            school_id

                        FROM
                            school_master

                        LIMIT 1

                    `);


            if (
                existingSchools.length >
                0
            ) {

                const error =
                    new Error(

                        "School profile already exists."

                    );


                error.statusCode =
                    409;


                throw error;

            }


            const [
                schoolResult
            ] =
                await connection.execute(

                    `
                    INSERT INTO school_master
                    (
                        school_name,
                        address,
                        phone,
                        email,
                        website,
                        logo_path,
                        principle_name,
                        principle_signature_path,
                        school_stamp_path,
                        affiliation_no,
                        udise_no
                    )
                    VALUES
                    (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?
                    )
                    `,

                    [

                        data.school_name,

                        data.address ||
                        null,

                        data.phone ||
                        null,

                        data.email ||
                        null,

                        data.website ||
                        null,

                        data.logo_path ||
                        null,

                        data.principle_name ||
                        null,

                        data.principle_signature_path ||
                        null,

                        data.school_stamp_path ||
                        null,

                        data.affiliation_no ||
                        null,

                        data.udise_no ||
                        null,

                    ]

                );


            const schoolId =
                schoolResult.insertId;


            if (

                Array.isArray(
                    data.school_units
                )

                &&

                data.school_units
                    .length > 0

            ) {

                for (
                    const unit
                    of
                    data.school_units
                ) {

                    await connection
                        .execute(

                            `
                            INSERT INTO
                            school_units
                            (
                                school_id,
                                school_name,
                                udise_no,
                                is_active
                            )
                            VALUES
                            (
                                ?,
                                ?,
                                ?,
                                ?
                            )
                            `,

                            [

                                schoolId,

                                unit.school_name,

                                unit.udise_no,

                                unit.is_active
                                ??
                                1,

                            ]

                        );

                }

            }


            await connection
                .commit();


            return {

                school_id:
                    schoolId,

            };

        }

        catch (
            error
        ) {

            await connection
                .rollback();


            throw error;

        }

        finally {

            connection
                .release();

        }

    };


/*
|--------------------------------------------------------------------------
| Update School Profile
|--------------------------------------------------------------------------
*/

exports.updateSchoolProfile =
    async (
        schoolId,
        data
    ) => {

        const [
            result
        ] =
            await pool.execute(

                `
                UPDATE
                    school_master

                SET

                    school_name = ?,

                    address = ?,

                    phone = ?,

                    email = ?,

                    website = ?,

                    logo_path =
                        COALESCE(
                            ?,
                            logo_path
                        ),

                    principle_name = ?,

                    principle_signature_path =
                        COALESCE(
                            ?,
                            principle_signature_path
                        ),

                    school_stamp_path =
                        COALESCE(
                            ?,
                            school_stamp_path
                        ),

                    affiliation_no = ?,

                    udise_no = ?

                WHERE
                    school_id = ?
                `,

                [

                    data.school_name,

                    data.address ||
                    null,

                    data.phone ||
                    null,

                    data.email ||
                    null,

                    data.website ||
                    null,


                    /*
                    New logo:
                    save new path.

                    No new logo:
                    keep old path.
                    */

                    data.logo_path ||
                    null,


                    data.principle_name ||
                    null,


                    /*
                    New signature:
                    save new path.

                    No new signature:
                    keep old path.
                    */

                    data
                        .principle_signature_path
                    ||
                    null,


                    /*
                    New stamp:
                    save new path.

                    No new stamp:
                    keep old path.
                    */

                    data
                        .school_stamp_path
                    ||
                    null,


                    data.affiliation_no ||
                    null,

                    data.udise_no ||
                    null,

                    schoolId,

                ]

            );


        return result;

    };


/*
|--------------------------------------------------------------------------
| Add School Unit
|--------------------------------------------------------------------------
*/

exports.addSchoolUnit =
    async (
        schoolId,
        data
    ) => {

        const [
            result
        ] =
            await pool.execute(

                `
                INSERT INTO
                    school_units
                (
                    school_id,
                    school_name,
                    udise_no,
                    is_active
                )
                VALUES
                (
                    ?,
                    ?,
                    ?,
                    ?
                )
                `,

                [

                    schoolId,

                    data.school_name,

                    data.udise_no,

                    data.is_active
                    ??
                    1,

                ]

            );


        return {

            school_unit_id:
                result.insertId,

        };

    };


/*
|--------------------------------------------------------------------------
| Update School Unit
|--------------------------------------------------------------------------
*/

exports.updateSchoolUnit =
    async (
        unitId,
        data
    ) => {

        const [
            result
        ] =
            await pool.execute(

                `
                UPDATE
                    school_units

                SET

                    school_name = ?,

                    udise_no = ?,

                    is_active = ?

                WHERE
                    school_unit_id = ?
                `,

                [

                    data.school_name,

                    data.udise_no,

                    data.is_active
                    ??
                    1,

                    unitId,

                ]

            );


        return result;

    };


/*
|--------------------------------------------------------------------------
| Delete School Unit
|--------------------------------------------------------------------------
*/

exports.deleteSchoolUnit =
    async (
        unitId
    ) => {

        const [
            result
        ] =
            await pool.execute(

                `
                DELETE FROM
                    school_units

                WHERE
                    school_unit_id = ?
                `,

                [
                    unitId
                ]

            );


        return result;

    };