const ExcelJS = require("exceljs");
const fs = require("fs");
const path = require("path");

const repository = require("./monthlyAttendance.repository");

exports.exportMonthlyAttendanceExcel = async (query) => {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "Royal Urdu High School";

    workbook.company = "Royal Urdu High School";

    workbook.subject = "Monthly Attendance Register";

    workbook.title = "Attendance Register";

    workbook.created = new Date();

    const sheet = workbook.addWorksheet("Attendance");

    // =====================================
    // Heading
    // =====================================

    sheet.mergeCells("A1:AJ1");

    sheet.getCell("A1").value =
        "ROYAL URDU HIGH SCHOOL";

    sheet.getCell("A1").font = {

        bold: true,

        size: 18

    };

    sheet.getCell("A1").alignment = {

        horizontal: "center"

    };

    sheet.mergeCells("A2:AJ2");

    sheet.getCell("A2").value =
        `Attendance Register (${query.month}/${query.year})`;

    sheet.getCell("A2").font = {

        bold: true,

        size: 14

    };

    sheet.getCell("A2").alignment = {

        horizontal: "center"

    };

    // =====================================
    // Header
    // =====================================

    const totalDays = new Date(
    Number(query.year),
    Number(query.month),
    0
).getDate();

  const header = [
    "Roll",
    "Admission",
    "Student"
];

for (let i = 1; i <= totalDays; i++) {
    header.push(i.toString());
}



header.push("Present");
header.push("Absent");
header.push("Leave");
header.push("Late");
header.push("Half Day");
header.push("%");

    sheet.addRow(header);

    sheet.getRow(3).font = {

        bold: true

    };

    sheet.getRow(3).alignment = {

        horizontal: "center",

        vertical: "middle"

    };

    sheet.getRow(3).eachCell(cell => {

        cell.border = {

            top: { style: "thin" },

            left: { style: "thin" },

            bottom: { style: "thin" },

            right: { style: "thin" }

        };

    });

    // =====================================
    // Fetch Data
    // =====================================

    const rows =
        await repository.getAttendanceRegisterMatrix(query);

    const students = {};

    rows.forEach(row => {

        if (!students[row.student_id]) {

            students[row.student_id] = {

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

    const report = {

        data: Object.values(students)

    };

    report.data.forEach(student => {

        const workingDays =

            student.present +

            student.absent +

            student.leave +

            student.late +

            student.half_day;

        student.percentage =

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
// =====================================
// Fill Student Rows
// =====================================

report.data.forEach(student => {

    const row = [

        student.roll_no,

        student.admission_no,

        student.student_name

    ];

  for (let day = 1; day <= totalDays; day++) {
    row.push(student.attendance[day] || "-");
}

    row.push(student.present);

    row.push(student.absent);

    row.push(student.leave);

    row.push(student.late);

    row.push(student.half_day);

    row.push(student.percentage);

    sheet.addRow(row);

});


// =====================================
// Style Data Rows
// =====================================

sheet.eachRow((row, rowNumber) => {

    if (rowNumber >= 4) {

        row.alignment = {

            horizontal: "center",

            vertical: "middle"

        };

        row.eachCell(cell => {

            cell.border = {

                top: { style: "thin" },

                left: { style: "thin" },

                bottom: { style: "thin" },

                right: { style: "thin" }

            };

        });

    }

});


// =====================================
// Attendance Color Coding
// =====================================

sheet.eachRow((row, rowNumber) => {

    if (rowNumber < 4) return;

    for (let c = 4; c <= 34; c++) {

        const cell = row.getCell(c);

        switch (cell.value) {

            case "P":

                cell.fill = {

                    type: "pattern",

                    pattern: "solid",

                    fgColor: { argb: "C6EFCE" }

                };

                break;

            case "A":

                cell.fill = {

                    type: "pattern",

                    pattern: "solid",

                    fgColor: { argb: "FFC7CE" }

                };

                break;

            case "L":

                cell.fill = {

                    type: "pattern",

                    pattern: "solid",

                    fgColor: { argb: "FFF2CC" }

                };

                break;

            case "LT":

                cell.fill = {

                    type: "pattern",

                    pattern: "solid",

                    fgColor: { argb: "BDD7EE" }

                };

                break;

            case "HD":

                cell.fill = {

                    type: "pattern",

                    pattern: "solid",

                    fgColor: { argb: "D9EAD3" }

                };

                break;

        }

    }

});


// =====================================
// Auto Width
// =====================================

sheet.columns.forEach(column => {

    let maxLength = 15;

    column.eachCell({ includeEmpty: true }, cell => {

        const length = cell.value
            ? cell.value.toString().length
            : 10;

        if (length > maxLength) {

            maxLength = length;

        }

    });

    column.width = maxLength + 2;

});


// =====================================
// Freeze Header
// =====================================

sheet.views = [

    {

        state: "frozen",

        ySplit: 3

    }

];


// =====================================
// Auto Filter
// =====================================

sheet.autoFilter = {

    from: "A3",

    to: "AJ3"

};


// ===== PART 3 STARTS HERE =====

// =====================================
// Page Setup
// =====================================

sheet.pageSetup = {

    paperSize: 9,          // A4

    orientation: "landscape",

    fitToPage: true,

    fitToWidth: 1,

    fitToHeight: 0,

    horizontalCentered: true,

    verticalCentered: false,

    margins: {

        left: 0.3,

        right: 0.3,

        top: 0.5,

        bottom: 0.5,

        header: 0.3,

        footer: 0.3

    }

};


// =====================================
// Footer
// =====================================

const lastRow = sheet.lastRow.number + 3;

sheet.getCell(`A${lastRow}`).value =
"Class Teacher";

sheet.getCell(`J${lastRow}`).value =
"Principal";

sheet.getCell(`A${lastRow}`).font = {

    bold: true

};

sheet.getCell(`J${lastRow}`).font = {

    bold: true

};


// =====================================
// Header Style
// =====================================

sheet.getRow(3).fill = {

    type: "pattern",

    pattern: "solid",

    fgColor: {

        argb: "4472C4"

    }

};

sheet.getRow(3).font = {

    bold: true,

    color: {

        argb: "FFFFFF"

    }

};


// =====================================
// Percentage Color
// =====================================

for (let i = 4; i <= sheet.lastRow.number - 3; i++) {

    const cell = sheet.getCell(`AJ${i}`);

    const value = Number(cell.value);

    if (value >= 75) {

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "C6EFCE"

            }

        };

    }

    else if (value >= 50) {

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "FFF2CC"

            }

        };

    }

    else {

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "FFC7CE"

            }

        };

    }

}


// =====================================
// Create Export Folder
// =====================================

const exportDir = path.join(

    process.cwd(),

    "exports"

);

if (!fs.existsSync(exportDir)) {

    fs.mkdirSync(exportDir, {

        recursive: true

    });

}


// =====================================
// File Name
// =====================================

const fileName =

`Attendance_Register_${query.month}_${query.year}_${Date.now()}.xlsx`;

const filePath = path.join(

    exportDir,

    fileName

);

for (let day = 1; day <= totalDays; day++) {

    const date = new Date(
        query.year,
        query.month - 1,
        day
    );

    if (date.getDay() === 0) {

        const cell = sheet.getCell(3, day + 3);

        cell.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "F4CCCC"

            }

        };

    }

}


// =====================================
// Save Excel
// =====================================

await workbook.xlsx.writeFile(filePath);


// =====================================
// Return
// =====================================

return filePath;

};
