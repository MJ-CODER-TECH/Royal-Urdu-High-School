const pool = require("../../config/database");

/*
|--------------------------------------------------------------------------
| Get All Classes
|--------------------------------------------------------------------------
*/

// Don't touch this route ok this is all conection 

exports.getAllClasses = async () => {

    const sql = `
        SELECT
            class_id,
            class_name
        FROM class_master
        WHERE is_active = 1
        ORDER BY class_id ASC
    `;

    const [rows] = await pool.execute(sql);

    return rows;

};

// close 


/*
|--------------------------------------------------------------------------
| Class Management
|--------------------------------------------------------------------------
*/

exports.getClasses = async () => {

    const sql = `
        SELECT
            class_id,
            class_name,
            description,
            is_active,
            created_at,
            updated_at
        FROM class_master
        ORDER BY class_id DESC
    `;

    const [rows] = await pool.execute(sql);

    return rows;

};

exports.getClassById = async (id) => {

    const sql = `
        SELECT
            class_id,
            class_name,
            description,
            is_active
        FROM class_master
        WHERE class_id = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [id]);

    return rows[0];

};

exports.createClass = async (data) => {

    const sql = `
        INSERT INTO class_master
        (
            class_name,
            description,
            is_active
        )
        VALUES
        (
            ?, ?, ?
        )
    `;

    const [result] = await pool.execute(sql, [
        data.class_name,
        data.description,
        data.is_active ?? 1
    ]);

    return result;

};

exports.updateClass = async (id, data) => {

    const sql = `
        UPDATE class_master
        SET
            class_name = ?,
            description = ?,
            is_active = ?
        WHERE class_id = ?
    `;

    const [result] = await pool.execute(sql, [
        data.class_name,
        data.description,
        data.is_active,
        id
    ]);

    return result;

};

exports.deleteClass = async (id) => {

    const [result] = await pool.execute(
        `DELETE FROM class_master WHERE class_id = ?`,
        [id]
    );

    return result;

};

exports.changeClassStatus = async (id, status) => {

    const [result] = await pool.execute(
        `
        UPDATE class_master
        SET is_active = ?
        WHERE class_id = ?
        `,
        [status, id]
    );

    return result;

};




/*
|--------------------------------------------------------------------------
| Get All Sections
|--------------------------------------------------------------------------
*/

// dont touch this 

exports.getAllSections = async () => {

    const sql = `
        SELECT
            s.section_id,
            s.class_id,
            s.section_name,
            c.class_name
        FROM section_master s
        LEFT JOIN class_master c
            ON c.class_id = s.class_id
        ORDER BY s.class_id ASC
    `;

    const [rows] = await pool.execute(sql);

    return rows;

};
// close 


/*
|--------------------------------------------------------------------------
| Get Section Management List
|--------------------------------------------------------------------------
*/

exports.getSections = async () => {

    const [rows] = await pool.execute(`
        SELECT
            s.section_id,
            s.class_id,
            c.class_name,
            s.section_name,
            s.capacity,
            s.is_active,
            s.created_at,
            s.updated_at
        FROM section_master s
        LEFT JOIN class_master c
            ON s.class_id = c.class_id
        ORDER BY s.section_id DESC
    `);

    return rows;

};

/*
|--------------------------------------------------------------------------
| Get Section By Id
|--------------------------------------------------------------------------
*/

exports.getSectionById = async (id) => {

    const [rows] = await pool.execute(
        `
        SELECT
            section_id,
            class_id,
            section_name,
            capacity,
            is_active
        FROM section_master
        WHERE section_id = ?
        `,
        [id]
    );

    return rows[0];

};

/*
|--------------------------------------------------------------------------
| Create Section
|--------------------------------------------------------------------------
*/

exports.createSection = async (data) => {

    const {
        class_id,
        section_name,
        capacity,
        is_active,
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO section_master
        (
            class_id,
            section_name,
            capacity,
            is_active
        )
        VALUES
        (?, ?, ?, ?)
        `,
        [
            class_id,
            section_name,
            capacity,
            is_active,
        ]
    );

    return result.insertId;

};

/*
|--------------------------------------------------------------------------
| Update Section
|--------------------------------------------------------------------------
*/

exports.updateSection = async (
    id,
    data
) => {

    const {
        class_id,
        section_name,
        capacity,
        is_active,
    } = data;

    await pool.execute(
        `
        UPDATE section_master
        SET
            class_id = ?,
            section_name = ?,
            capacity = ?,
            is_active = ?
        WHERE section_id = ?
        `,
        [
            class_id,
            section_name,
            capacity,
            is_active,
            id,
        ]
    );

};

/*
|--------------------------------------------------------------------------
| Delete Section
|--------------------------------------------------------------------------
*/

exports.deleteSection = async (id) => {

    await pool.execute(
        `
        DELETE FROM section_master
        WHERE section_id = ?
        `,
        [id]
    );

};

/*
|--------------------------------------------------------------------------
| Change Section Status
|--------------------------------------------------------------------------
*/

exports.changeSectionStatus = async (
    id,
    is_active
) => {

    await pool.execute(
        `
        UPDATE section_master
        SET is_active = ?
        WHERE section_id = ?
        `,
        [
            is_active,
            id,
        ]
    );

};



// dont touch this 

exports.getAllAcademicYears = async () => {

    const sql = `
        SELECT
            academic_year_id,
            year_start,
            year_end,
            is_current,

            CONCAT(
                year_start,
                '-',
                year_end
            ) AS year_label

        FROM academic_year

        WHERE is_active = 1

        ORDER BY academic_year_id DESC
    `;

    const [rows] = await pool.execute(sql);

    return rows;

};

// close 


/*
|--------------------------------------------------------------------------
| Academic Year Management
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Get All Academic Years
|--------------------------------------------------------------------------
*/

exports.getAcademicYears = async () => {


    const [rows] = await pool.execute(`

        SELECT

            academic_year_id,

            year_start,

            year_end,

            is_current,

            is_active,

            created_at,

            updated_at


        FROM academic_year

        ORDER BY academic_year_id DESC

    `);


    return rows;

};




/*
|--------------------------------------------------------------------------
| Get Academic Year By ID
|--------------------------------------------------------------------------
*/

exports.getAcademicYearById = async (id) => {


    const [rows] = await pool.execute(

        `

        SELECT

            academic_year_id,

            year_start,

            year_end,

            is_current,

            is_active


        FROM academic_year

        WHERE academic_year_id = ?

        `,

        [
            id
        ]

    );


    return rows[0];

};





/*
|--------------------------------------------------------------------------
| Create Academic Year
|--------------------------------------------------------------------------
*/

exports.createAcademicYear = async (data) => {


    const {

        year_start,

        year_end,

        is_current,

        is_active


    } = data;



    const [result] = await pool.execute(

        `

        INSERT INTO academic_year

        (

            year_start,

            year_end,

            is_current,

            is_active

        )

        VALUES

        (?, ?, ?, ?)

        `,

        [

            year_start,

            year_end,

            is_current,

            is_active

        ]

    );


    return result.insertId;

};






/*
|--------------------------------------------------------------------------
| Update Academic Year
|--------------------------------------------------------------------------
*/

exports.updateAcademicYear = async (
    id,
    data
) => {


    const {

        year_start,

        year_end,

        is_current,

        is_active


    } = data;



    await pool.execute(

        `

        UPDATE academic_year

        SET

            year_start = ?,

            year_end = ?,

            is_current = ?,

            is_active = ?


        WHERE academic_year_id = ?

        `,

        [

            year_start,

            year_end,

            is_current,

            is_active,

            id

        ]

    );


};







/*
|--------------------------------------------------------------------------
| Delete Academic Year
|--------------------------------------------------------------------------
*/
exports.deleteAcademicYear = async (id) => {

    await pool.execute(

        `
        UPDATE academic_year

        SET

        is_active = 0

        WHERE academic_year_id = ?

        `,

        [id]

    );

};





/*
|--------------------------------------------------------------------------
| Change Status
|--------------------------------------------------------------------------
*/

exports.changeAcademicYearStatus = async (
    id,
    status
) => {


    await pool.execute(

        `

        UPDATE academic_year

        SET

            is_active = ?

        WHERE academic_year_id = ?

        `,

        [

            status,

            id

        ]

    );


};



exports.getAllSubjects = async()=>{

    const [rows] = await pool.execute(`
        SELECT
            subject_id,
            subject_name
        FROM subjects
        WHERE is_active = 1
        ORDER BY subject_id ASC
    `);

    return rows;

};
