const pool = require("../../config/database");

exports.findDuplicateAttendance = async (studentId, attendanceDate) => {

    const sql = `
        SELECT attendance_id
        FROM attendance
        WHERE student_id = ?
        AND attendance_date = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [
        studentId,
        attendanceDate
    ]);

    return rows;
};

exports.createAttendance = async (connection, attendanceData) => {

    const sql = `
        INSERT INTO attendance
        (
            student_id,
            attendance_date,
            status,
            check_in,
            check_out,
            remarks,
            created_by
        )
        VALUES
        (
            ?, ?, ?, ?, ?, ?, ?
        )
    `;

    const values = [
        attendanceData.student_id,
        attendanceData.attendance_date,
        attendanceData.status,
        attendanceData.check_in ?? null,
        attendanceData.check_out ?? null,
        attendanceData.remarks ?? null,
        attendanceData.created_by ?? null
    ];

    const [result] = await connection.execute(sql, values);

    return result;
};

exports.getAllAttendance = async (filters = {}) => {

    const {
        search = "",
        attendanceDate = "",
        classId = "",
        sectionId = "",
        status = "",
        page = 1,
        limit = 20,
    } = filters;

    const conditions = [];
    const values = [];

   if (search) {

    conditions.push(`
        (
            s.admission_no LIKE ?
            OR TRIM(
                CONCAT(
                    COALESCE(s.first_name,''),
                    ' ',
                    COALESCE(s.middle_name,''),
                    ' ',
                    COALESCE(s.last_name,'')
                )
            ) LIKE ?
        )
    `);

    values.push(
        `%${search}%`,
        `%${search}%`
    );

}

    if (attendanceDate) {
        conditions.push("a.attendance_date = ?");
        values.push(attendanceDate);
    }

    if (classId) {
        conditions.push("s.class_id = ?");
        values.push(classId);
    }

    if (sectionId) {
        conditions.push("s.section_id = ?");
        values.push(sectionId);
    }

    if (status) {
        conditions.push("a.status = ?");
        values.push(status);
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    // Total count
    const countSql = `
        SELECT COUNT(*) AS total
        FROM attendance a
        INNER JOIN student s ON s.student_id = a.student_id
        LEFT JOIN class_master cm ON cm.class_id = s.class_id
        LEFT JOIN section_master sm ON sm.section_id = s.section_id
        ${whereClause}
    `;

    const [countRows] = await pool.execute(countSql, values);
    const total = countRows[0].total;

    // Safe integer conversion — SQL injection se bachne ke liye
    const safeLimit = Math.max(1, parseInt(limit, 10) || 20);
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const offset = (safePage - 1) * safeLimit;

    // LIMIT/OFFSET ko placeholder ke bajay direct interpolate karo
  const dataSql = `
    SELECT
        a.attendance_id,
        a.attendance_date,
        a.status,
        a.check_in,
        a.check_out,
        a.remarks,

        s.student_id,
        s.admission_no,

        TRIM(
            CONCAT(
                COALESCE(s.first_name,''),
                ' ',
                COALESCE(s.middle_name,''),
                ' ',
                COALESCE(s.last_name,'')
            )
        ) AS student_name,

        cm.class_name,
        sm.section_name

    FROM attendance a

    INNER JOIN student s
        ON s.student_id = a.student_id

    LEFT JOIN class_master cm
        ON cm.class_id = s.class_id

    LEFT JOIN section_master sm
        ON sm.section_id = s.section_id

    ${whereClause}

    ORDER BY a.attendance_date DESC
    LIMIT ${safeLimit} OFFSET ${offset}
`;

    const [rows] = await pool.execute(dataSql, values);

    return {
        data: rows,
        total,
        page: safePage,
        totalPages: Math.ceil(total / safeLimit) || 1,
    };
};

exports.getAttendanceById = async (attendanceId) => {

    const sql = `
        SELECT *
        FROM attendance
        WHERE attendance_id = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [attendanceId]);

    return rows;
};

exports.getAttendanceByStudent = async (studentId) => {

    const sql = `
        SELECT *
        FROM attendance
        WHERE student_id = ?
        ORDER BY attendance_date DESC
    `;

    const [rows] = await pool.execute(sql, [studentId]);

    return rows;
};

exports.getAttendanceByDate = async (attendanceDate) => {

    const sql = `
        SELECT *
        FROM attendance
        WHERE attendance_date = ?
        ORDER BY student_id
    `;

    const [rows] = await pool.execute(sql, [attendanceDate]);

    return rows;
};

exports.updateAttendance = async (
    connection,
    attendanceId,
    attendanceData
) => {

    const sql = `
        UPDATE attendance
        SET
            attendance_date = ?,
            status = ?,
            check_in = ?,
            check_out = ?,
            remarks = ?,
            updated_by = ?
        WHERE attendance_id = ?
    `;

    const values = [
        attendanceData.attendance_date,
        attendanceData.status,
        attendanceData.check_in ?? null,
        attendanceData.check_out ?? null,
        attendanceData.remarks ?? null,
        attendanceData.updated_by ?? null,
        attendanceId
    ];

    const [result] = await connection.execute(sql, values);

    return result;
};

exports.deleteAttendance = async (
    connection,
    attendanceId
) => {

    const sql = `
        DELETE FROM attendance
        WHERE attendance_id = ?
    `;

    const [result] = await connection.execute(sql, [attendanceId]);

    return result;
};





exports.bulkAttendance = async (connection, data, userId) => {

    const summary = {
        total: 0,
        present: 0,
        absent: 0,
        leave: 0,
        late: 0,
        halfDay: 0
    };

    for (const attendance of data.attendance) {

        // Student Validation
        const [student] = await connection.execute(
            `
            SELECT
                student_id,
                class_id,
                section_id,
                status
            FROM student
            WHERE student_id = ?
            `,
            [attendance.student_id]
        );

        if (!student.length) {
            throw new ApiError(
                404,
                `Student ${attendance.student_id} not found`
            );
        }

        if (student[0].status !== "Active") {
            throw new ApiError(
                400,
                `Student ${attendance.student_id} is not active`
            );
        }

        if (
            student[0].class_id != data.class_id ||
            student[0].section_id != data.section_id
        ) {
            throw new ApiError(
                400,
                `Student ${attendance.student_id} does not belong to selected class`
            );
        }

        // Duplicate Check
        const [existing] = await connection.execute(
            `
            SELECT attendance_id
            FROM attendance
            WHERE student_id = ?
            AND attendance_date = ?
            `,
            [
                attendance.student_id,
                data.attendance_date
            ]
        );

        if (existing.length) {

            await connection.execute(
                `
                UPDATE attendance
                SET
                    status = ?,
                    remarks = ?,
                    updated_by = ?,
                    updated_at = NOW()
                WHERE attendance_id = ?
                `,
                [
                    attendance.status,
                    attendance.remarks ?? null,
                    userId,
                    existing[0].attendance_id
                ]
            );

        } else {

            await connection.execute(
                `
                INSERT INTO attendance
                (
                    student_id,
                    attendance_date,
                    status,
                    remarks,
                    created_by
                )
                VALUES
                (
                    ?, ?, ?, ?, ?
                )
                `,
                [
                    attendance.student_id,
                    data.attendance_date,
                    attendance.status,
                    attendance.remarks ?? null,
                    userId
                ]
            );

        }

        summary.total++;

        switch (attendance.status) {

            case "Present":
                summary.present++;
                break;

            case "Absent":
                summary.absent++;
                break;

            case "Leave":
                summary.leave++;
                break;

            case "Late":
                summary.late++;
                break;

            case "Half Day":
                summary.halfDay++;
                break;

        }

    }

    return summary;

};


