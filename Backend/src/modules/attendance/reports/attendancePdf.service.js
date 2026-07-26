const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const repository = require("./monthlyAttendance.repository");

exports.exportMonthlyAttendancePdf = async (query) => {

    const rows =
        await repository.getAttendanceRegisterMatrix(query);

    const students = {};

    rows.forEach(row => {

        if (!students[row.student_id]) {

            students[row.student_id] = {

                student_id: row.student_id,

                roll_no: row.roll_no,

                admission_no: row.admission_no,

                student_name: row.student_name,

                attendance: {},

                present: 0,

                absent: 0,

                leave: 0,

                late: 0,

                half_day: 0

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

            }

            students[row.student_id]
                .attendance[row.attendance_day] = code;

        }

    });

    const report = Object.values(students);

    report.forEach(student => {

        const workingDays =

            student.present +

            student.absent +

            student.leave +

            student.late +

            student.half_day;

        student.attendance_percentage =

            workingDays === 0

                ? 0

                : Number(

                    (

                        student.present *

                        100 /

                        workingDays

                    ).toFixed(2)

                );

    });

    const totalDays = new Date(

        Number(query.year),

        Number(query.month),

        0

    ).getDate();

    const exportDir = path.join(

        process.cwd(),

        "exports"

    );

    if (!fs.existsSync(exportDir)) {

        fs.mkdirSync(exportDir, {

            recursive: true

        });

    }

    const fileName =

        `Attendance_${query.month}_${query.year}_${Date.now()}.pdf`;

    const filePath = path.join(

        exportDir,

        fileName

    );

    const doc = new PDFDocument({

        size: "A4",

        layout: "landscape",

        margin: 20,

        bufferPages: true

    });

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // ===========================
    // SCHOOL HEADER
    // ===========================

    doc

        .font("Helvetica-Bold")

        .fontSize(20)

        .text(

            "ROYAL URDU HIGH SCHOOL",

            {

                align: "center"

            }

        );

    doc.moveDown(0.3);

    doc

        .fontSize(14)

        .text(

            "MONTHLY ATTENDANCE REGISTER",

            {

                align: "center"

            }

        );

    doc.moveDown();

    doc

        .font("Helvetica")

        .fontSize(10);

    doc.text(

        `Class : ${query.class_id}`,

        20,

        85

    );

    doc.text(

        `Section : ${query.section_id}`,

        140,

        85

    );

    doc.text(

        `Month : ${query.month}/${query.year}`,

        280,

        85

    );

    doc.text(

        `Generated : ${new Date().toLocaleString()}`,

        520,

        85

    );

    let startY = 120;

    let startX = 20;

    const rowHeight = 20;

    const rollWidth = 35;

    const admissionWidth = 60;

    const studentWidth = 150;

    const dayWidth = 14;

    const summaryWidth = 22;

    // ===========================
    // TABLE HEADER
    // ===========================

    doc

        .font("Helvetica-Bold")

        .fontSize(8);

    let x = startX;

    doc.text("Roll", x, startY, {

        width: rollWidth,

        align: "center"

    });

    x += rollWidth;

    doc.text("Adm", x, startY, {

        width: admissionWidth,

        align: "center"

    });

    x += admissionWidth;

    doc.text("Student", x, startY, {

        width: studentWidth,

        align: "left"

    });

    x += studentWidth;

    for (let day = 1; day <= totalDays; day++) {

        doc.text(

            String(day),

            x,

            startY,

            {

                width: dayWidth,

                align: "center"

            }

        );

        x += dayWidth;

    }

    [
        "P",
        "A",
        "L",
        "LT",
        "HD",
        "%"
    ].forEach(title => {

        doc.text(

            title,

            x,

            startY,

            {

                width: summaryWidth,

                align: "center"

            }

        );

        x += summaryWidth;

    });

    // ======== PART 2 STARTS FROM HERE ========

        // ===========================
    // STUDENT ROWS
    // ===========================

    doc.font("Helvetica").fontSize(7);

    let y = startY + rowHeight;

    report.forEach((student, index) => {

        // -----------------------
        // Auto Page Break
        // -----------------------

        if (y > 520) {

            doc.addPage();

            y = 40;

            x = startX;

            doc.font("Helvetica-Bold").fontSize(8);

            doc.text("Roll", x, y, {
                width: rollWidth,
                align: "center"
            });

            x += rollWidth;

            doc.text("Adm", x, y, {
                width: admissionWidth,
                align: "center"
            });

            x += admissionWidth;

            doc.text("Student", x, y, {
                width: studentWidth
            });

            x += studentWidth;

            for (let day = 1; day <= totalDays; day++) {

                doc.text(day.toString(), x, y, {
                    width: dayWidth,
                    align: "center"
                });

                x += dayWidth;

            }

            ["P","A","L","LT","HD","%"].forEach(h => {

                doc.text(h, x, y, {
                    width: summaryWidth,
                    align: "center"
                });

                x += summaryWidth;

            });

            y += rowHeight;

            doc.font("Helvetica").fontSize(7);

        }

        //----------------------------------

        let currentX = startX;

        doc.text(
            student.roll_no || "",
            currentX,
            y,
            {
                width: rollWidth,
                align:"center"
            }
        );

        currentX += rollWidth;

        doc.text(
            student.admission_no || "",
            currentX,
            y,
            {
                width: admissionWidth,
                align:"center"
            }
        );

        currentX += admissionWidth;

        doc.text(
            student.student_name,
            currentX,
            y,
            {
                width: studentWidth
            }
        );

        currentX += studentWidth;

        // =========================
        // Attendance Days
        // =========================

        for(let day=1; day<=totalDays; day++){

            let status =
                student.attendance[day] || "-";

            doc.text(

                status,

                currentX,

                y,

                {

                    width:dayWidth,

                    align:"center"

                }

            );

            currentX += dayWidth;

        }

        // ===========================
        // Summary Columns
        // ===========================

        doc.text(

            student.present,

            currentX,

            y,

            {

                width:summaryWidth,

                align:"center"

            }

        );

        currentX += summaryWidth;

        doc.text(

            student.absent,

            currentX,

            y,

            {

                width:summaryWidth,

                align:"center"

            }

        );

        currentX += summaryWidth;

        doc.text(

            student.leave,

            currentX,

            y,

            {

                width:summaryWidth,

                align:"center"

            }

        );

        currentX += summaryWidth;

        doc.text(

            student.late,

            currentX,

            y,

            {

                width:summaryWidth,

                align:"center"

            }

        );

        currentX += summaryWidth;

        doc.text(

            student.half_day,

            currentX,

            y,

            {

                width:summaryWidth,

                align:"center"

            }

        );

        currentX += summaryWidth;

        doc.text(

            student.attendance_percentage + "%",

            currentX,

            y,

            {

                width:summaryWidth + 8,

                align:"center"

            }

        );

        // ===================================
        // Row Border
        // ===================================

        doc.moveTo(
            startX,
            y + 15
        )
        .lineTo(
            810,
            y + 15
        )
        .stroke();

        y += rowHeight;

    });

    // =====================================
    // Summary
    // =====================================

    const totalStudents = report.length;

    const totalPresent =
        report.reduce((a,b)=>a+b.present,0);

    const totalAbsent =
        report.reduce((a,b)=>a+b.absent,0);

    const totalLeave =
        report.reduce((a,b)=>a+b.leave,0);

    const totalLate =
        report.reduce((a,b)=>a+b.late,0);

    const totalHalfDay =
        report.reduce((a,b)=>a+b.half_day,0);

    doc.moveDown(2);

    y += 20;

    doc.fontSize(10);

    doc.font("Helvetica-Bold");

    doc.text(
        `Total Students : ${totalStudents}`,
        20,
        y
    );

    doc.text(
        `Present : ${totalPresent}`,
        180,
        y
    );

    doc.text(
        `Absent : ${totalAbsent}`,
        300,
        y
    );

    doc.text(
        `Leave : ${totalLeave}`,
        420,
        y
    );

    doc.text(
        `Late : ${totalLate}`,
        540,
        y
    );

    doc.text(
        `Half Day : ${totalHalfDay}`,
        650,
        y
    );

    // ========= PART 3 =========

        // =====================================
    // Overall Attendance %
    // =====================================

    const totalWorking =
        totalPresent +
        totalAbsent +
        totalLeave +
        totalLate +
        totalHalfDay;

    const overallPercentage =
        totalWorking === 0
            ? 0
            : (
                (totalPresent * 100) /
                totalWorking
            ).toFixed(2);

    y += 25;

    doc.fontSize(11);

    doc.text(
        `Overall Attendance : ${overallPercentage}%`,
        20,
        y
    );

    // =====================================
    // Legend
    // =====================================

    y += 35;

    doc.fontSize(9);

    doc.font("Helvetica");

    doc.text(
        "Legend :  P = Present   A = Absent   L = Leave   LT = Late   HD = Half Day",
        20,
        y
    );

    // =====================================
    // Signature
    // =====================================

    y += 70;

    doc.moveTo(80, y)
       .lineTo(220, y)
       .stroke();

    doc.moveTo(560, y)
       .lineTo(720, y)
       .stroke();

    doc.fontSize(10);

    doc.text(
        "Class Teacher",
        95,
        y + 5
    );

    doc.text(
        "Principal",
        610,
        y + 5
    );

    // =====================================
    // Footer
    // =====================================

    const range = doc.bufferedPageRange();

    for (
        let i = range.start;
        i < range.start + range.count;
        i++
    ) {

        doc.switchToPage(i);

        doc.fontSize(8);

        doc.text(

            `Generated On : ${new Date().toLocaleString()}`,

            20,

            575

        );

        doc.text(

            `Page ${i + 1} of ${range.count}`,

            730,

            575,

            {

                align: "right"

            }

        );

    }

    // =====================================
    // Finish PDF
    // =====================================

    doc.end();

    return new Promise((resolve, reject) => {

        stream.on("finish", () => {

            resolve({

                fileName,

                filePath

            });

        });

        stream.on("error", reject);

    });

};