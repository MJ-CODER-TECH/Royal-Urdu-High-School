const pool = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const attendanceRepository = require("./attendance.repository");
const studentRepository = require("../student/student.repository");
const whatsappService = require("../whatsapp/whatsapp.service");

exports.createAttendance = async (attendanceData) => {

    // Duplicate attendance check
    const duplicate =
        await attendanceRepository.findDuplicateAttendance(
            attendanceData.student_id,
            attendanceData.attendance_date
        );

    if (duplicate.length > 0) {
        throw new ApiError(
            409,
            "Attendance already marked for this student."
        );
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const result =
            await attendanceRepository.createAttendance(
                connection,
                attendanceData
            );

        await connection.commit();

        // WhatsApp alert transaction commit hone ke BAAD bhejo — agar ye
        // fail bhi ho toh attendance record already safely save ho chuka hai.
        if (attendanceData.status === "Absent") {

            try {

              const student = await studentRepository.getStudentWhatsAppData(
    attendanceData.student_id
);

                if (student) {

                    await whatsappService.sendAbsentAlert(

                        student,

                        attendanceData.attendance_date

                    );

                } else {

                    console.error(
                        `[WhatsApp] Absent alert skipped — student ${attendanceData.student_id} ka WhatsApp data nahi mila.`
                    );

                }

            } catch (whatsappError) {

                // WhatsApp fail hone se attendance marking fail NAHI hona chahiye
                console.error(
                    "[WhatsApp] Absent alert failed:",
                    whatsappError.message
                );

            }

        }

        return {
            attendanceId: result.insertId,
            message: "Attendance marked successfully."
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

exports.getAllAttendance = async (filters) => {
    return await attendanceRepository.getAllAttendance(filters);
};

exports.getAttendanceById = async (attendanceId) => {

    const attendance =
        await attendanceRepository.getAttendanceById(attendanceId);

    if (attendance.length === 0) {
        throw new ApiError(404, "Attendance not found.");
    }

    return attendance[0];
};

exports.getAttendanceByStudent = async (studentId) => {

    return await attendanceRepository.getAttendanceByStudent(studentId);

};

exports.getAttendanceByDate = async (attendanceDate) => {

    return await attendanceRepository.getAttendanceByDate(attendanceDate);

};

exports.updateAttendance = async (
    attendanceId,
    attendanceData
) => {

    const attendance =
        await attendanceRepository.getAttendanceById(attendanceId);

    if (attendance.length === 0) {
        throw new ApiError(404, "Attendance not found.");
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await attendanceRepository.updateAttendance(
            connection,
            attendanceId,
            attendanceData
        );

        await connection.commit();

        return {
            message: "Attendance updated successfully."
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};

exports.deleteAttendance = async (attendanceId) => {

    const attendance =
        await attendanceRepository.getAttendanceById(attendanceId);

    if (attendance.length === 0) {
        throw new ApiError(404, "Attendance not found.");
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await attendanceRepository.deleteAttendance(
            connection,
            attendanceId
        );

        await connection.commit();

        return {
            message: "Attendance deleted successfully."
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }
};


exports.bulkAttendance = async (attendanceData, userId) => {

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const result = await attendanceRepository.bulkAttendance(
            connection,
            attendanceData,
            userId
        );

        await connection.commit();

        return {
            message: "Attendance saved successfully.",
            ...result
        };

    } catch (error) {

        await connection.rollback();
        throw error;

    } finally {

        connection.release();

    }

};