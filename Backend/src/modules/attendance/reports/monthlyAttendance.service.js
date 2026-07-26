const ApiError = require("../../../utils/ApiError");
const repository = require("./monthlyAttendance.repository");

exports.getMonthlyAttendance = async (studentId, month, year) => {
  const report = await repository.getMonthlyAttendance(studentId, month, year);

  if (report.length === 0) {
    throw new ApiError(404, "Attendance report not found.");
  }

  const data = report[0];

  const percentage =
    data.working_days > 0
      ? Number(((data.present / data.working_days) * 100).toFixed(2))
      : 0;

  return {
    ...data,
    attendance_percentage: percentage,
  };
};

exports.getStudentMonthlyAttendance = async (studentId, month, year) => {
  const report = await repository.getStudentMonthlyAttendance(
    studentId,
    month,
    year,
  );

  if (!report.length) {
    throw new ApiError(404, "Attendance report not found.");
  }

  return report[0];
};

exports.getClassMonthlyAttendance = async (query) => {
  const report = await repository.getClassMonthlyAttendance(query);

  return report;
};

exports.getAttendanceDashboard = async (classId, sectionId, month, year) => {
  const dashboard = await repository.getAttendanceDashboard(
    classId,
    sectionId,
    month,
    year,
  );

  return dashboard;
};

exports.getAttendanceCalendar = async (studentId, month, year) => {
  const rows = await repository.getAttendanceCalendar(studentId, month, year);

  return rows;
};

exports.getLowAttendanceStudents = async (query) => {

    const report =
        await repository.getLowAttendanceStudents(query);

    return report;

};

exports.getYearlyAttendance = async (
    studentId,
    year
) => {

    const rows = await repository.getYearlyAttendance(
        studentId,
        year
    );

    const months = [
        "",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    return rows.map(row => ({
        ...row,
        month_name: months[row.month_no]
    }));

};

exports.getAttendanceRegister = async (query) => {

    return await repository.getAttendanceRegister(query);

};


exports.getAttendanceRegisterMatrix = async (query) => {

    const rows = await repository.getAttendanceRegisterMatrix(query);

    const daysInMonth = new Date(
        Number(query.year),
        Number(query.month),
        0
    ).getDate();

    const students = {};

    rows.forEach(row => {

        if (!students[row.student_id]) {

            const attendance = {};

            for (let i = 1; i <= daysInMonth; i++) {
                attendance[i] = "-";
            }

            students[row.student_id] = {

                student_id: row.student_id,

                roll_no: row.roll_no,

                admission_no: row.admission_no,

                student_name: row.student_name,

                attendance,

                present: 0,

                absent: 0,

                leave: 0,

                late: 0,

                half_day: 0,

                percentage: 0

            };

        }

        if (row.attendance_day) {

            let code = "-";

            switch (row.status) {

                case "Present":
                    code = "P";
                    students[row.student_id].present++;
                    break;

                case "Absent":
                    code = "A";
                    students[row.student_id].absent++;
                    break;

                case "Leave":
                    code = "L";
                    students[row.student_id].leave++;
                    break;

                case "Late":
                    code = "LT";
                    students[row.student_id].late++;
                    break;

                case "Half Day":
                    code = "HD";
                    students[row.student_id].half_day++;
                    break;

                case "Holiday":
                    code = "H";
                    break;

            }

            students[row.student_id].attendance[row.attendance_day] = code;

        }

    });

    const data = Object.values(students);

    data.forEach(student => {

        const workingDays =
            student.present +
            student.absent +
            student.leave +
            student.late +
            student.half_day;

        student.working_days = workingDays;

        student.percentage =
            workingDays > 0
                ? Number(
                      (
                          (student.present / workingDays) *
                          100
                      ).toFixed(2)
                  )
                : 0;

    });

    return {

        month: Number(query.month),

        year: Number(query.year),

        days: daysInMonth,

        count: data.length,

        data

    };

};

exports.getAttendanceAnalytics = async (query) => {

    return await repository.getAttendanceAnalytics(query);

};