const db = require("../../config/database");
const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");



/*
|--------------------------------------------------------------------------
| STUDENT REPORT
|--------------------------------------------------------------------------
*/

exports.getStudentReport = async (filters = {}) => {

    const values = [];

    let query = `
        SELECT

    s.student_id,
    s.admission_no,
    s.pen_number,
    s.gr_no,
    s.roll_no,

    s.first_name,
    s.middle_name,
    s.last_name,

    CONCAT_WS(
        ' ',
        s.first_name,
        s.middle_name,
        s.last_name
    ) AS student_name,

    s.gender,
    s.category,
    s.caste,
    s.mobile,
    s.admission_date,
    s.status,

    c.class_name,
    sec.section_name,

    ay.academic_year_id,
    ay.year_start,
    ay.year_end

        FROM student s

        LEFT JOIN class_master c
            ON c.class_id = s.class_id

        LEFT JOIN section_master sec
            ON sec.section_id = s.section_id

        LEFT JOIN academic_year ay
            ON ay.academic_year_id = s.academic_year_id

        WHERE 1 = 1
    `;

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    if (filters.academic_year_id) {

        query += ` AND s.academic_year_id = ?`;
        values.push(filters.academic_year_id);

    }

    if (filters.class_id) {

        query += ` AND s.class_id = ?`;
        values.push(filters.class_id);

    }

    if (filters.section_id) {

        query += ` AND s.section_id = ?`;
        values.push(filters.section_id);

    }

    if (filters.gender) {

        query += ` AND s.gender = ?`;
        values.push(filters.gender);

    }

    if (filters.category) {

        query += ` AND s.category = ?`;
        values.push(filters.category);

    }

    if (filters.status) {

        query += ` AND s.status = ?`;
        values.push(filters.status);

    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (filters.search) {

        const keyword = `%${filters.search}%`;

        query += `
            AND (
                s.admission_no LIKE ?
                OR s.gr_no LIKE ?
                OR s.roll_no LIKE ?
                OR s.first_name LIKE ?
                OR s.middle_name LIKE ?
                OR s.last_name LIKE ?
                OR s.mobile LIKE ?
            )
        `;

        values.push(
            keyword,
            keyword,
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        );

    }

    /*
    |--------------------------------------------------------------------------
    | ORDER BY
    |--------------------------------------------------------------------------
    */

    query += `
        ORDER BY
            ay.year_start DESC,
            c.class_name,
            sec.section_name,
            CAST(s.roll_no AS UNSIGNED),
            s.first_name
    `;

    const [rows] = await db.query(query, values);

    return rows;

};

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

exports.getAttendanceReport = async (filters = {}) => {

    const values = [];

    let query = `
        SELECT

            a.attendance_id,
            a.attendance_date,
            a.status,
            a.check_in,
            a.check_out,
            a.remarks,

            s.student_id,
            s.admission_no,
            s.roll_no,

            CONCAT_WS(
                ' ',
                s.first_name,
                s.middle_name,
                s.last_name
            ) AS student_name,

            c.class_name,
            sec.section_name,

            ay.academic_year_id,
            ay.year_start,
            ay.year_end

        FROM attendance a

        INNER JOIN student s
            ON s.student_id = a.student_id

        LEFT JOIN class_master c
            ON c.class_id = s.class_id

        LEFT JOIN section_master sec
            ON sec.section_id = s.section_id

        LEFT JOIN academic_year ay
            ON ay.academic_year_id = s.academic_year_id

        WHERE 1 = 1
    `;

    if (filters.academic_year_id) {

        query += ` AND s.academic_year_id = ?`;
        values.push(filters.academic_year_id);

    }

    if (filters.class_id) {

        query += ` AND s.class_id = ?`;
        values.push(filters.class_id);

    }

    if (filters.section_id) {

        query += ` AND s.section_id = ?`;
        values.push(filters.section_id);

    }

    if (filters.status) {

        query += ` AND a.status = ?`;
        values.push(filters.status);

    }

    if (filters.attendance_date) {

        query += ` AND a.attendance_date = ?`;
        values.push(filters.attendance_date);

    }

    if (filters.search) {

        const keyword = `%${filters.search}%`;

        query += `
            AND (
                s.admission_no LIKE ?
                OR s.roll_no LIKE ?
                OR s.first_name LIKE ?
                OR s.middle_name LIKE ?
                OR s.last_name LIKE ?
            )
        `;

        values.push(
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        );

    }

    query += `
        ORDER BY
            a.attendance_date DESC,
            c.class_name,
            sec.section_name,
            CAST(s.roll_no AS UNSIGNED)
    `;

    const [rows] = await db.query(query, values);

    return rows;

};;



/*
|--------------------------------------------------------------------------
| EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.getExamReport = async (filters = {}) => {


    const values = [];


    let query = `

    SELECT

        m.mark_id,

        s.student_id,
        s.admission_no,
        s.roll_no,

        CONCAT_WS(
            ' ',
            s.first_name,
            s.middle_name,
            s.last_name
        ) AS student_name,


        c.class_name,

        sec.section_name,


        ay.academic_year_id,
        ay.year_start,
        ay.year_end,


        e.exam_id,
        e.exam_name,
        e.exam_date,


        sub.subject_name,


        m.max_marks,

        m.obtained_marks,

        m.grade,

        m.remark,


        r.total_marks,

        r.obtained_marks AS result_obtained_marks,

        r.percentage,

        r.result_status,

        r.rank_no



    FROM marks m



    INNER JOIN student s

        ON s.student_id = m.student_id



    LEFT JOIN class_master c

        ON c.class_id = m.class_id



    LEFT JOIN section_master sec

        ON sec.section_id = m.section_id



    LEFT JOIN academic_year ay

        ON ay.academic_year_id = m.academic_year_id



    LEFT JOIN exams e

        ON e.exam_id = m.exam_id



    LEFT JOIN subjects sub

        ON sub.subject_id = m.subject_id



    LEFT JOIN results r

        ON r.student_id = m.student_id

        AND r.exam_id = m.exam_id



    WHERE 1=1

    `;



    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */


    if(filters.academic_year_id){

        query += `
        AND m.academic_year_id = ?
        `;

        values.push(
            filters.academic_year_id
        );

    }



    if(filters.class_id){

        query += `
        AND m.class_id = ?
        `;

        values.push(
            filters.class_id
        );

    }



    if(filters.section_id){

        query += `
        AND m.section_id = ?
        `;

        values.push(
            filters.section_id
        );

    }



    if(filters.exam_id){

        query += `
        AND m.exam_id = ?
        `;

        values.push(
            filters.exam_id
        );

    }



    if(filters.subject_id){

        query += `
        AND m.subject_id = ?
        `;

        values.push(
            filters.subject_id
        );

    }



    if(filters.status){

        query += `
        AND m.status = ?
        `;

        values.push(
            filters.status
        );

    }



    if(filters.search){


        const keyword =
            `%${filters.search}%`;



        query += `

        AND (

            s.admission_no LIKE ?

            OR s.roll_no LIKE ?

            OR s.first_name LIKE ?

            OR s.middle_name LIKE ?

            OR s.last_name LIKE ?

        )

        `;


        values.push(

            keyword,
            keyword,
            keyword,
            keyword,
            keyword

        );

    }



    query += `

    ORDER BY

        e.exam_date DESC,

        c.class_name,

        sec.section_name,

        CAST(s.roll_no AS UNSIGNED),

        s.first_name

    `;



    const [rows] =
        await db.query(
            query,
            values
        );



    return rows;


};



/*
|--------------------------------------------------------------------------
| PRINT EXAM REPORT
|--------------------------------------------------------------------------
*/

exports.printExamReport = async(filters)=>{


    const exams = await exports.getExamReport(filters);


    const academicYear = exams.length
        ?
        `${exams[0].year_start || ""}-${exams[0].year_end || ""}`
        :
        "";


    return `

<!DOCTYPE html>

<html>

<head>

<title>
Exam Report
</title>


<style>


*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}


body{

    padding:20px;
    color:#000;

}


.school-header{

    display:flex;
    justify-content:center;
    align-items:center;
    gap:20px;
    margin-bottom:15px;

}


.logo{

    width:80px;
    height:80px;
    object-fit:contain;

}


.school-name{

    text-align:center;

}


.school-name h1{

    font-size:26px;

}


.school-name h2{

    font-size:18px;

}



.report-info{

    border:1px solid #000;
    padding:10px;
    display:flex;
    justify-content:space-between;
    margin-bottom:15px;
    font-size:12px;

}



table{

    width:100%;
    border-collapse:collapse;
    font-size:11px;

}



th,td{

    border:1px solid #000;
    padding:6px;
    text-align:center;

}



thead{

    background:#eee;

}


.student-name{

    text-align:left;

}



.footer{

    margin-top:40px;
    display:flex;
    justify-content:space-between;

}


.footer div{

    width:180px;
    text-align:center;

}


@page{

    size:A4 landscape;
    margin:12mm;

}


</style>


</head>


<body>


<div class="school-header">


<img
src="http://localhost:5000/uploads/school/logo.png"
class="logo"
/>


<div class="school-name">

<h1>
ROYAL URDU HIGH SCHOOL
</h1>


<h2>
Exam Report
</h2>


</div>


</div>




<div class="report-info">


<div>
<strong>
Academic Year :
</strong>
${academicYear}
</div>



<div>
<strong>
Class :
</strong>
${filters.class_name || "All"}
</div>



<div>
<strong>
Section :
</strong>
${filters.section_name || "All"}
</div>



<div>
<strong>
Generated :
</strong>
${new Date().toLocaleDateString("en-GB")}
</div>



</div>




<h4>
Total Records : ${exams.length}
</h4>


<br>



<table>


<thead>


<tr>

<th>
Adm No
</th>

<th>
Roll No
</th>

<th>
Student Name
</th>

<th>
Class
</th>

<th>
Section
</th>

<th>
Exam
</th>

<th>
Subject
</th>

<th>
Max Marks
</th>

<th>
Obtained
</th>

<th>
Grade
</th>

<th>
Percentage
</th>

<th>
Status
</th>

<th>
Rank
</th>


</tr>


</thead>



<tbody>


${exams.map(item=>`


<tr>


<td>
${item.admission_no || ""}
</td>


<td>
${item.roll_no || ""}
</td>


<td class="student-name">
${item.student_name || ""}
</td>


<td>
${item.class_name || ""}
</td>


<td>
${item.section_name || ""}
</td>


<td>
${item.exam_name || ""}
</td>


<td>
${item.subject_name || ""}
</td>


<td>
${item.max_marks || ""}
</td>


<td>
${item.obtained_marks || ""}
</td>


<td>
${item.grade || ""}
</td>


<td>
${item.percentage || ""}
</td>


<td>
${item.result_status || ""}
</td>


<td>
${item.rank_no || ""}
</td>


</tr>


`).join("")}



</tbody>


</table>



<div class="footer">


<div>

<br><br>
<hr>
Prepared By

</div>


<div>

<br><br>
<hr>
Class Teacher

</div>


<div>

<br><br>
<hr>
Principal

</div>


</div>




<script>

window.onload=function(){

window.print();

}

</script>



</body>

</html>

`;

};







/*
|--------------------------------------------------------------------------
| EXPORT EXAM PDF
|--------------------------------------------------------------------------
*/

exports.exportExamPdf = async(filters)=>{


    const exams = await exports.getExamReport(filters);



    const doc = new PDFDocument({

        size:"A4",
        layout:"landscape",
        margin:20

    });



    const stream = new PassThrough();

    const buffers=[];


    doc.pipe(stream);


    stream.on(
        "data",
        chunk=>buffers.push(chunk)
    );



    const logoPath = path.join(
        __dirname,
        "../../../uploads/school/logo.png"
    );



    if(fs.existsSync(logoPath)){


        doc.image(
            logoPath,
            30,
            20,
            {
                width:60,
                height:60
            }
        );

    }



    doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(
        "ROYAL URDU HIGH SCHOOL",
        {
            align:"center"
        }
    );



    doc
    .fontSize(14)
    .font("Helvetica")
    .text(
        "Exam Report",
        {
            align:"center"
        }
    );



    doc.moveDown();



    doc
    .fontSize(10)
    .text(
        `Total Records : ${exams.length}`
    );


    let y=140;


    const cols=[

        {label:"Adm",width:45},
        {label:"Roll",width:40},
        {label:"Student",width:120},
        {label:"Class",width:50},
        {label:"Section",width:50},
        {label:"Exam",width:80},
        {label:"Subject",width:80},
        {label:"Max",width:45},
        {label:"Obt",width:45},
        {label:"Grade",width:45},
        {label:"%",width:50},
        {label:"Status",width:70},
        {label:"Rank",width:40},

    ];



    let x=25;



    doc.fontSize(8)
    .font("Helvetica-Bold");



    cols.forEach(col=>{


        doc.rect(
            x,
            y,
            col.width,
            20
        ).stroke();



        doc.text(
            col.label,
            x+2,
            y+6,
            {
                width:col.width-4,
                align:"center"
            }
        );


        x += col.width;


    });



    y+=20;



    doc.font("Helvetica")
    .fontSize(8);



    exams.forEach(item=>{


        x=25;


        const values=[

            item.admission_no || "",
            item.roll_no || "",
            item.student_name || "",
            item.class_name || "",
            item.section_name || "",
            item.exam_name || "",
            item.subject_name || "",
            item.max_marks || "",
            item.obtained_marks || "",
            item.grade || "",
            item.percentage || "",
            item.result_status || "",
            item.rank_no || ""

        ];



        values.forEach((value,index)=>{


            const width=cols[index].width;


            doc.rect(
                x,
                y,
                width,
                20
            ).stroke();



            doc.text(
                String(value),
                x+2,
                y+6,
                {
                    width:width-4,
                    align:"center"
                }
            );

            x+=width;


        });



        y+=20;



        if(y>520){

            doc.addPage();

            y=40;

        }


    });



    doc.end();



    return await new Promise(resolve=>{


        stream.on(
            "end",
            ()=>{

                resolve(
                    Buffer.concat(buffers)
                );

            }
        );


    });


};







/*
|--------------------------------------------------------------------------
| EXPORT EXAM EXCEL
|--------------------------------------------------------------------------
*/

exports.exportExamExcel = async(filters)=>{


    const exams = await exports.getExamReport(filters);



    const workbook = new ExcelJS.Workbook();



    const worksheet =
        workbook.addWorksheet(
            "Exam Report"
        );



    worksheet.columns=[


        {
            header:"Admission No",
            key:"admission_no",
            width:15
        },


        {
            header:"Roll No",
            key:"roll_no",
            width:12
        },


        {
            header:"Student Name",
            key:"student_name",
            width:25
        },


        {
            header:"Class",
            key:"class_name",
            width:12
        },


        {
            header:"Section",
            key:"section_name",
            width:12
        },


        {
            header:"Exam",
            key:"exam_name",
            width:20
        },


        {
            header:"Subject",
            key:"subject_name",
            width:20
        },


        {
            header:"Max Marks",
            key:"max_marks",
            width:12
        },


        {
            header:"Obtained Marks",
            key:"obtained_marks",
            width:15
        },


        {
            header:"Grade",
            key:"grade",
            width:10
        },


        {
            header:"Percentage",
            key:"percentage",
            width:12
        },


        {
            header:"Result Status",
            key:"result_status",
            width:15
        },


        {
            header:"Rank",
            key:"rank_no",
            width:10
        }


    ];




    exams.forEach(item=>{


        worksheet.addRow({


            admission_no:item.admission_no || "",

            roll_no:item.roll_no || "",

            student_name:item.student_name || "",

            class_name:item.class_name || "",

            section_name:item.section_name || "",

            exam_name:item.exam_name || "",

            subject_name:item.subject_name || "",

            max_marks:item.max_marks || "",

            obtained_marks:item.obtained_marks || "",

            grade:item.grade || "",

            percentage:item.percentage || "",

            result_status:item.result_status || "",

            rank_no:item.rank_no || ""

        });



    });



    worksheet.getRow(1).font={

        bold:true

    };



    return await workbook.xlsx.writeBuffer();


};
/*


/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

exports.getCertificateReport = async (filters = {}) => {

    const values = [];

    let query = `
        SELECT

            c.certificate_id,
            c.certificate_no,
            c.certificate_type,
            c.issue_date,
            c.generated_by,
            c.status,

            s.student_id,
            s.admission_no,

            CONCAT(
                s.first_name,
                ' ',
                IFNULL(s.middle_name,''),
                ' ',
                IFNULL(s.last_name,'')
            ) AS student_name,

            cm.class_name,
            sm.section_name

        FROM certificates c

        INNER JOIN student s
            ON s.student_id = c.student_id

        LEFT JOIN class_master cm
            ON cm.class_id = s.class_id

        LEFT JOIN section_master sm
            ON sm.section_id = s.section_id

        WHERE 1 = 1
    `;

    if (filters.academic_year_id) {
        query += ` AND s.academic_year_id = ?`;
        values.push(filters.academic_year_id);
    }

    if (filters.class_id) {
        query += ` AND s.class_id = ?`;
        values.push(filters.class_id);
    }

    if (filters.section_id) {
        query += ` AND s.section_id = ?`;
        values.push(filters.section_id);
    }

    if (filters.status) {
        query += ` AND c.status = ?`;
        values.push(filters.status);
    }

    if (filters.certificate_type) {
        query += ` AND c.certificate_type = ?`;
        values.push(filters.certificate_type);
    }

    if (filters.search) {

        query += `
            AND (
                s.admission_no LIKE ?
                OR CONCAT(
                    s.first_name,' ',
                    IFNULL(s.middle_name,''),' ',
                    IFNULL(s.last_name,'')
                ) LIKE ?
                OR c.certificate_no LIKE ?
            )
        `;

        const search = `%${filters.search}%`;

        values.push(search, search, search);
    }

    query += `
        ORDER BY c.issue_date DESC,
                 c.certificate_id DESC
    `;

    const [rows] = await db.query(query, values);

    return rows;
};



/*
|--------------------------------------------------------------------------
| PRINT CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

exports.printCertificateReport = async (filters) => {

    const certificates =
        await exports.getCertificateReport(filters);

    const totalRecords =
        certificates.length;

    const academicYear =
        certificates.length
            ?
            `${certificates[0].year_start || ""}-${certificates[0].year_end || ""}`
            :
            "";

    return `
<!DOCTYPE html>

<html>

<head>

<title>
Certificate Report
</title>

<style>

*{

    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;

}

body{

    padding:20px;
    color:#000;
    background:#fff;

}

.school-header{

    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;

    margin-bottom:15px;

}

.logo{

    width:80px;
    height:80px;

    object-fit:contain;

}

.school-name{

    text-align:center;

}

.school-name h1{

    font-size:26px;
    margin-bottom:5px;

}

.school-name h2{

    font-size:18px;

}

.report-info{

    border:1px solid #000;

    padding:10px;

    margin-bottom:10px;

    display:flex;

    justify-content:space-between;

    font-size:12px;

    flex-wrap:wrap;

}

.total{

    font-size:13px;

    font-weight:bold;

    margin-bottom:15px;

}

table{

    width:100%;

    border-collapse:collapse;

    font-size:11px;

}

thead{

    background:#efefef;

}

th{

    border:1px solid #000;

    padding:8px 6px;

    text-align:center;

    font-weight:bold;

}

td{

    border:1px solid #000;

    padding:6px;

    text-align:center;

    vertical-align:middle;

}

.student-name{

    text-align:left;

    padding-left:10px;

}

tbody tr:nth-child(even){

    background:#fafafa;

}

.footer{

    margin-top:40px;

    display:flex;

    justify-content:space-between;

}

.footer div{

    width:180px;

    text-align:center;

    font-size:12px;

}

.footer hr{

    border:none;

    border-top:1px solid #000;

    margin-bottom:6px;

}

@page{

    size:A4 landscape;

    margin:12mm;

}

@media print{

body{

    padding:0;

}

}

</style>

</head>

<body>

<div class="school-header">

<img
src="http://localhost:5000/uploads/school/logo.png"
class="logo"
/>

<div class="school-name">

<h1>
ROYAL URDU HIGH SCHOOL
</h1>

<h2>
Certificate Report
</h2>

</div>

</div>

<div class="report-info">

<div>

<strong>
Academic Year :
</strong>

${academicYear}

</div>

<div>

<strong>
Class :
</strong>

${filters.class_name || "All"}

</div>

<div>

<strong>
Section :
</strong>

${filters.section_name || "All"}

</div>

<div>

<strong>
Generated :
</strong>

${new Date().toLocaleDateString("en-GB")}

</div>

</div>

<div class="total">

Total Records : ${totalRecords}

</div>

<table>

<thead>

<tr>

<th>
Certificate No
</th>

<th>
Issue Date
</th>

<th>
Admission No
</th>

<th>
Student Name
</th>

<th>
Class
</th>

<th>
Section
</th>

<th>
Certificate Type
</th>

<th>
Generated By
</th>

<th>
Status
</th>

</tr>

</thead>

<tbody>

${certificates.map(item => `

<tr>

<td>

${item.certificate_no || ""}

</td>

<td>

${
item.issue_date
?
new Intl.DateTimeFormat("en-GB")
.format(new Date(item.issue_date))
:
""
}

</td>

<td>

${item.admission_no || ""}

</td>

<td class="student-name">

${item.student_name || ""}

</td>

<td>

${item.class_name || ""}

</td>

<td>

${item.section_name || ""}

</td>

<td>

${item.certificate_type || ""}

</td>

<td>

${item.generated_by || ""}

</td>

<td>

${item.status || ""}

</td>

</tr>

`).join("")}

</tbody>

</table>

<div class="footer">

<div>

<br><br>

<hr>

Prepared By

</div>

<div>

<br><br>

<hr>

Office Staff

</div>

<div>

<br><br>

<hr>

Principal

</div>

</div>

<script>

window.onload = function(){

    const images = document.images;

    let loaded = 0;

    if(images.length === 0){

        window.print();

        return;

    }

    for(let img of images){

        if(img.complete){

            loaded++;

        }else{

            img.onload = () => {

                loaded++;

                if(loaded === images.length){

                    window.print();

                }

            };

        }

    }

    if(loaded === images.length){

        setTimeout(()=>{

            window.print();

        },500);

    }

};

</script>

</body>

</html>

`;

};



/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE PDF
|--------------------------------------------------------------------------
*/

exports.exportCertificatePdf = async (filters) => {

    const certificates =
        await exports.getCertificateReport(filters);

    const doc = new PDFDocument({

        size: "A4",
        layout: "landscape",
        margin: 20,

    });

    const stream = new PassThrough();

    const buffers = [];

    doc.pipe(stream);

    stream.on(
        "data",
        (chunk) => buffers.push(chunk)
    );

    const today =
        new Intl.DateTimeFormat("en-GB")
            .format(new Date());

    /*
    |--------------------------------------------------------------------------
    | LOGO
    |--------------------------------------------------------------------------
    */

    const logoPath = path.join(
        __dirname,
        "../../../uploads/school/logo.png"
    );

    if (fs.existsSync(logoPath)) {

        doc.image(
            logoPath,
            390,
            20,
            {
                width: 60,
                height: 60
            }
        );

    }

    /*
    |--------------------------------------------------------------------------
    | HEADER
    |--------------------------------------------------------------------------
    */

    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text(
            "ROYAL URDU HIGH SCHOOL",
            0,
            90,
            {
                align: "center"
            }
        );

    doc
        .font("Helvetica")
        .fontSize(14)
        .text(
            "Certificate Report",
            {
                align: "center"
            }
        );

    /*
    |--------------------------------------------------------------------------
    | REPORT INFO
    |--------------------------------------------------------------------------
    */

    const academicYear =
        certificates[0]
            ?
            `${certificates[0].year_start || ""}-${certificates[0].year_end || ""}`
            :
            "";

    const infoY = 145;

    doc
        .rect(
            25,
            infoY,
            792,
            35
        )
        .stroke();

    doc
        .font("Helvetica")
        .fontSize(10);

    doc.text(
        `Academic Year : ${academicYear}`,
        40,
        infoY + 12
    );

    doc.text(
        `Class : ${filters.class_name || "All"}`,
        260,
        infoY + 12
    );

    doc.text(
        `Section : ${filters.section_name || "All"}`,
        430,
        infoY + 12
    );

    doc.text(
        `Generated : ${today}`,
        650,
        infoY + 12
    );

    doc
        .font("Helvetica-Bold")
        .text(
            `Total Records : ${certificates.length}`,
            25,
            195
        );

    /*
    |--------------------------------------------------------------------------
    | TABLE HEADER
    |--------------------------------------------------------------------------
    */

    const startX = 25;

    let y = 225;

    const cols = [

        {
            label: "Cert No",
            width: 90
        },

        {
            label: "Issue Date",
            width: 70
        },

        {
            label: "Adm No",
            width: 60
        },

        {
            label: "Student Name",
            width: 180
        },

        {
            label: "Class",
            width: 60
        },

        {
            label: "Section",
            width: 60
        },

        {
            label: "Certificate",
            width: 120
        },

        {
            label: "Generated By",
            width: 90
        },

        {
            label: "Status",
            width: 65
        }

    ];

    let x = startX;

    doc
        .font("Helvetica-Bold")
        .fontSize(8);

    cols.forEach((col) => {

        doc
            .rect(
                x,
                y,
                col.width,
                20
            )
            .stroke();

        doc.text(
            col.label,
            x + 2,
            y + 6,
            {
                width: col.width - 4,
                align: "center"
            }
        );

        x += col.width;

    });

    /*
    |--------------------------------------------------------------------------
    | TABLE ROWS
    |--------------------------------------------------------------------------
    */

    y += 20;

    doc
        .font("Helvetica")
        .fontSize(8);

    certificates.forEach((item) => {

        x = startX;

        const values = [

            item.certificate_no || "",

            item.issue_date
                ?
                new Intl.DateTimeFormat("en-GB")
                    .format(new Date(item.issue_date))
                :
                "",

            item.admission_no || "",

            item.student_name || "",

            item.class_name || "",

            item.section_name || "",

            item.certificate_type || "",

            item.generated_by || "",

            item.status || ""

        ];

        values.forEach((value, index) => {

            const width = cols[index].width;

            doc
                .rect(
                    x,
                    y,
                    width,
                    20
                )
                .stroke();

            doc.text(
                String(value),
                x + 2,
                y + 6,
                {
                    width: width - 4,
                    align: "center"
                }
            );

            x += width;

        });

        y += 20;

        if (y > 520) {

            doc.addPage();

            if (fs.existsSync(logoPath)) {

                doc.image(
                    logoPath,
                    390,
                    20,
                    {
                        width: 60,
                        height: 60
                    }
                );

            }

            doc
                .font("Helvetica-Bold")
                .fontSize(22)
                .text(
                    "ROYAL URDU HIGH SCHOOL",
                    0,
                    90,
                    {
                        align: "center"
                    }
                );

            doc
                .font("Helvetica")
                .fontSize(14)
                .text(
                    "Certificate Report",
                    {
                        align: "center"
                    }
                );

            y = 140;

            x = startX;

            doc
                .font("Helvetica-Bold")
                .fontSize(8);

            cols.forEach((col) => {

                doc
                    .rect(
                        x,
                        y,
                        col.width,
                        20
                    )
                    .stroke();

                doc.text(
                    col.label,
                    x + 2,
                    y + 6,
                    {
                        width: col.width - 4,
                        align: "center"
                    }
                );

                x += col.width;

            });

            y += 20;

            doc
                .font("Helvetica")
                .fontSize(8);

        }

    });

    /*
    |--------------------------------------------------------------------------
    | FOOTER
    |--------------------------------------------------------------------------
    */

    doc
        .moveTo(60, 550)
        .lineTo(180, 550)
        .stroke();

    doc.text(
        "Prepared By",
        85,
        560
    );

    doc
        .moveTo(350, 550)
        .lineTo(470, 550)
        .stroke();

    doc.text(
        "Office Staff",
        375,
        560
    );

    doc
        .moveTo(650, 550)
        .lineTo(770, 550)
        .stroke();

    doc.text(
        "Principal",
        685,
        560
    );

    doc.end();

    return await new Promise((resolve) => {

        stream.on("end", () => {

            resolve(
                Buffer.concat(buffers)
            );

        });

    });

};


/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportCertificateExcel = async (filters) => {

    const certificates =
        await exports.getCertificateReport(filters);

    const workbook =
        new ExcelJS.Workbook();

    const worksheet =
        workbook.addWorksheet(
            "Certificate Report"
        );

    worksheet.columns = [

        {
            header: "Certificate No",
            key: "certificate_no",
            width: 20
        },

        {
            header: "Issue Date",
            key: "issue_date",
            width: 18
        },

        {
            header: "Admission No",
            key: "admission_no",
            width: 15
        },

        {
            header: "Student Name",
            key: "student_name",
            width: 30
        },

        {
            header: "Class",
            key: "class_name",
            width: 15
        },

        {
            header: "Section",
            key: "section_name",
            width: 15
        },

        {
            header: "Certificate Type",
            key: "certificate_type",
            width: 25
        },

        {
            header: "Generated By",
            key: "generated_by",
            width: 20
        },

        {
            header: "Status",
            key: "status",
            width: 15
        }

    ];

    certificates.forEach((item) => {

        worksheet.addRow({

            certificate_no:
                item.certificate_no || "",

            issue_date:
                item.issue_date
                    ?
                    new Intl.DateTimeFormat("en-GB")
                        .format(new Date(item.issue_date))
                    :
                    "",

            admission_no:
                item.admission_no || "",

            student_name:
                item.student_name || "",

            class_name:
                item.class_name || "",

            section_name:
                item.section_name || "",

            certificate_type:
                item.certificate_type || "",

            generated_by:
                item.generated_by || "",

            status:
                item.status || ""

        });

    });

    /*
    |--------------------------------------------------------------------------
    | HEADER STYLE
    |--------------------------------------------------------------------------
    */

    worksheet.getRow(1).font = {

        bold: true

    };

    return await workbook.xlsx.writeBuffer();

};


/*
|--------------------------------------------------------------------------
| Print and PDF and Exel college logo info Report 
|--------------------------------------------------------------------------
*/

const getReportMeta = (filters, students) => {

    return {

        schoolName: "ROYAL URDU HIGH SCHOOL",

        generatedDate:
            new Date().toLocaleDateString("en-GB"),

        totalStudents:
            students.length,

        academicYear:
            students[0]
            ?
            `${students[0].year_start}-${students[0].year_end}`
            :
            "",

        className:
            filters.class_id || "All",

        sectionName:
            filters.section_id || "All",

        status:
            filters.status || "All"

    };

};






/*
|--------------------------------------------------------------------------
| Print Student Report
|--------------------------------------------------------------------------
*/

exports.printStudentReport = async (filters) => {

    const students = await exports.getStudentReport(filters);


    const totalStudents = students.length;


    const academicYear = students.length
        ?
        `${students[0].year_start || ""}-${students[0].year_end || ""}`
        :
        "";


    return `
<!DOCTYPE html>

<html>

<head>

<title>
Student Report
</title>


<style>


*{

    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;

}


body{

    padding:20px;
    color:#000;
    background:#fff;

}


/*
|--------------------------------------------------------------------------
| SCHOOL HEADER
|--------------------------------------------------------------------------
*/


.school-header{

    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;

    margin-bottom:15px;

}


.logo{

    width:80px;
    height:80px;

    object-fit:contain;

}



.school-name{

    text-align:center;

}


.school-name h1{

    font-size:26px;
    margin-bottom:5px;

}


.school-name h2{

    font-size:18px;

}


/*
|--------------------------------------------------------------------------
| REPORT INFO
|--------------------------------------------------------------------------
*/


.report-info{


    border:1px solid #000;

    padding:10px;

    margin-bottom:10px;


    display:flex;

    justify-content:space-between;

    font-size:12px;


}


.total{


    font-size:13px;

    font-weight:bold;

    margin-bottom:15px;


}


/*
|--------------------------------------------------------------------------
| TABLE
|--------------------------------------------------------------------------
*/


table{

    width:100%;

    border-collapse:collapse;

    font-size:11px;


}


thead{

    background:#efefef;

}



th{


    border:1px solid #000;

    padding:8px 6px;

    text-align:center;

    font-weight:bold;


}



td{


    border:1px solid #000;

    padding:6px;

    text-align:center;

    vertical-align:middle;


}



.student-name{


    text-align:left;

    padding-left:10px;


}



tbody tr:nth-child(even){

    background:#fafafa;

}



/*
|--------------------------------------------------------------------------
| FOOTER
|--------------------------------------------------------------------------
*/


.footer{


    margin-top:40px;

    display:flex;

    justify-content:space-between;


}


.footer div{


    width:180px;

    text-align:center;

    font-size:12px;


}



.footer hr{


    border:none;

    border-top:1px solid #000;

    margin-bottom:6px;


}

.logo{

    width:80px;
    height:80px;

    object-fit:contain;

    display:block;

}



/*
|--------------------------------------------------------------------------
| PRINT
|--------------------------------------------------------------------------
*/


@page{


    size:A4 landscape;

    margin:12mm;


}



@media print{


body{

    padding:0;

}



.no-print{

    display:none;

}


}



</style>


</head>



<body>


<!-- SCHOOL HEADER -->

<div class="school-header">


<img
src="http://localhost:5000/uploads/school/logo.png"
class="logo"
/>



<div class="school-name">


<h1>
ROYAL URDU HIGH SCHOOL
</h1>


<h2>
Student Report
</h2>



</div>


</div>




<!-- REPORT DETAILS -->


<div class="report-info">


<div>

<strong>
Academic Year:
</strong>

${academicYear}

</div>



<div>

<strong>
Class:
</strong>

${filters.class_name || "All"}

</div>



<div>

<strong>
Section:
</strong>

${filters.section_name || "All"}

</div>



<div>

<strong>
Generated:
</strong>

${new Date().toLocaleDateString("en-GB")}

</div>



</div>




<div class="total">


Total Students : ${totalStudents}


</div>





<table>


<thead>


<tr>


<th>
Admission No
</th>


<th>
PEN No
</th>


<th>
GR No
</th>


<th>
Roll No
</th>


<th>
Student Name
</th>


<th>
Gender
</th>


<th>
Category
</th>


<th>
Caste
</th>


<th>
Mobile
</th>


<th>
Admission Date
</th>


<th>
Academic Year
</th>


<th>
Class
</th>


<th>
Section
</th>


<th>
Status
</th>



</tr>


</thead>



<tbody>



${students.map(item => `


<tr>


<td>
${item.admission_no || ""}
</td>


<td>
${item.pen_number || ""}
</td>


<td>
${item.gr_no || ""}
</td>


<td>
${item.roll_no || ""}
</td>



<td class="student-name">

${item.student_name || ""}

</td>



<td>
${item.gender || ""}
</td>


<td>
${item.category || ""}
</td>


<td>
${item.caste || ""}
</td>


<td>
${item.mobile || ""}
</td>



<td>

${
item.admission_date

?

new Intl.DateTimeFormat("en-GB")
.format(new Date(item.admission_date))

:

""

}

</td>



<td>

${item.year_start || ""}-${item.year_end || ""}

</td>



<td>

${item.class_name || ""}

</td>



<td>

${item.section_name || ""}

</td>



<td>

${item.status || ""}

</td>



</tr>



`).join("")}



</tbody>



</table>






<div class="footer">


<div>

<br><br>

<hr>

Prepared By

</div>



<div>

<br><br>

<hr>

Class Teacher

</div>



<div>

<br><br>

<hr>

Principal

</div>



</div>





<script>

window.onload = function(){

    const images = document.images;

    let loaded = 0;

    if(images.length === 0){
        window.print();
        return;
    }


    for(let img of images){

        if(img.complete){

            loaded++;

        }
        else{

            img.onload = () => {

                loaded++;

                if(loaded === images.length){
                    window.print();
                }

            };

        }

    }


    if(loaded === images.length){

        setTimeout(()=>{
            window.print();
        },500);

    }

};

</script>



</body>


</html>

`;

};



/*
|--------------------------------------------------------------------------
| | EXPORT STUDENT PDF
|--------------------------------------------------------------------------
*/

exports.exportStudentPdf = async (filters) => {

    const students = await exports.getStudentReport(filters);


    const doc = new PDFDocument({

        size: "A4",
        layout: "landscape",
        margin: 20,

    });


    const stream = new PassThrough();

    const buffers = [];


    doc.pipe(stream);


    stream.on("data", (chunk)=>buffers.push(chunk));


    const today = new Intl.DateTimeFormat("en-GB")
        .format(new Date());



    /*
    |--------------------------------------------------------------------------
    | LOGO PATH
    |--------------------------------------------------------------------------
    */


    const logoPath = path.join(
        __dirname,
        "../../../uploads/school/logo.png"
    );



    /*
    |--------------------------------------------------------------------------
    | SCHOOL HEADER
    |--------------------------------------------------------------------------
    */


    if(fs.existsSync(logoPath)){


        doc.image(
            logoPath,
            390,
            20,
            {
                width:60,
                height:60
            }
        );


    }



    doc
    .font("Helvetica-Bold")
    .fontSize(22)
    .text(
        "ROYAL URDU HIGH SCHOOL",
        0,
        90,
        {
            align:"center"
        }
    );



    doc
    .font("Helvetica")
    .fontSize(14)
    .text(
        "Student Report",
        {
            align:"center"
        }
    );




    /*
    |--------------------------------------------------------------------------
    | REPORT INFO BOX
    |--------------------------------------------------------------------------
    */


    const infoY = 145;


    doc
    .rect(
        25,
        infoY,
        792,
        35
    )
    .stroke();



    doc
    .fontSize(10)
    .font("Helvetica");



    const academicYear = students[0]
    ?
    `${students[0].year_start}-${students[0].year_end}`
    :
    "";



    doc.text(
        `Academic Year: ${academicYear}`,
        40,
        infoY+12
    );



    doc.text(
        `Class: ${filters.class_name || "All"}`,
        260,
        infoY+12
    );



    doc.text(
        `Section: ${filters.section_name || "All"}`,
        430,
        infoY+12
    );



    doc.text(
        `Generated: ${today}`,
        650,
        infoY+12
    );



    doc
    .font("Helvetica-Bold")
    .text(
        `Total Students : ${students.length}`,
        25,
        195
    );




    /*
    |--------------------------------------------------------------------------
    | TABLE HEADER
    |--------------------------------------------------------------------------
    */


    const startX = 25;


    let y = 225;



    const cols = [


        { label:"Adm", width:40 },
        { label:"PEN", width:40 },
        { label:"GR", width:40 },
        { label:"Roll", width:35 },
        { label:"Student Name", width:140 },
        { label:"Gender", width:45 },
        { label:"Category", width:55 },
        { label:"Caste", width:60 },
        { label:"Mobile", width:70 },
        { label:"Admission", width:65 },
        { label:"Year", width:65 },
        { label:"Class", width:45 },
        { label:"Section", width:45 },
        { label:"Status", width:55 },


    ];



    let x = startX;


    doc
    .fontSize(8)
    .font("Helvetica-Bold");



    cols.forEach((col)=>{


        doc
        .rect(
            x,
            y,
            col.width,
            20
        )
        .stroke();



        doc.text(
            col.label,
            x+2,
            y+6,
            {
                width:col.width-4,
                align:"center"
            }
        );


        x += col.width;


    });



    /*
    |--------------------------------------------------------------------------
    | TABLE ROWS
    |--------------------------------------------------------------------------
    */


    y += 20;


    doc.font("Helvetica");



    students.forEach((item)=>{


        x=startX;



        const values=[


            item.admission_no || "",
            item.pen_number || "",
            item.gr_no || "",
            item.roll_no || "",
            item.student_name || "",
            item.gender || "",
            item.category || "",
            item.caste || "",
            item.mobile || "",


            item.admission_date
            ?
            new Intl.DateTimeFormat("en-GB")
            .format(new Date(item.admission_date))
            :
            "",


            `${item.year_start || ""}-${item.year_end || ""}`,

            item.class_name || "",

            item.section_name || "",

            item.status || "",


        ];



        values.forEach((value,index)=>{


            const width = cols[index].width;



            doc
            .rect(
                x,
                y,
                width,
                20
            )
            .stroke();



            doc.text(
                String(value),
                x+2,
                y+6,
                {
                    width:width-4,
                    align:"center"
                }
            );



            x += width;


        });



        y +=20;



        if(y > 520){


            doc.addPage();


            y=40;


        }



    });




    /*
    |--------------------------------------------------------------------------
    | FOOTER
    |--------------------------------------------------------------------------
    */


    doc.moveTo(60,550)
    .lineTo(180,550)
    .stroke();



    doc.text(
        "Prepared By",
        85,
        560
    );




    doc.moveTo(350,550)
    .lineTo(470,550)
    .stroke();



    doc.text(
        "Class Teacher",
        370,
        560
    );




    doc.moveTo(650,550)
    .lineTo(770,550)
    .stroke();



    doc.text(
        "Principal",
        685,
        560
    );




    doc.end();



    return await new Promise((resolve)=>{


        stream.on("end",()=>{


            resolve(
                Buffer.concat(buffers)
            );


        });


    });



};





/*
|--------------------------------------------------------------------------
| EXPORT STUDENT EXCEL
|--------------------------------------------------------------------------
*/

exports.exportStudentExcel = async (filters) => {

    const students = await exports.getStudentReport(filters);


    const workbook = new ExcelJS.Workbook();


    const worksheet = workbook.addWorksheet(
        "Student Report"
    );


    worksheet.columns = [

        {
            header: "Admission No",
            key: "admission_no",
            width: 15
        },

        {
            header: "PEN No",
            key: "pen_number",
            width: 15
        },

        {
            header: "GR No",
            key: "gr_no",
            width: 12
        },

        {
            header: "Roll No",
            key: "roll_no",
            width: 12
        },

        {
            header: "Student Name",
            key: "student_name",
            width: 25
        },

        {
            header: "Gender",
            key: "gender",
            width: 12
        },

        {
            header: "Category",
            key: "category",
            width: 15
        },

        {
            header: "Caste",
            key: "caste",
            width: 15
        },

        {
            header: "Mobile",
            key: "mobile",
            width: 15
        },

        {
            header: "Admission Date",
            key: "admission_date",
            width: 18
        },

        {
            header: "Academic Year",
            key: "academic_year",
            width: 18
        },

        {
            header: "Class",
            key: "class_name",
            width: 12
        },

        {
            header: "Section",
            key: "section_name",
            width: 12
        },

        {
            header: "Status",
            key: "status",
            width: 12
        },

    ];


    students.forEach((student)=>{

        worksheet.addRow({

            admission_no:
                student.admission_no || "",

            pen_number:
                student.pen_number || "",

            gr_no:
                student.gr_no || "",

            roll_no:
                student.roll_no || "",

            student_name:
                student.student_name || "",

            gender:
                student.gender || "",

            category:
                student.category || "",

            caste:
                student.caste || "",

            mobile:
                student.mobile || "",

            admission_date:
                student.admission_date
                ?
                new Intl.DateTimeFormat("en-GB")
                .format(new Date(student.admission_date))
                :
                "",

            academic_year:
                `${student.year_start || ""}-${student.year_end || ""}`,

            class_name:
                student.class_name || "",

            section_name:
                student.section_name || "",

            status:
                student.status || "",

        });

    });


    // Header styling

    worksheet.getRow(1).font = {
        bold:true
    };


    return await workbook.xlsx.writeBuffer();

};






/*
|--------------------------------------------------------------------------
| PRINT ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

exports.printAttendanceReport = async (filters) => {

    const attendance = await exports.getAttendanceReport(filters);

    const totalRecords = attendance.length;

    const academicYear = attendance.length
        ? `${attendance[0].year_start || ""}-${attendance[0].year_end || ""}`
        : "";

    return `
<!DOCTYPE html>

<html>

<head>

<title>
Attendance Report
</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}

body{
    padding:20px;
    color:#000;
    background:#fff;
}

.school-header{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;
    margin-bottom:15px;
}

.logo{
    width:80px;
    height:80px;
    object-fit:contain;
}

.school-name{
    text-align:center;
}

.school-name h1{
    font-size:26px;
    margin-bottom:5px;
}

.school-name h2{
    font-size:18px;
}

.report-info{
    border:1px solid #000;
    padding:10px;
    margin-bottom:10px;
    display:flex;
    justify-content:space-between;
    font-size:12px;
}

.total{
    font-size:13px;
    font-weight:bold;
    margin-bottom:15px;
}

table{
    width:100%;
    border-collapse:collapse;
    font-size:11px;
}

thead{
    background:#efefef;
}

th,td{
    border:1px solid #000;
    padding:6px;
    text-align:center;
}

.student-name{
    text-align:left;
    padding-left:10px;
}

tbody tr:nth-child(even){
    background:#fafafa;
}

.footer{
    margin-top:40px;
    display:flex;
    justify-content:space-between;
}

.footer div{
    width:180px;
    text-align:center;
    font-size:12px;
}

.footer hr{
    border:none;
    border-top:1px solid #000;
    margin-bottom:6px;
}

@page{
    size:A4 landscape;
    margin:12mm;
}

@media print{
body{
    padding:0;
}
}

</style>

</head>

<body>

<div class="school-header">

<img
src="http://localhost:5000/uploads/school/logo.png"
class="logo"
/>

<div class="school-name">

<h1>ROYAL URDU HIGH SCHOOL</h1>

<h2>Attendance Report</h2>

</div>

</div>

<div class="report-info">

<div>
<strong>Academic Year :</strong>
${academicYear}
</div>

<div>
<strong>Class :</strong>
${filters.class_name || "All"}
</div>

<div>
<strong>Section :</strong>
${filters.section_name || "All"}
</div>

<div>
<strong>Date :</strong>
${filters.attendance_date || "All"}
</div>

<div>
<strong>Generated :</strong>
${new Date().toLocaleDateString("en-GB")}
</div>

</div>

<div class="total">
Total Records : ${totalRecords}
</div>

<table>

<thead>

<tr>

<th>Date</th>
<th>Admission No</th>
<th>Roll No</th>
<th>Student Name</th>
<th>Class</th>
<th>Section</th>
<th>Status</th>
<th>Check In</th>
<th>Check Out</th>
<th>Remarks</th>

</tr>

</thead>

<tbody>

${attendance.map(item => `

<tr>

<td>
${item.attendance_date
    ? new Intl.DateTimeFormat("en-GB").format(new Date(item.attendance_date))
    : ""}
</td>

<td>${item.admission_no || ""}</td>

<td>${item.roll_no || ""}</td>

<td class="student-name">
${item.student_name || ""}
</td>

<td>${item.class_name || ""}</td>

<td>${item.section_name || ""}</td>

<td>${item.status || ""}</td>

<td>${item.check_in || ""}</td>

<td>${item.check_out || ""}</td>

<td>${item.remarks || ""}</td>

</tr>

`).join("")}

</tbody>

</table>

<div class="footer">

<div>

<br><br>

<hr>

Prepared By

</div>

<div>

<br><br>

<hr>

Class Teacher

</div>

<div>

<br><br>

<hr>

Principal

</div>

</div>

<script>

window.onload=function(){

const images=document.images;

let loaded=0;

if(images.length===0){

window.print();

return;

}

for(let img of images){

if(img.complete){

loaded++;

}else{

img.onload=()=>{

loaded++;

if(loaded===images.length){

window.print();

}

};

}

}

if(loaded===images.length){

setTimeout(()=>{

window.print();

},500);

}

};

</script>

</body>

</html>
`;

};






/*
|--------------------------------------------------------------------------
| EXPORT ATTENDANCE PDF
|--------------------------------------------------------------------------
*/

exports.exportAttendancePdf = async (filters) => {

    const attendance = await exports.getAttendanceReport(filters);

    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 20,
    });

    const stream = new PassThrough();
    const buffers = [];

    doc.pipe(stream);
    stream.on("data", chunk => buffers.push(chunk));

    const today = new Intl.DateTimeFormat("en-GB").format(new Date());

    const logoPath = path.join(
        __dirname,
        "../../../uploads/school/logo.png"
    );

    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 30, 20, {
            width: 60,
            height: 60,
        });
    }

    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text("ROYAL URDU HIGH SCHOOL", 0, 30, {
            align: "center",
        });

    doc
        .font("Helvetica")
        .fontSize(14)
        .text("Attendance Report", {
            align: "center",
        });

    const academicYear = attendance[0]
        ? `${attendance[0].year_start}-${attendance[0].year_end}`
        : "";

    const infoY = 95;

    doc
        .rect(25, infoY, 792, 35)
        .stroke();

    doc
        .font("Helvetica")
        .fontSize(10);

    doc.text(
        `Academic Year : ${academicYear}`,
        40,
        infoY + 12
    );

    doc.text(
        `Class : ${filters.class_name || "All"}`,
        250,
        infoY + 12
    );

    doc.text(
        `Section : ${filters.section_name || "All"}`,
        400,
        infoY + 12
    );

    doc.text(
        `Generated : ${today}`,
        640,
        infoY + 12
    );

    doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
            `Total Records : ${attendance.length}`,
            25,
            145
        );

    const cols = [
        { label: "Date", width: 70 },
        { label: "Adm No", width: 60 },
        { label: "Roll", width: 45 },
        { label: "Student Name", width: 180 },
        { label: "Class", width: 60 },
        { label: "Section", width: 55 },
        { label: "Status", width: 70 },
        { label: "Check In", width: 65 },
        { label: "Check Out", width: 65 },
        { label: "Remarks", width: 122 },
    ];

    const startX = 25;
    let y = 175;

    let x = startX;

    doc
        .font("Helvetica-Bold")
        .fontSize(8);

    cols.forEach(col => {

        doc
            .rect(x, y, col.width, 20)
            .stroke();

        doc.text(
            col.label,
            x + 2,
            y + 6,
            {
                width: col.width - 4,
                align: "center",
            }
        );

        x += col.width;

    });

    y += 20;

    doc
        .font("Helvetica")
        .fontSize(8);

    attendance.forEach(item => {

        x = startX;

        const values = [

            item.attendance_date
                ? new Intl.DateTimeFormat("en-GB").format(new Date(item.attendance_date))
                : "",

            item.admission_no || "",

            item.roll_no || "",

            item.student_name || "",

            item.class_name || "",

            item.section_name || "",

            item.status || "",

            item.check_in || "",

            item.check_out || "",

            item.remarks || ""

        ];

        values.forEach((value, index) => {

            const width = cols[index].width;

            doc
                .rect(x, y, width, 20)
                .stroke();

            doc.text(
                String(value),
                x + 2,
                y + 6,
                {
                    width: width - 4,
                    align: "center",
                }
            );

            x += width;

        });

        y += 20;

        if (y > 520) {

            doc.addPage();

            if (fs.existsSync(logoPath)) {
                doc.image(logoPath, 30, 20, {
                    width: 60,
                    height: 60,
                });
            }

            doc
                .font("Helvetica-Bold")
                .fontSize(20)
                .text("ROYAL URDU HIGH SCHOOL", 0, 30, {
                    align: "center",
                });

            doc
                .font("Helvetica")
                .fontSize(12)
                .text("Attendance Report", {
                    align: "center",
                });

            y = 90;

            x = startX;

            doc
                .font("Helvetica-Bold")
                .fontSize(8);

            cols.forEach(col => {

                doc
                    .rect(x, y, col.width, 20)
                    .stroke();

                doc.text(
                    col.label,
                    x + 2,
                    y + 6,
                    {
                        width: col.width - 4,
                        align: "center",
                    }
                );

                x += col.width;

            });

            y += 20;

            doc
                .font("Helvetica")
                .fontSize(8);

        }

    });

    doc.moveTo(60, 550).lineTo(180, 550).stroke();
    doc.text("Prepared By", 85, 560);

    doc.moveTo(350, 550).lineTo(470, 550).stroke();
    doc.text("Class Teacher", 370, 560);

    doc.moveTo(650, 550).lineTo(770, 550).stroke();
    doc.text("Principal", 685, 560);

    doc.end();

    return await new Promise((resolve) => {

        stream.on("end", () => {

            resolve(Buffer.concat(buffers));

        });

    });

};





/*
|--------------------------------------------------------------------------
| EXPORT ATTENDANCE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportAttendanceExcel = async (filters) => {

    const attendance = await exports.getAttendanceReport(filters);

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(
        "Attendance Report"
    );

    worksheet.columns = [

        {
            header: "Attendance Date",
            key: "attendance_date",
            width: 18
        },

        {
            header: "Admission No",
            key: "admission_no",
            width: 15
        },

        {
            header: "Roll No",
            key: "roll_no",
            width: 12
        },

        {
            header: "Student Name",
            key: "student_name",
            width: 30
        },

        {
            header: "Class",
            key: "class_name",
            width: 12
        },

        {
            header: "Section",
            key: "section_name",
            width: 12
        },

        {
            header: "Status",
            key: "status",
            width: 15
        },

        {
            header: "Check In",
            key: "check_in",
            width: 12
        },

        {
            header: "Check Out",
            key: "check_out",
            width: 12
        },

        {
            header: "Remarks",
            key: "remarks",
            width: 30
        },

    ];

    attendance.forEach((item) => {

        worksheet.addRow({

            attendance_date:
                item.attendance_date
                    ? new Intl.DateTimeFormat("en-GB")
                        .format(new Date(item.attendance_date))
                    : "",

            admission_no:
                item.admission_no || "",

            roll_no:
                item.roll_no || "",

            student_name:
                item.student_name || "",

            class_name:
                item.class_name || "",

            section_name:
                item.section_name || "",

            status:
                item.status || "",

            check_in:
                item.check_in || "",

            check_out:
                item.check_out || "",

            remarks:
                item.remarks || "",

        });

    });

    worksheet.getRow(1).font = {
        bold: true
    };

    return await workbook.xlsx.writeBuffer();

};



/*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

exports.getFeeReport = async (filters = {}) => {

    const values = [];

    let query = `
        SELECT

            fc.collection_id,
            fc.receipt_no,
            fc.payment_date,
            fc.payment_mode,
            fc.reference_no,
            fc.total_amount,
            fc.remarks,

            s.student_id,
            s.admission_no,
            s.roll_no,

            CONCAT_WS(
                ' ',
                s.first_name,
                s.middle_name,
                s.last_name
            ) AS student_name,

            c.class_name,
            sec.section_name,

            sf.total_fee,
            sf.discount,
            sf.fine,
            sf.previous_balance,
            sf.payable_amount,
            sf.paid_amount,
            sf.balance_amount,
            sf.status,

            ay.academic_year_id,
            ay.year_start,
            ay.year_end

        FROM fee_collections fc

        INNER JOIN student s
            ON s.student_id = fc.student_id

        LEFT JOIN class_master c
            ON c.class_id = s.class_id

        LEFT JOIN section_master sec
            ON sec.section_id = s.section_id

        LEFT JOIN academic_year ay
            ON ay.academic_year_id = s.academic_year_id

        LEFT JOIN student_fees sf
            ON sf.student_id = s.student_id
            AND sf.academic_year_id = s.academic_year_id

        WHERE 1 = 1
    `;

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    if (filters.academic_year_id) {

        query += ` AND s.academic_year_id = ?`;
        values.push(filters.academic_year_id);

    }

    if (filters.class_id) {

        query += ` AND s.class_id = ?`;
        values.push(filters.class_id);

    }

    if (filters.section_id) {

        query += ` AND s.section_id = ?`;
        values.push(filters.section_id);

    }

    if (filters.status) {

        query += ` AND sf.status = ?`;
        values.push(filters.status);

    }

    if (filters.payment_mode) {

        query += ` AND fc.payment_mode = ?`;
        values.push(filters.payment_mode);

    }

    if (filters.from_date) {

        query += ` AND fc.payment_date >= ?`;
        values.push(filters.from_date);

    }

    if (filters.to_date) {

        query += ` AND fc.payment_date <= ?`;
        values.push(filters.to_date);

    }

    /*
    |--------------------------------------------------------------------------
    | SEARCH
    |--------------------------------------------------------------------------
    */

    if (filters.search) {

        const keyword = `%${filters.search}%`;

        query += `
            AND (
                fc.receipt_no LIKE ?
                OR s.admission_no LIKE ?
                OR s.roll_no LIKE ?
                OR s.first_name LIKE ?
                OR s.middle_name LIKE ?
                OR s.last_name LIKE ?
            )
        `;

        values.push(
            keyword,
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        );

    }

    /*
    |--------------------------------------------------------------------------
    | ORDER BY
    |--------------------------------------------------------------------------
    */

    query += `
        ORDER BY
            fc.payment_date DESC,
            c.class_name,
            sec.section_name,
            CAST(s.roll_no AS UNSIGNED)
    `;

    const [rows] = await db.query(query, values);

    return rows;

};


/*
|--------------------------------------------------------------------------
| PRINT FEE REPORT
|--------------------------------------------------------------------------
*/

exports.printFeeReport = async (filters) => {

    const fees = await exports.getFeeReport(filters);

    const totalRecords = fees.length;

    const academicYear = fees.length
        ? `${fees[0].year_start || ""}-${fees[0].year_end || ""}`
        : "";

    return `
<!DOCTYPE html>

<html>

<head>

<title>
Fee Report
</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}

body{
    padding:20px;
    color:#000;
    background:#fff;
}

.school-header{
    display:flex;
    align-items:center;
    justify-content:center;
    gap:20px;
    margin-bottom:15px;
}

.logo{
    width:80px;
    height:80px;
    object-fit:contain;
}

.school-name{
    text-align:center;
}

.school-name h1{
    font-size:26px;
    margin-bottom:5px;
}

.school-name h2{
    font-size:18px;
}

.report-info{
    border:1px solid #000;
    padding:10px;
    margin-bottom:10px;
    display:flex;
    justify-content:space-between;
    font-size:12px;
    flex-wrap:wrap;
}

.total{
    font-size:13px;
    font-weight:bold;
    margin-bottom:15px;
}

table{
    width:100%;
    border-collapse:collapse;
    font-size:11px;
}

thead{
    background:#efefef;
}

th,
td{
    border:1px solid #000;
    padding:6px;
    text-align:center;
}

.student-name{
    text-align:left;
    padding-left:10px;
}

tbody tr:nth-child(even){
    background:#fafafa;
}

.footer{
    margin-top:40px;
    display:flex;
    justify-content:space-between;
}

.footer div{
    width:180px;
    text-align:center;
    font-size:12px;
}

.footer hr{
    border:none;
    border-top:1px solid #000;
    margin-bottom:6px;
}

@page{
    size:A4 landscape;
    margin:12mm;
}

@media print{

body{
    padding:0;
}

}

</style>

</head>

<body>

<div class="school-header">

<img
src="http://localhost:5000/uploads/school/logo.png"
class="logo"
/>

<div class="school-name">

<h1>
ROYAL URDU HIGH SCHOOL
</h1>

<h2>
Fee Report
</h2>

</div>

</div>

<div class="report-info">

<div>
<strong>Academic Year :</strong>
${academicYear}
</div>

<div>
<strong>Class :</strong>
${filters.class_name || "All"}
</div>

<div>
<strong>Section :</strong>
${filters.section_name || "All"}
</div>

<div>
<strong>Payment Mode :</strong>
${filters.payment_mode || "All"}
</div>

<div>
<strong>Generated :</strong>
${new Date().toLocaleDateString("en-GB")}
</div>

</div>

<div class="total">

Total Records : ${totalRecords}

</div>

<table>

<thead>

<tr>

<th>Receipt No</th>
<th>Payment Date</th>
<th>Admission No</th>
<th>Roll No</th>
<th>Student Name</th>
<th>Class</th>
<th>Section</th>
<th>Total Fee</th>
<th>Paid</th>
<th>Balance</th>
<th>Mode</th>
<th>Status</th>

</tr>

</thead>

<tbody>

${fees.map(item => `

<tr>

<td>
${item.receipt_no || ""}
</td>

<td>
${
item.payment_date
?
new Intl.DateTimeFormat("en-GB").format(new Date(item.payment_date))
:
""
}
</td>

<td>
${item.admission_no || ""}
</td>

<td>
${item.roll_no || ""}
</td>

<td class="student-name">
${item.student_name || ""}
</td>

<td>
${item.class_name || ""}
</td>

<td>
${item.section_name || ""}
</td>

<td>
₹${Number(item.total_fee || 0).toFixed(2)}
</td>

<td>
₹${Number(item.paid_amount || 0).toFixed(2)}
</td>

<td>
₹${Number(item.balance_amount || 0).toFixed(2)}
</td>

<td>
${item.payment_mode || ""}
</td>

<td>
${item.status || ""}
</td>

</tr>

`).join("")}

</tbody>

</table>

<div class="footer">

<div>

<br><br>

<hr>

Prepared By

</div>

<div>

<br><br>

<hr>

Accountant

</div>

<div>

<br><br>

<hr>

Principal

</div>

</div>

<script>

window.onload = function(){

    const images = document.images;

    let loaded = 0;

    if(images.length === 0){

        window.print();

        return;

    }

    for(let img of images){

        if(img.complete){

            loaded++;

        }else{

            img.onload = () => {

                loaded++;

                if(loaded === images.length){

                    window.print();

                }

            };

        }

    }

    if(loaded === images.length){

        setTimeout(() => {

            window.print();

        },500);

    }

};

</script>

</body>

</html>

`;

};


/*
|--------------------------------------------------------------------------
| EXPORT FEE PDF
|--------------------------------------------------------------------------
*/

exports.exportFeePdf = async (filters) => {

    const fees = await exports.getFeeReport(filters);

    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 20,
    });

    const stream = new PassThrough();
    const buffers = [];

    doc.pipe(stream);

    stream.on("data", chunk => buffers.push(chunk));

    const today = new Intl.DateTimeFormat("en-GB")
        .format(new Date());

    const logoPath = path.join(
        __dirname,
        "../../../uploads/school/logo.png"
    );

    if (fs.existsSync(logoPath)) {

        doc.image(
            logoPath,
            30,
            20,
            {
                width: 60,
                height: 60,
            }
        );

    }

    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text(
            "ROYAL URDU HIGH SCHOOL",
            0,
            30,
            {
                align: "center",
            }
        );

    doc
        .font("Helvetica")
        .fontSize(14)
        .text(
            "Fee Report",
            {
                align: "center",
            }
        );

    const academicYear = fees[0]
        ? `${fees[0].year_start}-${fees[0].year_end}`
        : "";

    const infoY = 95;

    doc
        .rect(
            25,
            infoY,
            792,
            35
        )
        .stroke();

    doc
        .font("Helvetica")
        .fontSize(10);

    doc.text(
        `Academic Year : ${academicYear}`,
        40,
        infoY + 12
    );

    doc.text(
        `Class : ${filters.class_name || "All"}`,
        240,
        infoY + 12
    );

    doc.text(
        `Section : ${filters.section_name || "All"}`,
        390,
        infoY + 12
    );

    doc.text(
        `Generated : ${today}`,
        640,
        infoY + 12
    );

    doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
            `Total Records : ${fees.length}`,
            25,
            145
        );

    const cols = [

        { label: "Receipt", width: 65 },

        { label: "Date", width: 65 },

        { label: "Adm No", width: 55 },

        { label: "Roll", width: 40 },

        { label: "Student Name", width: 150 },

        { label: "Class", width: 50 },

        { label: "Section", width: 50 },

        { label: "Total", width: 60 },

        { label: "Paid", width: 60 },

        { label: "Balance", width: 65 },

        { label: "Mode", width: 60 },

        { label: "Status", width: 72 },

    ];

    const startX = 25;

    let y = 175;

    let x = startX;

    doc
        .font("Helvetica-Bold")
        .fontSize(8);

    cols.forEach(col => {

        doc
            .rect(
                x,
                y,
                col.width,
                20
            )
            .stroke();

        doc.text(
            col.label,
            x + 2,
            y + 6,
            {
                width: col.width - 4,
                align: "center",
            }
        );

        x += col.width;

    });

    y += 20;

    doc
        .font("Helvetica")
        .fontSize(8);

    fees.forEach(item => {

        x = startX;

        const values = [

            item.receipt_no || "",

            item.payment_date
                ? new Intl.DateTimeFormat("en-GB")
                    .format(new Date(item.payment_date))
                : "",

            item.admission_no || "",

            item.roll_no || "",

            item.student_name || "",

            item.class_name || "",

            item.section_name || "",

            Number(item.total_fee || 0).toFixed(2),

            Number(item.paid_amount || 0).toFixed(2),

            Number(item.balance_amount || 0).toFixed(2),

            item.payment_mode || "",

            item.status || ""

        ];

        values.forEach((value, index) => {

            const width = cols[index].width;

            doc
                .rect(
                    x,
                    y,
                    width,
                    20
                )
                .stroke();

            doc.text(
                String(value),
                x + 2,
                y + 6,
                {
                    width: width - 4,
                    align: "center",
                }
            );

            x += width;

        });

        y += 20;

        if (y > 520) {

            doc.addPage();

            if (fs.existsSync(logoPath)) {

                doc.image(
                    logoPath,
                    30,
                    20,
                    {
                        width: 60,
                        height: 60,
                    }
                );

            }

            doc
                .font("Helvetica-Bold")
                .fontSize(20)
                .text(
                    "ROYAL URDU HIGH SCHOOL",
                    0,
                    30,
                    {
                        align: "center",
                    }
                );

            doc
                .font("Helvetica")
                .fontSize(12)
                .text(
                    "Fee Report",
                    {
                        align: "center",
                    }
                );

            y = 90;

            x = startX;

            doc
                .font("Helvetica-Bold")
                .fontSize(8);

            cols.forEach(col => {

                doc
                    .rect(
                        x,
                        y,
                        col.width,
                        20
                    )
                    .stroke();

                doc.text(
                    col.label,
                    x + 2,
                    y + 6,
                    {
                        width: col.width - 4,
                        align: "center",
                    }
                );

                x += col.width;

            });

            y += 20;

            doc
                .font("Helvetica")
                .fontSize(8);

        }

    });

    doc.moveTo(60, 550).lineTo(180, 550).stroke();
    doc.text("Prepared By", 85, 560);

    doc.moveTo(350, 550).lineTo(470, 550).stroke();
    doc.text("Accountant", 380, 560);

    doc.moveTo(650, 550).lineTo(770, 550).stroke();
    doc.text("Principal", 685, 560);

    doc.end();

    return await new Promise(resolve => {

        stream.on("end", () => {

            resolve(Buffer.concat(buffers));

        });

    });

};



/*
|--------------------------------------------------------------------------
| EXPORT FEE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportFeeExcel = async (filters) => {

    const fees = await exports.getFeeReport(filters);

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(
        "Fee Report"
    );

    worksheet.columns = [

        {
            header: "Receipt No",
            key: "receipt_no",
            width: 18
        },

        {
            header: "Payment Date",
            key: "payment_date",
            width: 18
        },

        {
            header: "Admission No",
            key: "admission_no",
            width: 15
        },

        {
            header: "Roll No",
            key: "roll_no",
            width: 12
        },

        {
            header: "Student Name",
            key: "student_name",
            width: 30
        },

        {
            header: "Class",
            key: "class_name",
            width: 12
        },

        {
            header: "Section",
            key: "section_name",
            width: 12
        },

        {
            header: "Total Fee",
            key: "total_fee",
            width: 15
        },

        {
            header: "Paid Amount",
            key: "paid_amount",
            width: 15
        },

        {
            header: "Balance Amount",
            key: "balance_amount",
            width: 18
        },

        {
            header: "Payment Mode",
            key: "payment_mode",
            width: 15
        },

        {
            header: "Status",
            key: "status",
            width: 15
        },

        {
            header: "Reference No",
            key: "reference_no",
            width: 20
        },

        {
            header: "Remarks",
            key: "remarks",
            width: 35
        },

    ];

    fees.forEach((item) => {

        worksheet.addRow({

            receipt_no:
                item.receipt_no || "",

            payment_date:
                item.payment_date
                    ? new Intl.DateTimeFormat("en-GB")
                        .format(new Date(item.payment_date))
                    : "",

            admission_no:
                item.admission_no || "",

            roll_no:
                item.roll_no || "",

            student_name:
                item.student_name || "",

            class_name:
                item.class_name || "",

            section_name:
                item.section_name || "",

            total_fee:
                Number(item.total_fee || 0),

            paid_amount:
                Number(item.paid_amount || 0),

            balance_amount:
                Number(item.balance_amount || 0),

            payment_mode:
                item.payment_mode || "",

            status:
                item.status || "",

            reference_no:
                item.reference_no || "",

            remarks:
                item.remarks || "",

        });

    });

    /*
    |--------------------------------------------------------------------------
    | HEADER STYLE
    |--------------------------------------------------------------------------
    */

    const headerRow = worksheet.getRow(1);

    headerRow.font = {
        bold: true,
    };

    headerRow.alignment = {
        vertical: "middle",
        horizontal: "center",
    };

    /*
    |--------------------------------------------------------------------------
    | CURRENCY FORMAT
    |--------------------------------------------------------------------------
    */

    ["H", "I", "J"].forEach((col) => {

        worksheet.getColumn(col).numFmt = "#,##0.00";

    });

    /*
    |--------------------------------------------------------------------------
    | CELL ALIGNMENT
    |--------------------------------------------------------------------------
    */

    worksheet.eachRow((row, rowNumber) => {

        if (rowNumber === 1) return;

        row.alignment = {
            vertical: "middle",
            horizontal: "center",
        };

        row.getCell(5).alignment = {
            horizontal: "left",
            vertical: "middle",
        };

        row.getCell(14).alignment = {
            horizontal: "left",
            vertical: "middle",
        };

    });

    return await workbook.xlsx.writeBuffer();

};





/*
|--------------------------------------------------------------------------
| Timetable Report 
|--------------------------------------------------------------------------
*/

exports.getTimetableReport = async (filters = {}) => {

    const values = [];

    let query = `

        SELECT

            t.timetable_id,

            t.day_of_week,

            t.period_no,

            t.start_time,

            t.end_time,

            t.room,

            t.status,

            ay.academic_year_id,
            ay.year_start,
            ay.year_end,

            c.class_name,

            sec.section_name,

            sub.subject_name,

            u.name AS teacher_name

        FROM timetable t

        LEFT JOIN academic_year ay
            ON ay.academic_year_id = t.academic_year_id

        LEFT JOIN class_master c
            ON c.class_id = t.class_id

        LEFT JOIN section_master sec
            ON sec.section_id = t.section_id

        LEFT JOIN subjects sub
            ON sub.subject_id = t.subject_id

        LEFT JOIN user_login u
            ON u.user_id = t.teacher_id

        WHERE 1 = 1

    `;

    /*
    |--------------------------------------------------------------------------
    | FILTERS
    |--------------------------------------------------------------------------
    */

    if (filters.academic_year_id) {

        query += ` AND t.academic_year_id = ?`;
        values.push(filters.academic_year_id);

    }

    if (filters.class_id) {

        query += ` AND t.class_id = ?`;
        values.push(filters.class_id);

    }

    if (filters.section_id) {

        query += ` AND t.section_id = ?`;
        values.push(filters.section_id);

    }

    if (filters.subject_id) {

        query += ` AND t.subject_id = ?`;
        values.push(filters.subject_id);

    }

    if (filters.status) {

        query += ` AND t.status = ?`;
        values.push(filters.status);

    }

    if (filters.search) {

        const keyword = `%${filters.search}%`;

        query += `

            AND (

                sub.subject_name LIKE ?

                OR c.class_name LIKE ?

                OR sec.section_name LIKE ?

                OR u.name LIKE ?

                OR t.day_of_week LIKE ?

                OR t.room LIKE ?

            )

        `;

        values.push(
            keyword,
            keyword,
            keyword,
            keyword,
            keyword,
            keyword
        );

    }

    query += `

        ORDER BY

            FIELD(
                t.day_of_week,
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday'
            ),

            t.period_no

    `;

    const [rows] = await db.query(query, values);

    return rows;

};


/*
|--------------------------------------------------------------------------
| PRINT TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

exports.printTimetableReport = async (filters) => {

    const timetable = await exports.getTimetableReport(filters);

    const totalRecords = timetable.length;

    const academicYear = timetable.length
        ? `${timetable[0].year_start || ""}-${timetable[0].year_end || ""}`
        : "";

    return `
<!DOCTYPE html>

<html>

<head>

<title>
Timetable Report
</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:Arial, Helvetica, sans-serif;
}

body{
    padding:20px;
    color:#000;
    background:#fff;
}

.school-header{
    display:flex;
    justify-content:center;
    align-items:center;
    gap:20px;
    margin-bottom:15px;
}

.logo{
    width:80px;
    height:80px;
    object-fit:contain;
}

.school-name{
    text-align:center;
}

.school-name h1{
    font-size:26px;
    margin-bottom:5px;
}

.school-name h2{
    font-size:18px;
}

.report-info{
    border:1px solid #000;
    padding:10px;
    margin-bottom:10px;
    display:flex;
    justify-content:space-between;
    flex-wrap:wrap;
    font-size:12px;
}

.total{
    font-size:13px;
    font-weight:bold;
    margin-bottom:15px;
}

table{
    width:100%;
    border-collapse:collapse;
    font-size:11px;
}

thead{
    background:#efefef;
}

th,
td{
    border:1px solid #000;
    padding:6px;
    text-align:center;
}

tbody tr:nth-child(even){
    background:#fafafa;
}

.footer{
    margin-top:40px;
    display:flex;
    justify-content:space-between;
}

.footer div{
    width:180px;
    text-align:center;
    font-size:12px;
}

.footer hr{
    border:none;
    border-top:1px solid #000;
    margin-bottom:6px;
}

@page{
    size:A4 landscape;
    margin:12mm;
}

@media print{

body{
    padding:0;
}

}

</style>

</head>

<body>

<div class="school-header">

<img
src="http://localhost:5000/uploads/school/logo.png"
class="logo"
/>

<div class="school-name">

<h1>
ROYAL URDU HIGH SCHOOL
</h1>

<h2>
Timetable Report
</h2>

</div>

</div>

<div class="report-info">

<div>
<strong>Academic Year :</strong>
${academicYear}
</div>

<div>
<strong>Class :</strong>
${filters.class_name || "All"}
</div>

<div>
<strong>Section :</strong>
${filters.section_name || "All"}
</div>

<div>
<strong>Status :</strong>
${filters.status || "All"}
</div>

<div>
<strong>Generated :</strong>
${new Date().toLocaleDateString("en-GB")}
</div>

</div>

<div class="total">

Total Records : ${totalRecords}

</div>

<table>

<thead>

<tr>

<th>Day</th>
<th>Period</th>
<th>Start Time</th>
<th>End Time</th>
<th>Class</th>
<th>Section</th>
<th>Subject</th>
<th>Teacher</th>
<th>Room</th>
<th>Status</th>

</tr>

</thead>

<tbody>

${timetable.map(item => `

<tr>

<td>${item.day_of_week || ""}</td>

<td>${item.period_no || ""}</td>

<td>${item.start_time || ""}</td>

<td>${item.end_time || ""}</td>

<td>${item.class_name || ""}</td>

<td>${item.section_name || ""}</td>

<td>${item.subject_name || ""}</td>

<td>${item.teacher_name || ""}</td>

<td>${item.room || ""}</td>

<td>${item.status || ""}</td>

</tr>

`).join("")}

</tbody>

</table>

<div class="footer">

<div>

<br><br>

<hr>

Prepared By

</div>

<div>

<br><br>

<hr>

Timetable Incharge

</div>

<div>

<br><br>

<hr>

Principal

</div>

</div>

<script>

window.onload = function(){

    const images = document.images;

    let loaded = 0;

    if(images.length === 0){

        window.print();

        return;

    }

    for(let img of images){

        if(img.complete){

            loaded++;

        }else{

            img.onload = () => {

                loaded++;

                if(loaded === images.length){

                    window.print();

                }

            };

        }

    }

    if(loaded === images.length){

        setTimeout(() => {

            window.print();

        },500);

    }

};

</script>

</body>

</html>

`;

};



/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE PDF
|--------------------------------------------------------------------------
*/

exports.exportTimetablePdf = async (filters) => {

    const timetable = await exports.getTimetableReport(filters);

    const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 20,
    });

    const stream = new PassThrough();
    const buffers = [];

    doc.pipe(stream);

    stream.on("data", chunk => buffers.push(chunk));

    const today = new Intl.DateTimeFormat("en-GB").format(new Date());

    const logoPath = path.join(
        __dirname,
        "../../../uploads/school/logo.png"
    );

    if (fs.existsSync(logoPath)) {

        doc.image(
            logoPath,
            30,
            20,
            {
                width: 60,
                height: 60,
            }
        );

    }

    doc
        .font("Helvetica-Bold")
        .fontSize(22)
        .text(
            "ROYAL URDU HIGH SCHOOL",
            0,
            30,
            {
                align: "center",
            }
        );

    doc
        .font("Helvetica")
        .fontSize(14)
        .text(
            "Timetable Report",
            {
                align: "center",
            }
        );

    const academicYear = timetable.length
        ? `${timetable[0].year_start || ""}-${timetable[0].year_end || ""}`
        : "";

    const infoY = 95;

    doc
        .rect(
            25,
            infoY,
            792,
            35
        )
        .stroke();

    doc
        .font("Helvetica")
        .fontSize(10);

    doc.text(
        `Academic Year : ${academicYear}`,
        40,
        infoY + 12
    );

    doc.text(
        `Class : ${filters.class_name || "All"}`,
        250,
        infoY + 12
    );

    doc.text(
        `Section : ${filters.section_name || "All"}`,
        430,
        infoY + 12
    );

    doc.text(
        `Generated : ${today}`,
        640,
        infoY + 12
    );

    doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(
            `Total Records : ${timetable.length}`,
            25,
            145
        );

    const cols = [

        { label: "Day", width: 70 },
        { label: "Period", width: 50 },
        { label: "Subject", width: 130 },
        { label: "Teacher", width: 140 },
        { label: "Start", width: 70 },
        { label: "End", width: 70 },
        { label: "Room", width: 70 },
        { label: "Class", width: 70 },
        { label: "Section", width: 70 },
        { label: "Status", width: 82 }

    ];

    const startX = 25;
    let y = 175;
    let x = startX;

    doc
        .font("Helvetica-Bold")
        .fontSize(8);

    cols.forEach(col => {

        doc
            .rect(
                x,
                y,
                col.width,
                20
            )
            .stroke();

        doc.text(
            col.label,
            x + 2,
            y + 6,
            {
                width: col.width - 4,
                align: "center",
            }
        );

        x += col.width;

    });

    y += 20;

    doc
        .font("Helvetica")
        .fontSize(8);

    timetable.forEach(item => {

        x = startX;

        const values = [

            item.day_of_week || "",

            item.period_no || "",

            item.subject_name || "",

            item.teacher_name || "",

            item.start_time || "",

            item.end_time || "",

            item.room || "",

            item.class_name || "",

            item.section_name || "",

            item.status || ""

        ];

        values.forEach((value, index) => {

            const width = cols[index].width;

            doc
                .rect(
                    x,
                    y,
                    width,
                    20
                )
                .stroke();

            doc.text(
                String(value),
                x + 2,
                y + 6,
                {
                    width: width - 4,
                    align: "center",
                }
            );

            x += width;

        });

        y += 20;

        if (y > 520) {

            doc.addPage();

            if (fs.existsSync(logoPath)) {

                doc.image(
                    logoPath,
                    30,
                    20,
                    {
                        width: 60,
                        height: 60,
                    }
                );

            }

            doc
                .font("Helvetica-Bold")
                .fontSize(20)
                .text(
                    "ROYAL URDU HIGH SCHOOL",
                    0,
                    30,
                    {
                        align: "center",
                    }
                );

            doc
                .font("Helvetica")
                .fontSize(12)
                .text(
                    "Timetable Report",
                    {
                        align: "center",
                    }
                );

            y = 90;

            x = startX;

            doc
                .font("Helvetica-Bold")
                .fontSize(8);

            cols.forEach(col => {

                doc
                    .rect(
                        x,
                        y,
                        col.width,
                        20
                    )
                    .stroke();

                doc.text(
                    col.label,
                    x + 2,
                    y + 6,
                    {
                        width: col.width - 4,
                        align: "center",
                    }
                );

                x += col.width;

            });

            y += 20;

            doc
                .font("Helvetica")
                .fontSize(8);

        }

    });

    doc.moveTo(60, 550).lineTo(180, 550).stroke();
    doc.text("Prepared By", 85, 560);

    doc.moveTo(350, 550).lineTo(470, 550).stroke();
    doc.text("Timetable Incharge", 360, 560);

    doc.moveTo(650, 550).lineTo(770, 550).stroke();
    doc.text("Principal", 685, 560);

    doc.end();

    return await new Promise(resolve => {

        stream.on("end", () => {

            resolve(Buffer.concat(buffers));

        });

    });

};



/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE EXCEL
|--------------------------------------------------------------------------
*/

exports.exportTimetableExcel = async (filters) => {

    const timetable = await exports.getTimetableReport(filters);

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Timetable Report");

    // School Heading
    worksheet.mergeCells("A1:J1");
    worksheet.getCell("A1").value = "ROYAL URDU HIGH SCHOOL";
    worksheet.getCell("A1").font = {
        bold: true,
        size: 18,
    };
    worksheet.getCell("A1").alignment = {
        horizontal: "center",
    };

    worksheet.mergeCells("A2:J2");
    worksheet.getCell("A2").value = "Timetable Report";
    worksheet.getCell("A2").font = {
        bold: true,
        size: 14,
    };
    worksheet.getCell("A2").alignment = {
        horizontal: "center",
    };

    worksheet.addRow([]);

    worksheet.addRow([
        "Academic Year",
        timetable.length
            ? `${timetable[0].year_start}-${timetable[0].year_end}`
            : "All",

        "Class",
        filters.class_name || "All",

        "Section",
        filters.section_name || "All",

        "Generated",
        new Intl.DateTimeFormat("en-GB").format(new Date())
    ]);

    worksheet.addRow([]);

    worksheet.columns = [
        {
            header: "Day",
            key: "day_of_week",
            width: 15,
        },
        {
            header: "Period",
            key: "period_no",
            width: 10,
        },
        {
            header: "Start Time",
            key: "start_time",
            width: 15,
        },
        {
            header: "End Time",
            key: "end_time",
            width: 15,
        },
        {
            header: "Subject",
            key: "subject_name",
            width: 25,
        },
        {
            header: "Teacher",
            key: "teacher_name",
            width: 25,
        },
        {
            header: "Room",
            key: "room",
            width: 15,
        },
        {
            header: "Class",
            key: "class_name",
            width: 15,
        },
        {
            header: "Section",
            key: "section_name",
            width: 15,
        },
        {
            header: "Status",
            key: "status",
            width: 15,
        },
    ];

    // Header Style
    const headerRow = worksheet.getRow(6);

    headerRow.font = {
        bold: true,
    };

    headerRow.alignment = {
        horizontal: "center",
        vertical: "middle",
    };

    headerRow.eachCell((cell) => {
        cell.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
        };
    });

    // Data
    timetable.forEach((item) => {

        const row = worksheet.addRow({

            day_of_week: item.day_of_week || "",

            period_no: item.period_no || "",

            start_time: item.start_time || "",

            end_time: item.end_time || "",

            subject_name: item.subject_name || "",

            teacher_name: item.teacher_name || "",

            room: item.room || "",

            class_name: item.class_name || "",

            section_name: item.section_name || "",

            status: item.status || "",

        });

        row.eachCell((cell) => {
            cell.border = {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
            };
        });

    });

    return await workbook.xlsx.writeBuffer();

};