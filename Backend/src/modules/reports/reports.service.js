const repository = require("./reports.repository");

/*
|--------------------------------------------------------------------------
| STUDENT REPORT
|--------------------------------------------------------------------------
*/

exports.getStudentReport = async (filters) => {

    return await repository.getStudentReport(filters);

};

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

exports.getAttendanceReport = async (filters) => {

    return await repository.getAttendanceReport(filters);

};

/*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

exports.getFeeReport = async (filters) => {

    return await repository.getFeeReport(filters);

};

/*
|--------------------------------------------------------------------------
| PRINT FEE REPORT
|--------------------------------------------------------------------------
*/

exports.printFeeReport = async (filters) => {

    return await repository.printFeeReport(filters);

};


/*
|--------------------------------------------------------------------------
| PDF DOWNLOAD FEE
|--------------------------------------------------------------------------
*/

exports.exportFeePdf = async (filters) => {

    return await repository.exportFeePdf(filters);

};


/*
|--------------------------------------------------------------------------
| EXCEL DOWNLOAD FEE
|--------------------------------------------------------------------------
*/

exports.exportFeeExcel = async (filters) => {

    return await repository.exportFeeExcel(filters);

};


/*
|--------------------------------------------------------------------------
| EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.getExamReport = async (filters) => {

    return await repository.getExamReport(filters);

};



/*
|--------------------------------------------------------------------------
| PRINT EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.printExamReport = async (filters) => {

    return await repository.printExamReport(filters);

};



/*
|--------------------------------------------------------------------------
| PDF DOWNLOAD EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.exportExamPdf = async (filters) => {

    return await repository.exportExamPdf(filters);

};



/*
|--------------------------------------------------------------------------
| EXCEL DOWNLOAD EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.exportExamExcel = async (filters) => {

    return await repository.exportExamExcel(filters);

};

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

exports.getTimetableReport = async (filters) => {
    return await repository.getTimetableReport(filters);
};

exports.printTimetableReport = async (filters) => {
    return await repository.printTimetableReport(filters);
};

exports.exportTimetablePdf = async (filters) => {
    return await repository.exportTimetablePdf(filters);
};

exports.exportTimetableExcel = async (filters) => {
    return await repository.exportTimetableExcel(filters);
};

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

exports.getCertificateReport = async (filters) => {

    return await repository.getCertificateReport(filters);

};


/*
|--------------------------------------------------------------------------
| PRINT CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

exports.printCertificateReport = async (filters) => {

    return await repository.printCertificateReport(filters);

};


/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE PDF
|--------------------------------------------------------------------------
*/

exports.exportCertificatePdf = async (filters) => {

    return await repository.exportCertificatePdf(filters);

};


/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportCertificateExcel = async (filters) => {

    return await repository.exportCertificateExcel(filters);

};


/*
|--------------------------------------------------------------------------
| PRINT REPORT Student
|--------------------------------------------------------------------------
*/

exports.printStudentReport = async (filters) => {
    return await repository.printStudentReport(filters);
};


/*
|--------------------------------------------------------------------------
| PDF Download  Student
|--------------------------------------------------------------------------
*/

exports.exportStudentPdf = async (filters) => {

    return await repository.exportStudentPdf(filters);

};

/*
|--------------------------------------------------------------------------
| Exel Sheet  Student
|--------------------------------------------------------------------------
*/
exports.exportStudentExcel = async(filters)=>{

    return await repository.exportStudentExcel(filters);

};



/*
|--------------------------------------------------------------------------
| PRINT Attendance
|--------------------------------------------------------------------------
*/

exports.printAttendanceReport = async (filters) => {

    return await repository.printAttendanceReport(filters);

};


/*
|--------------------------------------------------------------------------
| PDF Download Attendance
|--------------------------------------------------------------------------
*/

exports.exportAttendancePdf = async (filters) => {

    return await repository.exportAttendancePdf(filters);

};


/*
|--------------------------------------------------------------------------
| Excel Download Attendance
|--------------------------------------------------------------------------
*/

exports.exportAttendanceExcel = async (filters) => {

    return await repository.exportAttendanceExcel(filters);

};