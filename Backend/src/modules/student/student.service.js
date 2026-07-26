const pool = require("../../config/database");
const ApiError = require("../../utils/ApiError");
const studentRepository = require("./student.repository");
const whatsappService = require("../whatsapp/whatsapp.service");


exports.createStudent = async (studentData) => {

    const admission = await studentRepository.findByAdmissionNo(studentData.admission_no);

    if (admission.length > 0) {
        throw new ApiError(409, "Admission Number already exists.");
    }

    if (studentData.gr_no) {
        const gr = await studentRepository.findByGrNo(studentData.gr_no);

        if (gr.length > 0) {
            throw new ApiError(409, "GR Number already exists.");
        }
    }

    if (studentData.aadhaar) {
        const aadhaar = await studentRepository.findByAadhar(studentData.aadhaar);

        if (aadhaar.length > 0) {
            throw new ApiError(409, "Aadhaar already exists.");
        }
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        const result = await studentRepository.createStudent(
            connection,
            studentData
        );

        await studentRepository.createParent(
            connection,
            result.insertId,
            studentData
        );

        await studentRepository.createAddress(
            connection,
            result.insertId,
            studentData
        );

        await connection.commit();

        try {

            const student = await studentRepository.getStudentWhatsAppData(
                result.insertId
            );

            await whatsappService.sendAdmissionConfirmation(student);

        } catch (whatsappError) {

            console.error("WhatsApp confirmation failed:", whatsappError.message);
        }

        return {

            studentId: result.insertId,

            message: "Student Created Successfully"

        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


exports.getAllStudents = async () => {

    return await studentRepository.getAllStudents();

};


exports.getStudentById = async (studentId) => {

    const student = await studentRepository.getStudentById(studentId);

    if (student.length === 0) {
        throw new ApiError(404, "Student not found.");
    }

    return student[0];

};


exports.getStudents = async (query) => {

    const { rows, total, page, limit } =
        await studentRepository.getStudents(query);

    return {
        students: rows,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
    };

};


/*
|--------------------------------------------------------------------------
| Update Student  ✅ NEW — ye missing tha
|--------------------------------------------------------------------------
*/

exports.updateStudent = async (studentId, studentData) => {

    // Student exist karta hai ya nahi check karo
    const existing = await studentRepository.getStudentById(studentId);

    if (existing.length === 0) {
        throw new ApiError(404, "Student not found.");
    }

    // Admission No — agar change kiya ho toh dusre student se conflict check karo
    if (studentData.admission_no) {
        const conflict = await studentRepository.findByAdmissionNoForUpdate(
            studentData.admission_no,
            studentId
        );

        if (conflict.length > 0) {
            throw new ApiError(409, "Admission Number already exists.");
        }
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await studentRepository.updateStudent(
            connection,
            studentId,
            studentData
        );

        // parent aur address dono "ON DUPLICATE KEY UPDATE" wali queries hain,
        // isliye create aur update dono ke liye same function chalega
        await studentRepository.createParent(
            connection,
            studentId,
            studentData
        );

        await studentRepository.createAddress(
            connection,
            studentId,
            studentData
        );

        await connection.commit();

        return {
            message: "Student updated successfully."
        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


/*
|--------------------------------------------------------------------------
| Update Student Status  ✅ NEW
|--------------------------------------------------------------------------
*/

exports.updateStudentStatus = async (studentId, status) => {

    const student = await studentRepository.getStudentById(studentId);

    if (student.length === 0) {
        throw new ApiError(404, "Student not found.");
    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await connection.execute(
            `UPDATE student SET status = ?, updated_at = NOW() WHERE student_id = ?`,
            [status, studentId]
        );

        await connection.commit();

        return { message: "Student status updated successfully." };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


exports.deleteStudent = async (studentId) => {

    const student = await studentRepository.getStudentById(studentId);

    if (student.length === 0) {

        throw new ApiError(
            404,
            "Student not found."
        );

    }

    const connection = await pool.getConnection();

    try {

        await connection.beginTransaction();

        await studentRepository.deleteStudent(
            connection,
            studentId
        );

        await connection.commit();

        return {

            message: "Student deleted successfully."

        };

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};