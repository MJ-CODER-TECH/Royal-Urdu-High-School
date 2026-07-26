const reportsService = require("./reports.service");

/*
|--------------------------------------------------------------------------
| STUDENT REPORT
|--------------------------------------------------------------------------
*/

exports.getStudentReport = async (req, res, next) => {
    try {

        const data = await reportsService.getStudentReport(req.query);

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| STUDENT REPORT - PRINT
|--------------------------------------------------------------------------
*/

exports.printStudentReport = async (req, res, next) => {

    try{

        const html =
            await reportsService.printStudentReport(req.query);

        res.send(html);

    }catch(error){

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| STUDENT REPORT - PDF
|--------------------------------------------------------------------------
*/

exports.exportStudentPdf = async (req, res, next) => {

    try {

        const pdf = await reportsService.exportStudentPdf(req.query);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="student-report.pdf"'
        );

        return res.send(pdf);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| STUDENT REPORT - EXCEL
|--------------------------------------------------------------------------
*/

exports.exportStudentExcel = async (req,res,next)=>{

    try{

        const excel =
            await reportsService.exportStudentExcel(
                req.query
            );


        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            'attachment; filename="student-report.xlsx"'
        );


        return res.send(excel);


    }catch(error){

        next(error);

    }

};
/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

exports.getAttendanceReport = async (req, res, next) => {
    try {

        const data = await reportsService.getAttendanceReport(req.query);

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        next(error);
    }
};

/*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

exports.getFeeReport = async (req, res, next) => {

    try {

        const data = await reportsService.getFeeReport(req.query);

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| PRINT FEE REPORT
|--------------------------------------------------------------------------
*/

exports.printFeeReport = async (req, res, next) => {

    try {

        const html = await reportsService.printFeeReport(req.query);

        res.send(html);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| EXPORT FEE PDF
|--------------------------------------------------------------------------
*/

exports.exportFeePdf = async (req, res, next) => {

    try {

        const pdf = await reportsService.exportFeePdf(req.query);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=fee-report.pdf"
        );

        res.send(pdf);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| EXPORT FEE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportFeeExcel = async (req, res, next) => {

    try {

        const buffer = await reportsService.exportFeeExcel(req.query);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=fee-report.xlsx"
        );

        res.send(buffer);

    } catch (error) {

        next(error);

    }

};
/*
|--------------------------------------------------------------------------
| EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.getExamReport = async (req, res, next) => {

    try {


        const data =
            await reportsService.getExamReport(
                req.query
            );



        return res.status(200).json({

            success:true,

            data

        });



    } catch(error){

        next(error);

    }

};





/*
|--------------------------------------------------------------------------
| PRINT EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.printExamReport = async (req, res, next) => {

    try {


        const html =
            await reportsService.printExamReport(
                req.query
            );



        res.setHeader(
            "Content-Type",
            "text/html"
        );


        return res.send(html);



    } catch(error){

        next(error);

    }

};





/*
|--------------------------------------------------------------------------
| EXPORT EXAM PDF
|--------------------------------------------------------------------------
*/

exports.exportExamPdf = async (req, res, next) => {

    try {


        const pdf =
            await reportsService.exportExamPdf(
                req.query
            );



        res.setHeader(
            "Content-Type",
            "application/pdf"
        );


        res.setHeader(
            "Content-Disposition",
            "attachment; filename=exam-report.pdf"
        );



        return res.send(pdf);



    } catch(error){

        next(error);

    }

};





/*
|--------------------------------------------------------------------------
| EXPORT EXAM EXCEL
|--------------------------------------------------------------------------
*/

exports.exportExamExcel = async (req, res, next) => {

    try {


        const excel =
            await reportsService.exportExamExcel(
                req.query
            );



        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );


        res.setHeader(
            "Content-Disposition",
            "attachment; filename=exam-report.xlsx"
        );



        return res.send(excel);



    } catch(error){

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

exports.getTimetableReport = async (req, res, next) => {

    try {

        const data = await reportsService.getTimetableReport(req.query);

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| PRINT TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

exports.printTimetableReport = async (req, res, next) => {

    try {

        const html = await reportsService.printTimetableReport(req.query);

        res.setHeader("Content-Type", "text/html");

        return res.send(html);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE PDF
|--------------------------------------------------------------------------
*/

exports.exportTimetablePdf = async (req, res, next) => {

    try {

        const pdf = await reportsService.exportTimetablePdf(req.query);

        res.setHeader("Content-Type", "application/pdf");

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="timetable-report.pdf"'
        );

        return res.send(pdf);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportTimetableExcel = async (req, res, next) => {

    try {

        const excel = await reportsService.exportTimetableExcel(req.query);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="timetable-report.xlsx"'
        );

        return res.send(excel);

    } catch (error) {

        next(error);

    }

};

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

exports.getCertificateReport = async (req, res, next) => {

    try {

        const data =
            await reportsService.getCertificateReport(
                req.query
            );

        return res.status(200).json({

            success: true,

            data,

        });

    } catch (error) {

        next(error);

    }

};



/*
|--------------------------------------------------------------------------
| PRINT CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

exports.printCertificateReport = async (req, res, next) => {

    try {

        const html =
            await reportsService.printCertificateReport(
                req.query
            );

        res.send(html);

    } catch (error) {

        next(error);

    }

};



/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE PDF
|--------------------------------------------------------------------------
*/

exports.exportCertificatePdf = async (req, res, next) => {

    try {

        const pdf =
            await reportsService.exportCertificatePdf(
                req.query
            );

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=certificate-report.pdf"
        );

        res.send(pdf);

    } catch (error) {

        next(error);

    }

};



/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportCertificateExcel = async (req, res, next) => {

    try {

        const buffer =
            await reportsService.exportCertificateExcel(
                req.query
            );

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=certificate-report.xlsx"
        );

        res.send(buffer);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT - PRINT
|--------------------------------------------------------------------------
*/

exports.printAttendanceReport = async (req, res, next) => {

    try {

        const html =
            await reportsService.printAttendanceReport(req.query);

        res.send(html);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT - PDF
|--------------------------------------------------------------------------
*/

exports.exportAttendancePdf = async (req, res, next) => {

    try {

        const pdf =
            await reportsService.exportAttendancePdf(req.query);

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="attendance-report.pdf"'
        );

        return res.send(pdf);

    } catch (error) {

        next(error);

    }

};


/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT - EXCEL
|--------------------------------------------------------------------------
*/

exports.exportAttendanceExcel = async (req, res, next) => {

    try {

        const excel =
            await reportsService.exportAttendanceExcel(req.query);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader(
            "Content-Disposition",
            'attachment; filename="attendance-report.xlsx"'
        );

        return res.send(excel);

    } catch (error) {

        next(error);

    }

};