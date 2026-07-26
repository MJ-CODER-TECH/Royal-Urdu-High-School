const service = require("./monthlyAttendance.service");
const excelService = require("./attendanceExcel.service");
const pdfService = require('./attendancePdf.service');


exports.getMonthlyAttendance = async (req, res) => {
  const { student_id, month, year } = req.query;

  const data = await service.getMonthlyAttendance(student_id, month, year);

  res.status(200).json({
    success: true,
    data,
  });
};

exports.getStudentMonthlyAttendance = async (req, res) => {
  const { student_id, month, year } = req.query;

  const data = await service.getStudentMonthlyAttendance(
    student_id,
    month,
    year,
  );

  res.status(200).json({
    success: true,
    data,
  });
};

exports.getClassMonthlyAttendance = async (req, res) => {
  const data = await service.getClassMonthlyAttendance(req.query);

  res.status(200).json({
    success: true,
    ...data,
  });
};

exports.getAttendanceDashboard = async (req, res) => {
  const { class_id, section_id, month, year } = req.query;

  const data = await service.getAttendanceDashboard(
    class_id,
    section_id,
    month,
    year,
  );

  res.status(200).json({
    success: true,
    data,
  });
};

exports.getAttendanceCalendar = async (req, res) => {
  const { student_id, month, year } = req.query;

  const data = await service.getAttendanceCalendar(student_id, month, year);

  res.status(200).json({
    success: true,
    count: data.length,
    data,
  });
};

exports.getLowAttendanceStudents = async (req, res) => {

    const data = await service.getLowAttendanceStudents(req.query);

    res.status(200).json({
        success: true,
        count: data.count,
        ...data
    });

};

exports.getYearlyAttendance = async (req, res) => {

    const { student_id, year } = req.query;

    const data = await service.getYearlyAttendance(
        student_id,
        year
    );

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });

};

exports.exportMonthlyAttendancePdf = async (req, res) => {

    const result = await pdfService.exportMonthlyAttendancePdf(req.query);

    return res.download(
        result.filePath,
        result.fileName
    );

};

exports.getAttendanceRegister = async (req, res) => {

    const data = await service.getAttendanceRegister(req.query);

    res.status(200).json({
        success: true,
        count: data.length,
        data
    });

};

exports.getAttendanceRegisterMatrix = async (req, res) => {

    const data = await service.getAttendanceRegisterMatrix(req.query);

    res.status(200).json({
        success: true,
        ...data
    });

};

exports.getAttendanceAnalytics = async (req, res) => {

    const data = await service.getAttendanceAnalytics(req.query);

    res.status(200).json({
        success: true,
        data
    });

};


exports.exportMonthlyAttendanceExcel = async (req, res) => {

    const filePath = await excelService.exportMonthlyAttendanceExcel(req.query);

    return res.download(filePath);

};