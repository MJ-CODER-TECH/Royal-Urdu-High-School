const db = require("../../config/database");

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.findAll = async (filters = {}) => {

    const values = [];

    let query = `
        SELECT
            t.timetable_id,
            t.academic_year_id,
            t.class_id,
            t.section_id,
            t.subject_id,
            t.teacher_id,
            t.day_of_week,
            t.period_no,
            t.start_time,
            t.end_time,
            t.room,
            t.status,

            c.class_name,
            s.section_name,
            sub.subject_name,
            u.name AS teacher_name

        FROM timetable t

        INNER JOIN class_master c
            ON c.class_id = t.class_id

        INNER JOIN section_master s
            ON s.section_id = t.section_id

        INNER JOIN subjects sub
            ON sub.subject_id = t.subject_id

        LEFT JOIN user_login u
            ON u.user_id = t.teacher_id

        WHERE 1=1
    `;

    if (filters.academic_year_id) {
        query += ` AND t.academic_year_id = ?`;
        values.push(filters.academic_year_id);
    }

    if (filters.class_id) {
        query += ` AND t.class_id = ?`;
        values.push(filters.class_id);
    }

    if (filters.section_id) {
        query += ` AND t.section_id = ?`;
        values.push(filters.section_id);
    }

    if (filters.teacher_id) {
        query += ` AND t.teacher_id = ?`;
        values.push(filters.teacher_id);
    }

    if (filters.day_of_week) {
        query += ` AND t.day_of_week = ?`;
        values.push(filters.day_of_week);
    }

    query += `
        ORDER BY
        FIELD(
            t.day_of_week,
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday'
        ),
        t.period_no
    `;

    const [rows] = await db.query(query, values);

    return rows;
};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

exports.findById = async (id) => {

    const [rows] = await db.query(
        `
        SELECT *
        FROM timetable
        WHERE timetable_id = ?
        `,
        [id]
    );

    return rows[0];

};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

exports.create = async (data) => {

    const {
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        period_no,
        start_time,
        end_time,
        room,
    } = data;

    const [result] = await db.query(
        `
        INSERT INTO timetable
        (
            academic_year_id,
            class_id,
            section_id,
            subject_id,
            teacher_id,
            day_of_week,
            period_no,
            start_time,
            end_time,
            room
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            academic_year_id,
            class_id,
            section_id,
            subject_id,
            teacher_id || null,
            day_of_week,
            period_no,
            start_time,
            end_time,
            room || null,
        ]
    );

    return result.insertId;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.update = async (id, data) => {

  const {
    academic_year_id,
    class_id,
    section_id,
    subject_id,
    teacher_id,
    day_of_week,
    period_no,
    start_time,
    end_time,
    room,
} = data;

await db.query(
    `
    UPDATE timetable
    SET
        academic_year_id = ?,
        class_id = ?,
        section_id = ?,
        subject_id = ?,
        teacher_id = ?,
        day_of_week = ?,
        period_no = ?,
        start_time = ?,
        end_time = ?,
        room = ?
    WHERE timetable_id = ?
    `,
    [
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id || null,
        day_of_week,
        period_no,
        start_time,
        end_time,
        room || null,
        id,
    ]
);

};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

exports.remove = async (id) => {

    await db.query(
        `
        DELETE FROM timetable
        WHERE timetable_id = ?
        `,
        [id]
    );

};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.changeStatus = async (id, status) => {

    await db.query(
        `
        UPDATE timetable
        SET status = ?
        WHERE timetable_id = ?
        `,
        [
            status,
            id,
        ]
    );

};



/*
|--------------------------------------------------------------------------
| CHECK TEACHER CONFLICT
|--------------------------------------------------------------------------
*/

exports.checkTeacherConflict = async (
    academic_year_id,
    teacher_id,
    day_of_week,
    period_no,
    timetable_id = 0
) => {

    if (!teacher_id) return false;

    const [rows] = await db.query(
        `
        SELECT timetable_id
        FROM timetable
        WHERE academic_year_id = ?
        AND teacher_id = ?
        AND day_of_week = ?
        AND period_no = ?
        AND timetable_id != ?
        LIMIT 1
        `,
        [
            academic_year_id,
            teacher_id,
            day_of_week,
            period_no,
            timetable_id,
        ]
    );

    return rows.length > 0;

};


/*
|--------------------------------------------------------------------------
| CHECK CLASS CONFLICT
|--------------------------------------------------------------------------
*/

exports.checkClassConflict = async (
    academic_year_id,
    class_id,
    section_id,
    day_of_week,
    period_no,
    timetable_id = 0
) => {

    const [rows] = await db.query(
        `
        SELECT timetable_id
        FROM timetable
        WHERE academic_year_id = ?
        AND class_id = ?
        AND section_id = ?
        AND day_of_week = ?
        AND period_no = ?
        AND timetable_id != ?
        LIMIT 1
        `,
        [
            academic_year_id,
            class_id,
            section_id,
            day_of_week,
            period_no,
            timetable_id,
        ]
    );

    return rows.length > 0;

};


/*
|--------------------------------------------------------------------------
| CHECK ROOM CONFLICT
|--------------------------------------------------------------------------
*/

exports.checkRoomConflict = async (
    academic_year_id,
    room,
    day_of_week,
    period_no,
    timetable_id = 0
) => {

    if (!room) return false;

    const [rows] = await db.query(
        `
        SELECT timetable_id
        FROM timetable
        WHERE academic_year_id = ?
        AND room = ?
        AND day_of_week = ?
        AND period_no = ?
        AND timetable_id != ?
        LIMIT 1
        `,
        [
            academic_year_id,
            room,
            day_of_week,
            period_no,
            timetable_id,
        ]
    );

    return rows.length > 0;

};




/*
|--------------------------------------------------------------------------
| CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

exports.findClassTimetable = async(filters)=>{


const {
    academic_year_id,
    class_id,
    section_id
}=filters;



const [rows] = await db.query(

`
SELECT

t.timetable_id,

t.day_of_week,

t.period_no,

t.start_time,

t.end_time,

sub.subject_name,

u.name AS teacher_name,

t.room


FROM timetable t


INNER JOIN subjects sub

ON sub.subject_id = t.subject_id



LEFT JOIN user_login u

ON u.user_id = t.teacher_id



WHERE
t.academic_year_id = ?

AND t.class_id = ?

AND t.section_id = ?

AND t.status = 'Active'


ORDER BY

FIELD(
t.day_of_week,
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday'
),

t.period_no

`,

[
academic_year_id,
class_id,
section_id
]

);


return rows;


};



/*
|--------------------------------------------------------------------------
| FIND TEACHER TIMETABLE
|--------------------------------------------------------------------------
*/

exports.findTeacherTimetable = async(filters)=>{


const {
    academic_year_id,
    teacher_id
}=filters;



const [rows] = await db.query(

`
SELECT

t.timetable_id,

t.day_of_week,

t.period_no,

t.start_time,

t.end_time,

c.class_name,

s.section_name,

sub.subject_name,

t.room


FROM timetable t



INNER JOIN class_master c

ON c.class_id = t.class_id



INNER JOIN section_master s

ON s.section_id = t.section_id



INNER JOIN subjects sub

ON sub.subject_id = t.subject_id



WHERE

t.academic_year_id = ?

AND t.teacher_id = ?

AND t.status = 'Active'



ORDER BY

FIELD(
t.day_of_week,
'Monday',
'Tuesday',
'Wednesday',
'Thursday',
'Friday',
'Saturday'
),

t.period_no

`,

[
academic_year_id,
teacher_id
]


);


return rows;


};