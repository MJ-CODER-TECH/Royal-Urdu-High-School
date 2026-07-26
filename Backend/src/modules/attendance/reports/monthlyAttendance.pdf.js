const PDFDocument = require("pdfkit");

module.exports = (res, data, month, year) => {

    const doc = new PDFDocument({
        margin: 50,
        size: "A4"
    });

    res.setHeader(
        "Content-Type",
        "application/pdf"
    );

    res.setHeader(
        "Content-Disposition",
        `inline; filename=Attendance_${data.admission_no}_${month}_${year}.pdf`
    );

    doc.pipe(res);

    doc
        .fontSize(20)
        .text("ROYAL URDU HIGH SCHOOL", {
            align: "center"
        });

    doc.moveDown();

    doc
        .fontSize(16)
        .text("MONTHLY ATTENDANCE REPORT", {
            align: "center"
        });

    doc.moveDown(2);

    doc.fontSize(12);

    doc.text(`Student : ${data.student_name}`);
    doc.text(`Admission No : ${data.admission_no}`);
    doc.text(`Roll No : ${data.roll_no}`);
    doc.text(`Class : ${data.class_name}`);
    doc.text(`Section : ${data.section_name}`);

    doc.moveDown();

    doc.text(`Working Days : ${data.working_days}`);
    doc.text(`Present : ${data.present}`);
    doc.text(`Absent : ${data.absent}`);
    doc.text(`Leave : ${data.leave_count}`);
    doc.text(`Late : ${data.late}`);
    doc.text(`Half Day : ${data.half_day}`);

    doc.moveDown();

    doc
        .fontSize(14)
        .text(
            `Attendance Percentage : ${data.attendance_percentage}%`
        );

    doc.moveDown(3);

    doc.text("Principal Signature", 60);

    doc.text(
        "Class Teacher Signature",
        350
    );

    doc.end();

};