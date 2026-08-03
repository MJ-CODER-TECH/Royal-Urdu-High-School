const pool = require("../../config/database");


/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

const nullIfEmpty = (value) => {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    return value;

};


/*
|--------------------------------------------------------------------------
| Find Student By Admission Number
|--------------------------------------------------------------------------
*/

exports.findByAdmissionNo = async (
    admissionNo
) => {

    const sql = `

        SELECT student_id

        FROM student

        WHERE admission_no = ?

        LIMIT 1

    `;


    const [rows] = await pool.execute(

        sql,

        [admissionNo]

    );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Find Student By GR Number
|--------------------------------------------------------------------------
*/

exports.findByGrNo = async (
    grNo
) => {

    const sql = `

        SELECT student_id

        FROM student

        WHERE gr_no = ?

        LIMIT 1

    `;


    const [rows] = await pool.execute(

        sql,

        [grNo]

    );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Find Student By Aadhaar
|--------------------------------------------------------------------------
*/

exports.findByAadhar = async (
    aadhaar
) => {

    const sql = `

        SELECT student_id

        FROM student

        WHERE aadhaar = ?

        LIMIT 1

    `;


    const [rows] = await pool.execute(

        sql,

        [aadhaar]

    );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Find Student By Mobile
|--------------------------------------------------------------------------
*/

exports.findByMobile = async (
    mobile
) => {

    const sql = `

        SELECT student_id

        FROM student

        WHERE mobile = ?

        LIMIT 1

    `;


    const [rows] = await pool.execute(

        sql,

        [mobile]

    );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Find Student By Email
|--------------------------------------------------------------------------
*/

exports.findByEmail = async (
    email
) => {

    const sql = `

        SELECT student_id

        FROM student

        WHERE email = ?

        LIMIT 1

    `;


    const [rows] = await pool.execute(

        sql,

        [email]

    );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Create Student
|--------------------------------------------------------------------------
*/

exports.createStudent = async (

    connection,

    studentData

) => {

    const sql = `

        INSERT INTO student
        (

            admission_no,

            pen_number,

            gr_no,

            roll_no,


            first_name,

            middle_name,

            last_name,


            dob,

            place_of_birth,

            gender,


            religion,

            category,

            caste,

            sub_caste,


            nationality,

            mother_tongue,


            aadhaar,

            blood_group,


            mobile,

            email,


            admission_date,

            last_school_attended,

            admission_std,


            academic_year_id,

            class_id,

            section_id,


            photo_path,

            status,


            created_by,

            updated_by

        )

        VALUES
        (

            ?, ?, ?, ?,

            ?, ?, ?,

            ?, ?, ?,

            ?, ?, ?, ?,

            ?, ?,

            ?, ?,

            ?, ?,

            ?, ?, ?,

            ?, ?, ?,

            ?, ?,

            ?, ?

        )

    `;


    const values = [

        nullIfEmpty(
            studentData.admission_no
        ),

        nullIfEmpty(
            studentData.pen_number
        ),

        nullIfEmpty(
            studentData.gr_no
        ),

        nullIfEmpty(
            studentData.roll_no
        ),


        nullIfEmpty(
            studentData.first_name
        ),

        nullIfEmpty(
            studentData.middle_name
        ),

        nullIfEmpty(
            studentData.last_name
        ),


        nullIfEmpty(
            studentData.dob
        ),

        nullIfEmpty(
            studentData.place_of_birth
        ),

        nullIfEmpty(
            studentData.gender
        ),


        nullIfEmpty(
            studentData.religion
        ),

        nullIfEmpty(
            studentData.category
        ),

        nullIfEmpty(
            studentData.caste
        ),

        nullIfEmpty(
            studentData.sub_caste
        ),


        nullIfEmpty(
            studentData.nationality
        ),

        nullIfEmpty(
            studentData.mother_tongue
        ),


        nullIfEmpty(
            studentData.aadhaar
        ),

        nullIfEmpty(
            studentData.blood_group
        ),


        nullIfEmpty(
            studentData.mobile
        ),

        nullIfEmpty(
            studentData.email
        ),


        nullIfEmpty(
            studentData.admission_date
        ),

        nullIfEmpty(
            studentData.last_school_attended
        ),

        nullIfEmpty(
            studentData.admission_std
        ),


        // Academic Details

        nullIfEmpty(
            studentData.academic_year_id
        ),

        nullIfEmpty(
            studentData.class_id
        ),

        nullIfEmpty(
            studentData.section_id
        ),


        nullIfEmpty(
            studentData.photo_path
        ),

        nullIfEmpty(
            studentData.status
        ) ?? "Active",


        nullIfEmpty(
            studentData.created_by
        ),

        nullIfEmpty(
            studentData.updated_by
        ),

    ];


    const placeholderCount =

        (
            sql.match(/\?/g)
            || []
        ).length;


    if (
        placeholderCount !==
        values.length
    ) {

        throw new Error(

            `Student create mismatch: ` +

            `SQL placeholders = ${placeholderCount}, ` +

            `values = ${values.length}`

        );

    }


    const [result] =

        await connection.execute(

            sql,

            values

        );


    return result;

};


/*
|--------------------------------------------------------------------------
| Update Student
|--------------------------------------------------------------------------
*/

exports.updateStudent = async (

    connection,

    studentId,

    studentData

) => {

    const sql = `

        UPDATE student

        SET

            admission_no = ?,

            pen_number = ?,

            gr_no = ?,

            roll_no = ?,


            first_name = ?,

            middle_name = ?,

            last_name = ?,


            dob = ?,

            place_of_birth = ?,


            gender = ?,


            religion = ?,

            category = ?,

            caste = ?,

            sub_caste = ?,


            nationality = ?,

            mother_tongue = ?,


            aadhaar = ?,


            blood_group = ?,


            mobile = ?,

            email = ?,


            admission_date = ?,

            last_school_attended = ?,

            admission_std = ?,


            academic_year_id = ?,

            class_id = ?,

            section_id = ?,


            photo_path = ?,


            status = ?,


            updated_by = ?,


            updated_at = NOW()


        WHERE student_id = ?

    `;


    const values = [

        nullIfEmpty(
            studentData.admission_no
        ),

        nullIfEmpty(
            studentData.pen_number
        ),

        nullIfEmpty(
            studentData.gr_no
        ),

        nullIfEmpty(
            studentData.roll_no
        ),


        nullIfEmpty(
            studentData.first_name
        ),

        nullIfEmpty(
            studentData.middle_name
        ),

        nullIfEmpty(
            studentData.last_name
        ),


        nullIfEmpty(
            studentData.dob
        ),

        nullIfEmpty(
            studentData.place_of_birth
        ),


        nullIfEmpty(
            studentData.gender
        ),


        nullIfEmpty(
            studentData.religion
        ),

        nullIfEmpty(
            studentData.category
        ),

        nullIfEmpty(
            studentData.caste
        ),

        nullIfEmpty(
            studentData.sub_caste
        ),


        nullIfEmpty(
            studentData.nationality
        ),

        nullIfEmpty(
            studentData.mother_tongue
        ),


        nullIfEmpty(
            studentData.aadhaar
        ),


        nullIfEmpty(
            studentData.blood_group
        ),


        nullIfEmpty(
            studentData.mobile
        ),

        nullIfEmpty(
            studentData.email
        ),


        nullIfEmpty(
            studentData.admission_date
        ),

        nullIfEmpty(
            studentData.last_school_attended
        ),

        nullIfEmpty(
            studentData.admission_std
        ),


        // Academic Details

        nullIfEmpty(
            studentData.academic_year_id
        ),

        nullIfEmpty(
            studentData.class_id
        ),

        nullIfEmpty(
            studentData.section_id
        ),


        nullIfEmpty(
            studentData.photo_path
        ),


        nullIfEmpty(
            studentData.status
        ) ?? "Active",


        nullIfEmpty(
            studentData.updated_by
        ),


        studentId,

    ];


    const placeholderCount =

        (
            sql.match(/\?/g)
            || []
        ).length;


    if (
        placeholderCount !==
        values.length
    ) {

        throw new Error(

            `Student update mismatch: ` +

            `SQL placeholders = ${placeholderCount}, ` +

            `values = ${values.length}`

        );

    }


    const [result] =

        await connection.execute(

            sql,

            values

        );


    return result;

};


/*
|--------------------------------------------------------------------------
| Delete Student
|--------------------------------------------------------------------------
*/

exports.deleteStudent = async (

    connection,

    studentId

) => {

    const sql = `

        UPDATE student

        SET

            status = "Deleted",

            updated_at = NOW()

        WHERE student_id = ?

    `;


    const [result] =

        await connection.execute(

            sql,

            [studentId]

        );


    return result;

};


/*
|--------------------------------------------------------------------------
| Get Student By ID
|--------------------------------------------------------------------------
*/

exports.getStudentById = async (studentId) => {

  const sql = `

    SELECT

      s.student_id,

      s.admission_no,
      s.pen_number,
      s.gr_no,
      s.roll_no,

      s.first_name,
      s.middle_name,
      s.last_name,

      s.dob,
      s.place_of_birth,

      s.gender,

      s.religion,
      s.category,
      s.caste,
      s.sub_caste,

      s.nationality,
      s.mother_tongue,

      s.aadhaar,
      s.blood_group,

      s.mobile,
      s.email,

      s.admission_date,
      s.last_school_attended,
      s.admission_std,

      s.academic_year_id,

      CONCAT(
        ay.year_start,
        '-',
        ay.year_end
      ) AS academic_year,

      s.class_id,
      s.section_id,

      s.photo_path,
      s.status,

      c.class_name,

      sec.section_name,

      p.father_name,
      p.father_mobile,
      p.father_occupation,

      p.mother_name,
      p.mother_mobile,
      p.mother_occupation,

      p.mobile AS parent_mobile,

      p.guardian_name,
      p.guardian_mobile,

      p.email AS parent_email,

      p.annual_income,

      p.relation,

      a.house,
      a.street,
      a.village,
      a.city,
      a.taluka,
      a.district,
      a.state,
      a.country,
      a.pincode

    FROM student s

    LEFT JOIN academic_year ay
      ON ay.academic_year_id = s.academic_year_id

    LEFT JOIN class_master c
      ON c.class_id = s.class_id

    LEFT JOIN section_master sec
      ON sec.section_id = s.section_id

    LEFT JOIN parent p
      ON p.student_id = s.student_id

    LEFT JOIN student_address a
      ON a.student_id = s.student_id

    WHERE s.student_id = ?

    LIMIT 1

  `;

  const [rows] = await pool.execute(
    sql,
    [studentId]
  );

  return rows;

};




/*
|--------------------------------------------------------------------------
| Get All Students
|--------------------------------------------------------------------------
*/

exports.getAllStudents = async () => {

    const sql = `

        SELECT

            s.student_id,

            s.admission_no,

            s.gr_no,

            s.roll_no,


            s.first_name,

            s.middle_name,

            s.last_name,


            s.gender,

            s.mobile,


            s.academic_year_id,


            CONCAT(

                ay.year_start,

                '-',

                ay.year_end

            ) AS academic_year,


            s.class_id,

            s.section_id,


            c.class_name,

            sec.section_name,


            s.photo_path,

            s.status


        FROM student s


        LEFT JOIN academic_year ay

            ON ay.academic_year_id
            =
            s.academic_year_id


        LEFT JOIN class_master c

            ON c.class_id
            =
            s.class_id


        LEFT JOIN section_master sec

            ON sec.section_id
            =
            s.section_id


        ORDER BY

            s.student_id DESC

    `;


    const [rows] =

        await pool.execute(

            sql

        );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Get Students
|--------------------------------------------------------------------------
*/

exports.getStudents = async (
    query
) => {

   let baseSql = `
    FROM student s

    LEFT JOIN academic_year ay
        ON ay.academic_year_id = s.academic_year_id

    LEFT JOIN class_master c
        ON s.class_id = c.class_id

    LEFT JOIN section_master sec
        ON s.section_id = sec.section_id

    WHERE 1 = 1
`;


    const values = [];


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (
        query.search
    ) {

        baseSql += `

            AND
            (

                s.first_name LIKE ?

                OR

                s.middle_name LIKE ?

                OR

                s.last_name LIKE ?

                OR

                s.admission_no LIKE ?

                OR

                s.gr_no LIKE ?

            )

        `;


        const keyword =

            `%${query.search}%`;


        values.push(

            keyword,

            keyword,

            keyword,

            keyword,

            keyword

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Academic Year Filter
    |--------------------------------------------------------------------------
    */

    if (
        query.academicYearId
    ) {

        baseSql += `

            AND

            s.academic_year_id = ?

        `;


        values.push(

            query.academicYearId

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Class Filter
    |--------------------------------------------------------------------------
    */

    if (
        query.classId
    ) {

        baseSql += `

            AND

            s.class_id = ?

        `;


        values.push(

            query.classId

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Section Filter
    |--------------------------------------------------------------------------
    */

    if (
        query.sectionId
    ) {

        baseSql += `

            AND

            s.section_id = ?

        `;


        values.push(

            query.sectionId

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Status Filter
    |--------------------------------------------------------------------------
    */

    if (
        query.status
    ) {

        baseSql += `

            AND

            s.status = ?

        `;


        values.push(

            query.status

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Total Count
    |--------------------------------------------------------------------------
    */

    const countSql = `

        SELECT

            COUNT(*)

            AS total

        ${baseSql}

    `;


    const [countRows] =

        await pool.execute(

            countSql,

            values

        );


    const total =

        countRows[0]?.total
        || 0;


    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const page =

        Math.max(

            1,

            parseInt(
                query.page,
                10
            )
            ||
            1

        );


    const limit =

        Math.min(

            100,

            Math.max(

                1,

                parseInt(
                    query.limit,
                    10
                )
                ||
                20

            )

        );


    const offset =

        (
            page - 1
        )
        *
        limit;


    /*
    |--------------------------------------------------------------------------
    | Student Data
    |--------------------------------------------------------------------------
    */

const dataSql = `

  SELECT

    s.student_id,

    s.admission_no,

    s.gr_no,

    s.roll_no,

    s.first_name,

    s.middle_name,

    s.last_name,

    s.mobile,

    s.academic_year_id,

    CONCAT(
      ay.year_start,
      '-',
      ay.year_end
    ) AS academic_year,

    c.class_name,

    sec.section_name,

    s.photo_path,

    s.status

  ${baseSql}

  ORDER BY s.student_id DESC

  LIMIT ${limit}

  OFFSET ${offset}

`;


    const [rows] =

        await pool.execute(

            dataSql,

            values

        );


    return {

        rows,

        total,

        page,

        limit,

    };

};


/*
|--------------------------------------------------------------------------
| Find Admission Number For Update
|--------------------------------------------------------------------------
*/

exports.findByAdmissionNoForUpdate =
async (

    admissionNo,

    studentId

) => {

    const sql = `

        SELECT

            student_id

        FROM student

        WHERE

            admission_no = ?

        AND

            student_id <> ?

        LIMIT 1

    `;


    const [rows] =

        await pool.execute(

            sql,

            [

                admissionNo,

                studentId

            ]

        );


    return rows;

};


/*
|--------------------------------------------------------------------------
| Get Student WhatsApp Data
|--------------------------------------------------------------------------
*/

exports.getStudentWhatsAppData =
async (
    studentId
) => {

    const sql = `

        SELECT

            s.student_id,


            s.admission_no,


            CONCAT(

                s.first_name,

                " ",

                IFNULL(
                    s.middle_name,
                    ""
                ),

                " ",

                IFNULL(
                    s.last_name,
                    ""
                )

            )

            AS student_name,


            cm.class_name,


            sm.section_name,


            p.mobile

            AS parent_mobile,


            sc.school_name


        FROM student s


        LEFT JOIN parent p

            ON p.student_id
            =
            s.student_id


        LEFT JOIN class_master cm

            ON cm.class_id
            =
            s.class_id


        LEFT JOIN section_master sm

            ON sm.section_id
            =
            s.section_id


        CROSS JOIN school_master sc


        WHERE

            s.student_id = ?


        LIMIT 1

    `;


    const [rows] =

        await pool.execute(

            sql,

            [studentId]

        );


    return rows[0];

};


/*
|--------------------------------------------------------------------------
| Create / Update Parent
|--------------------------------------------------------------------------
*/

exports.createParent = async (

    connection,

    studentId,

    studentData

) => {

    const sql = `

        INSERT INTO parent
        (

            student_id,

            father_name,

            father_mobile,

            father_occupation,


            mother_name,

            mother_mobile,

            mother_occupation,


            mobile,


            guardian_name,

            guardian_mobile,


            annual_income,

            email,

            relation

        )

        VALUES
        (

            ?, ?, ?, ?,

            ?, ?, ?,

            ?,

            ?, ?,

            ?, ?, ?

        )


        ON DUPLICATE KEY UPDATE


            father_name
            =
            VALUES(father_name),


            father_mobile
            =
            VALUES(father_mobile),


            father_occupation
            =
            VALUES(father_occupation),


            mother_name
            =
            VALUES(mother_name),


            mother_mobile
            =
            VALUES(mother_mobile),


            mother_occupation
            =
            VALUES(mother_occupation),


            mobile
            =
            VALUES(mobile),


            guardian_name
            =
            VALUES(guardian_name),


            guardian_mobile
            =
            VALUES(guardian_mobile),


            annual_income
            =
            VALUES(annual_income),


            email
            =
            VALUES(email),


            relation
            =
            VALUES(relation)

    `;


    return await connection.execute(

        sql,

        [

            studentId,


            nullIfEmpty(
                studentData.father_name
            ),

            nullIfEmpty(
                studentData.father_mobile
            ),

            nullIfEmpty(
                studentData.father_occupation
            ),


            nullIfEmpty(
                studentData.mother_name
            ),

            nullIfEmpty(
                studentData.mother_mobile
            ),

            nullIfEmpty(
                studentData.mother_occupation
            ),


            nullIfEmpty(
                studentData.parent_mobile
            ),


            nullIfEmpty(
                studentData.guardian_name
            ),

            nullIfEmpty(
                studentData.guardian_mobile
            ),


            nullIfEmpty(
                studentData.annual_income
            ),

            nullIfEmpty(
                studentData.parent_email
            ),

            nullIfEmpty(
                studentData.relation
            )
            ??
            "Father",

        ]

    );

};


/*
|--------------------------------------------------------------------------
| Create / Update Address
|--------------------------------------------------------------------------
*/

exports.createAddress = async (

    connection,

    studentId,

    studentData

) => {

    const hasAddressData =

        studentData.house ||

        studentData.street ||

        studentData.village ||

        studentData.city ||

        studentData.taluka ||

        studentData.district ||

        studentData.state ||

        studentData.country ||

        studentData.pincode;


    if (
        !hasAddressData
    ) {

        return null;

    }


    const sql = `

        INSERT INTO student_address
        (

            student_id,

            house,

            street,

            village,

            city,

            taluka,

            district,

            state,

            country,

            pincode

        )

        VALUES
        (

            ?, ?, ?, ?, ?,

            ?, ?, ?, ?, ?

        )


        ON DUPLICATE KEY UPDATE


            house
            =
            VALUES(house),


            street
            =
            VALUES(street),


            village
            =
            VALUES(village),


            city
            =
            VALUES(city),


            taluka
            =
            VALUES(taluka),


            district
            =
            VALUES(district),


            state
            =
            VALUES(state),


            country
            =
            VALUES(country),


            pincode
            =
            VALUES(pincode)

    `;


    return await connection.execute(

        sql,

        [

            studentId,


            nullIfEmpty(
                studentData.house
            ),

            nullIfEmpty(
                studentData.street
            ),

            nullIfEmpty(
                studentData.village
            ),

            nullIfEmpty(
                studentData.city
            ),

            nullIfEmpty(
                studentData.taluka
            ),

            nullIfEmpty(
                studentData.district
            ),

            nullIfEmpty(
                studentData.state
            ),

            nullIfEmpty(
                studentData.country
            ),

            nullIfEmpty(
                studentData.pincode
            ),

        ]

    );

};