const attendanceService = require("./attendance.service");

exports.createAttendance = async (req, res) => {

    const attendance = await attendanceService.createAttendance(req.body);

    res.status(201).json({
        success: true,
        data: attendance
    });

};

exports.getAllAttendance = async (req, res) => {

    const result = await attendanceService.getAllAttendance(req.query);

    res.status(200).json({
        success: true,
        count: result.data.length,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        data: result.data
    });

};

exports.getAttendanceById = async (req, res) => {

    const { attendanceId } = req.params;

    const attendance = await attendanceService.getAttendanceById(attendanceId);

    res.status(200).json({
        success: true,
        data: attendance
    });

};

exports.getAttendanceByStudent = async (req, res) => {

    const { studentId } = req.params;

    const attendance = await attendanceService.getAttendanceByStudent(studentId);

    res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance
    });

};

exports.getAttendanceByDate = async (req, res) => {

    const { attendanceDate } = req.params;

    const attendance = await attendanceService.getAttendanceByDate(attendanceDate);

    res.status(200).json({
        success: true,
        count: attendance.length,
        data: attendance
    });

};

exports.updateAttendance = async (req, res) => {

    const { attendanceId } = req.params;

    const result = await attendanceService.updateAttendance(
        attendanceId,
        req.body
    );

    res.status(200).json({
        success: true,
        data: result
    });

};

exports.deleteAttendance = async (req, res) => {

    const { attendanceId } = req.params;

    const result = await attendanceService.deleteAttendance(attendanceId);

    res.status(200).json({
        success: true,
        data: result
    });

};


exports.bulkAttendance = async (req, res) => {

    const result = await attendanceService.bulkAttendance(
        req.body,
        req.user?.id ?? null   // ✅ sahi field, aur safe fallback bhi
    );

    res.status(201).json({
        success: true,
        data: result
    });

};





