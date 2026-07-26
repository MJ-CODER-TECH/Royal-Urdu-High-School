const pool = require("../../../config/database");

exports.getMonthlyAttendance = async (studentId, month, year) => {
  const sql = `
        SELECT

            s.student_id,

            CONCAT(
                s.first_name,
                ' ',
                IFNULL(s.middle_name,''),
                ' ',
                IFNULL(s.last_name,'')
            ) AS student_name,

            COUNT(a.attendance_id) AS working_days,

            SUM(a.status='Present') AS present,

            SUM(a.status='Absent') AS absent,

            SUM(a.status='Leave') AS leave_count,

            SUM(a.status='Late') AS late,

            SUM(a.status='Half Day') AS half_day

        FROM attendance a

        INNER JOIN student s

        ON s.student_id = a.student_id

        WHERE

        a.student_id = ?

        AND MONTH(a.attendance_date)=?

        AND YEAR(a.attendance_date)=?

        GROUP BY s.student_id
    `;

  const [rows] = await pool.execute(sql, [studentId, month, year]);

  return rows;
};

exports.getClassMonthlyAttendance = async (query) => {
  const {
    class_id,
    section_id,
    month,
    year,
    page = 1,
    limit = 20,
    search = "",
    gender,
    category,
    sort = "roll_no",
    order = "ASC",
  } = query;

  const pageNo = Number(page) || 1;
  const pageSize = Number(limit) || 20;
  const offset = (pageNo - 1) * pageSize;

  const allowedSort = [
    "roll_no",
    "admission_no",
    "first_name",
    "attendance_percentage",
  ];

  const finalSort = allowedSort.includes(sort) ? sort : "roll_no";

  const finalOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let where = `
        WHERE s.class_id = ?
        AND s.section_id = ?
        AND s.status='Active'
    `;

  const params = [Number(class_id), Number(section_id)];

  if (search) {
    where += `
        AND (
            s.first_name LIKE ?
            OR s.middle_name LIKE ?
            OR s.last_name LIKE ?
            OR s.roll_no LIKE ?
            OR s.admission_no LIKE ?
        )
        `;

    params.push(
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
      `%${search}%`,
    );
  }

  if (gender) {
    where += ` AND s.gender=?`;
    params.push(gender);
  }

  if (category) {
    where += ` AND s.category=?`;
    params.push(category);
  }

  const sql = `

    SELECT

        s.student_id,
        s.roll_no,
        s.admission_no,

        CONCAT(
            s.first_name,
            ' ',
            IFNULL(s.middle_name,''),
            ' ',
            IFNULL(s.last_name,'')
        ) student_name,

        COUNT(a.attendance_id) working_days,

        SUM(a.status='Present') present,

        SUM(a.status='Absent') absent,

        SUM(a.status='Leave') leave_count,

        SUM(a.status='Late') late,

        SUM(a.status='Half Day') half_day,

        ROUND(
            (
                SUM(a.status='Present')
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,
            2
        ) attendance_percentage

    FROM student s

    LEFT JOIN attendance a
        ON a.student_id = s.student_id
        AND MONTH(a.attendance_date)=?
        AND YEAR(a.attendance_date)=?

    ${where}

    GROUP BY s.student_id

    ORDER BY ${finalSort} ${finalOrder}

    LIMIT ${pageSize}
    OFFSET ${offset}

    `;

  const values = [Number(month), Number(year), ...params];

  // console.log(values);

  const [rows] = await pool.execute(sql, values);

  const countSql = `
        SELECT COUNT(*) total
        FROM student s
        ${where}
    `;

  const [count] = await pool.execute(countSql, params);

  return {
    page: pageNo,

    limit: pageSize,

    total: count[0].total,

    totalPages: Math.ceil(count[0].total / pageSize),

    data: rows,
  };
};

exports.getAttendanceDashboard = async (classId, sectionId, month, year) => {
  const sql = `

    SELECT

        COUNT(DISTINCT s.student_id) total_students,

        SUM(a.status='Present') total_present,

        SUM(a.status='Absent') total_absent,

        SUM(a.status='Leave') total_leave,

        SUM(a.status='Late') total_late,

        SUM(a.status='Half Day') total_half_day,

        ROUND(

            SUM(a.status='Present')*100/

            NULLIF(COUNT(a.attendance_id),0),

            2

        ) attendance_percentage

    FROM student s

    LEFT JOIN attendance a

        ON s.student_id=a.student_id

        AND MONTH(a.attendance_date)=?

        AND YEAR(a.attendance_date)=?

    WHERE

        s.class_id=?

        AND s.section_id=?

        AND s.status='Active'

    `;

  const [rows] = await pool.execute(sql, [month, year, classId, sectionId]);

  return rows[0];
};

exports.getAttendanceCalendar = async (studentId, month, year) => {
  const sql = `
        SELECT
            attendance_date,
            status,
            check_in,
            check_out,
            remarks
        FROM attendance
        WHERE student_id = ?
        AND MONTH(attendance_date) = ?
        AND YEAR(attendance_date) = ?
        ORDER BY attendance_date ASC
    `;

  const [rows] = await pool.execute(sql, [
    Number(studentId),
    Number(month),
    Number(year),
  ]);

  return rows;
};

exports.getLowAttendanceStudents = async (query) => {

    const {
        class_id,
        section_id,
        month,
        year,
        percentage = 75
    } = query;

    const sql = `

    SELECT

        s.student_id,

        s.roll_no,

        s.admission_no,

        CONCAT(

            s.first_name,' ',

            IFNULL(s.middle_name,''),' ',

            IFNULL(s.last_name,'')

        ) student_name,

        COUNT(a.attendance_id) working_days,

        SUM(a.status='Present') present,

        SUM(a.status='Absent') absent,

        SUM(a.status='Leave') leave_count,

        SUM(a.status='Late') late,

        SUM(a.status='Half Day') half_day,

        ROUND(

            (SUM(a.status='Present') /

            NULLIF(COUNT(a.attendance_id),0))

            *100,

            2

        ) attendance_percentage

    FROM student s

    LEFT JOIN attendance a

        ON s.student_id = a.student_id

        AND MONTH(a.attendance_date)=?

        AND YEAR(a.attendance_date)=?

    WHERE

        s.class_id=?

        AND s.section_id=?

        AND s.status='Active'

    GROUP BY s.student_id

    HAVING attendance_percentage < ?

    ORDER BY attendance_percentage ASC

    `;

    const values = [

        Number(month),

        Number(year),

        Number(class_id),

        Number(section_id),

        Number(percentage)

    ];

    const [rows] = await pool.execute(sql, values);

    return {

        count: rows.length,

        data: rows

    };

};

exports.getYearlyAttendance = async (
    studentId,
    year
) => {

    const sql = `

SELECT

    MONTH(a.attendance_date) AS month_no,

    COUNT(a.attendance_id) AS working_days,

    SUM(a.status='Present') AS present,

    SUM(a.status='Absent') AS absent,

    SUM(a.status='Leave') AS leave_count,

    SUM(a.status='Late') AS late,

    SUM(a.status='Half Day') AS half_day,

    ROUND(
        SUM(a.status='Present') * 100 /
        NULLIF(COUNT(a.attendance_id),0),
        2
    ) AS attendance_percentage

FROM attendance a

WHERE
    a.student_id = ?
    AND YEAR(a.attendance_date)=?

GROUP BY
    MONTH(a.attendance_date)

ORDER BY
    MONTH(a.attendance_date);

    `;

    const [rows] = await pool.execute(sql, [

        Number(studentId),

        Number(year)

    ]);

    return rows;

};

exports.getStudentMonthlyAttendance = async (
    studentId,
    month,
    year
) => {

    const sql = `

    SELECT

        s.student_id,

        s.admission_no,

        s.roll_no,

        CONCAT(
            s.first_name,' ',
            IFNULL(s.middle_name,''),' ',
            IFNULL(s.last_name,'')
        ) AS student_name,

        c.class_name,

        sec.section_name,

        COUNT(a.attendance_id) AS working_days,

        SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,

        SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent,

        SUM(CASE WHEN a.status='Leave' THEN 1 ELSE 0 END) AS leave_count,

        SUM(CASE WHEN a.status='Late' THEN 1 ELSE 0 END) AS late,

        SUM(CASE WHEN a.status='Half Day' THEN 1 ELSE 0 END) AS half_day,

        ROUND(

            (
                SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,

            2

        ) AS attendance_percentage

    FROM student s

    LEFT JOIN attendance a
        ON a.student_id = s.student_id
        AND MONTH(a.attendance_date)=?
        AND YEAR(a.attendance_date)=?

    INNER JOIN class_master c
        ON c.class_id = s.class_id

    INNER JOIN section_master sec
        ON sec.section_id = s.section_id

    WHERE

        s.student_id = ?

        AND s.status='Active'

    GROUP BY

        s.student_id,
        s.admission_no,
        s.roll_no,
        s.first_name,
        s.middle_name,
        s.last_name,
        c.class_name,
        sec.section_name;

    `;

    const [rows] = await pool.execute(sql, [

        Number(month),
        Number(year),
        Number(studentId)

    ]);

    return rows;

};

exports.getAttendanceRegister = async (query) => {

    const {

        class_id,
        section_id,
        date

    } = query;

    const sql = `

    SELECT

        s.student_id,

        s.roll_no,

        s.admission_no,

        CONCAT(

            s.first_name,' ',

            IFNULL(s.middle_name,''),' ',

            IFNULL(s.last_name,'')

        ) student_name,

        a.status,

        a.check_in,

        a.check_out,

        a.remarks

    FROM student s

    LEFT JOIN attendance a

        ON a.student_id = s.student_id

        AND a.attendance_date = ?

    WHERE

        s.class_id = ?

        AND s.section_id = ?

        AND s.status = 'Active'

    ORDER BY

        s.roll_no ASC

    `;

    const [rows] = await pool.execute(sql, [

        date,

        Number(class_id),

        Number(section_id)

    ]);

    return rows;

};

exports.getAttendanceRegisterMatrix = async (query) => {

    const {
        class_id,
        section_id,
        month,
        year
    } = query;

    const sql = `
        SELECT

        s.student_id,
        s.roll_no,
        s.admission_no,

        CONCAT(
            s.first_name,' ',
            IFNULL(s.middle_name,''),' ',
            IFNULL(s.last_name,'')
        ) AS student_name,

        DAY(a.attendance_date) AS attendance_day,

        a.status

        FROM student s

        LEFT JOIN attendance a
            ON a.student_id = s.student_id
            AND MONTH(a.attendance_date) = ?
            AND YEAR(a.attendance_date) = ?

        WHERE
            s.class_id = ?
            AND s.section_id = ?
            AND s.status = 'Active'

        ORDER BY
            s.roll_no,
            a.attendance_date
    `;

    const [rows] = await pool.execute(sql, [
        Number(month),
        Number(year),
        Number(class_id),
        Number(section_id)
    ]);

    return rows;
};

exports.getAttendanceAnalytics = async (query) => {

    const {
        class_id,
        section_id,
        month,
        year
    } = query;

    const sql = `

    SELECT

        COUNT(DISTINCT s.student_id) AS total_students,

        COUNT(a.attendance_id) AS total_records,

        SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END) AS present,

        SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END) AS absent,

        SUM(CASE WHEN a.status='Leave' THEN 1 ELSE 0 END) AS leave_count,

        SUM(CASE WHEN a.status='Late' THEN 1 ELSE 0 END) AS late,

        SUM(CASE WHEN a.status='Half Day' THEN 1 ELSE 0 END) AS half_day,

        ROUND(
            (
                SUM(CASE WHEN a.status='Present' THEN 1 ELSE 0 END)
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,
            2
        ) AS present_percentage,

        ROUND(
            (
                SUM(CASE WHEN a.status='Absent' THEN 1 ELSE 0 END)
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,
            2
        ) AS absent_percentage,

        ROUND(
            (
                SUM(CASE WHEN a.status='Leave' THEN 1 ELSE 0 END)
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,
            2
        ) AS leave_percentage,

        ROUND(
            (
                SUM(CASE WHEN a.status='Late' THEN 1 ELSE 0 END)
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,
            2
        ) AS late_percentage,

        ROUND(
            (
                SUM(CASE WHEN a.status='Half Day' THEN 1 ELSE 0 END)
                /
                NULLIF(COUNT(a.attendance_id),0)
            ) * 100,
            2
        ) AS half_day_percentage

    FROM student s

    LEFT JOIN attendance a

        ON a.student_id = s.student_id
        AND MONTH(a.attendance_date)=?
        AND YEAR(a.attendance_date)=?

    WHERE

        s.class_id=?
        AND s.section_id=?
        AND s.status='Active';

    `;

    const [rows] = await pool.execute(sql, [

        Number(month),
        Number(year),
        Number(class_id),
        Number(section_id)

    ]);

    return rows[0];

};

