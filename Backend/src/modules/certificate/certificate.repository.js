const pool = require("../../config/database");

/* ==============================
   Create Certificate
================================= */

exports.createCertificate = async (data) => {

    const {
        student_id,
        certificate_type,
        issue_date,
        certificate_no,
        generated_by,
        status = "Generated",
        remarks = "",
        index_no = "",   // ✅ add karo

        reason = "",
        pdf_path = null
    } = data;

    const sql = `

        INSERT INTO certificates(

            student_id,
            certificate_type,
            issue_date,
            certificate_no,
            generated_by,
            status,
            remarks,
            reason,
            index_no,
            pdf_path

        )

        VALUES(?,?,?,?,?,?,?,?,?,?)

    `;

    const [result] = await pool.execute(sql, [

        Number(student_id),
        certificate_type,
        issue_date,
        certificate_no,
        generated_by,
        status,
        remarks,
        reason,
        index_no,
        pdf_path

    ]);

    return result;

};

/* ==============================
   Get All Certificates
================================= */

exports.getCertificates = async (query) => {

    const {
        page = 1,
        limit = 20,
        search = "",
        type = "",
        student_id,
        classId = "",
        sectionId = "",
        status = ""
    } = query;

    const safePage = Number(page) > 0 ? Number(page) : 1;
    const safeLimit = Number(limit) > 0 ? Number(limit) : 20;
    const offset = (safePage - 1) * safeLimit;

    let where = "WHERE 1=1";
    const params = [];

    if (student_id) {
        where += " AND c.student_id=?";
        params.push(Number(student_id));
    }

    if (type) {
        where += " AND c.certificate_type=?";
        params.push(type);
    }

    if (status) {
        where += " AND c.status=?";
        params.push(status);
    }

    if (classId) {
        where += " AND s.class_id=?";
        params.push(Number(classId));
    }

    if (sectionId) {
        where += " AND s.section_id=?";
        params.push(Number(sectionId));
    }

    if (search) {
        where += `
        AND(
            s.first_name LIKE ?
            OR s.last_name LIKE ?
            OR s.admission_no LIKE ?
            OR c.certificate_no LIKE ?
        )
        `;
        params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }


    // LIMIT/OFFSET ko directly interpolate karo — mysql2 ke execute()
    // prepared-statement placeholders LIMIT/OFFSET ke saath fail karte hain.
    // Safe hai kyunki safeLimit/offset already Number() se guaranteed integers hain.
    const sql = `

    SELECT
        c.*,
        s.roll_no,
        s.admission_no,
        CONCAT(s.first_name, ' ', IFNULL(s.middle_name,''), ' ', IFNULL(s.last_name,'')) student_name,
        cm.class_name,
        sm.section_name
    FROM certificates c
    INNER JOIN student s ON s.student_id=c.student_id
    LEFT JOIN class_master cm ON cm.class_id=s.class_id
    LEFT JOIN section_master sm ON sm.section_id=s.section_id
    ${where}
    ORDER BY c.certificate_id DESC
    LIMIT ${safeLimit} OFFSET ${offset}

    `;

    const [rows] = await pool.execute(sql, params);

    const countSql = `
        SELECT COUNT(*) total
        FROM certificates c
        INNER JOIN student s ON s.student_id=c.student_id
        ${where}
    `;

    const [count] = await pool.execute(countSql, params);

    return {
        page: safePage,
        limit: safeLimit,
        total: count[0].total,
        totalPages: Math.ceil(count[0].total / safeLimit),
        data: rows
    };

};

/* ==============================
   Get By ID
================================= */

exports.getCertificateById = async (id) => {

    const sql = `

    SELECT

        c.*,

        s.*,

        cm.class_name,

        sm.section_name

    FROM certificates c

    INNER JOIN student s

        ON s.student_id=c.student_id

    LEFT JOIN class_master cm

        ON cm.class_id=s.class_id

    LEFT JOIN section_master sm

        ON sm.section_id=s.section_id

    WHERE

        c.certificate_id=?

    `;

    const [rows] = await pool.execute(sql,[

        Number(id)

    ]);

    return rows;

};

/* ==============================
   Update
================================= */

exports.updateCertificate = async (

    id,

    data

) => {

    const sql = `

    UPDATE certificates

    SET

        issue_date=?,

        remarks=?,

        status=?,

        pdf_path=?

    WHERE

        certificate_id=?

    `;

    const [result] = await pool.execute(sql,[

        data.issue_date,

        data.remarks,

        data.status,

        data.pdf_path,

        Number(id)

    ]);

    return result;

};

/* ==============================
   Delete
================================= */

exports.deleteCertificate = async (id) => {

    const sql = `

    DELETE FROM certificates

    WHERE

    certificate_id=?

    `;

    const [result] = await pool.execute(sql,[

        Number(id)

    ]);

    return result;

};

/* ==============================
   Certificate Number Exists
================================= */

exports.isCertificateNumberExists = async (certificateNo) => {

    const sql = `

    SELECT certificate_id

    FROM certificates

    WHERE certificate_no=?

    LIMIT 1

    `;

    const [rows] = await pool.execute(sql,[

        certificateNo

    ]);

    return rows.length > 0;

};


exports.getSchoolDetails = async () => {

    const sql = `
        SELECT *
        FROM school_master
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql);

    return rows[0];

};

exports.getStudentForCertificate = async (studentId) => {

    const sql = `

    SELECT

        s.student_id,
        s.admission_no,
        s.gr_no,
        s.roll_no,
        s.aadhaar,
        s.religion,
        s.category,
        s.caste,
        s.nationality,
        s.admission_date,
        s.pen_number,
        s.sub_caste,
        s.place_of_birth,
        s.mother_tongue,
        s.last_school_attended,
        s.admission_std,

        CONCAT(
            s.first_name,' ',
            IFNULL(s.middle_name,''),' ',
            IFNULL(s.last_name,'')
        ) AS student_name,

        s.gender,
        s.dob,
        s.photo_path,

        p.father_name,
        p.mother_name,

        cm.class_name,
        sm.section_name

    FROM student s

    LEFT JOIN parent p
        ON p.student_id = s.student_id

    LEFT JOIN class_master cm
        ON cm.class_id = s.class_id

    LEFT JOIN section_master sm
        ON sm.section_id = s.section_id

    WHERE s.student_id = ?

    LIMIT 1;

    `;

    const [rows] = await pool.execute(sql, [
        Number(studentId)
    ]);

    return rows;

};



exports.updatePdfPath = async (certificateId, pdfPath) => {

    const sql = `
        UPDATE certificates
        SET pdf_path = ?
        WHERE certificate_id = ?
    `;

    await pool.execute(sql, [
        pdfPath,
        Number(certificateId)
    ]);

};


exports.getCurrentAcademicYear = async () => {

    const sql = `
        SELECT year_start, year_end
        FROM academic_year
        WHERE is_current = 1
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql);

    return rows[0];

};


exports.getStudentCertificates = async (studentId) => {

    const sql = `

    SELECT

        c.certificate_id,
        c.certificate_no,
        c.certificate_type,
        c.issue_date,
        c.generated_by,
        c.pdf_path,

        CONCAT(
            s.first_name,' ',
            IFNULL(s.middle_name,''),' ',
            IFNULL(s.last_name,'')
        ) student_name,

        s.admission_no,
        s.roll_no

    FROM certificates c

    INNER JOIN student s
        ON s.student_id = c.student_id

    WHERE c.student_id = ?

    ORDER BY c.issue_date DESC;

    `;

    const [rows] = await pool.execute(sql, [
        Number(studentId)
    ]);

    return rows;

};



exports.getNextSequenceNumber = async () => {
    const sql = `SELECT COUNT(*) AS cnt FROM certificates`;
    const [rows] = await pool.execute(sql);
    return (rows[0]?.cnt || 0) + 1;
};



exports.getPdfPathById = async (id) => {

    const sql = `
        SELECT pdf_path, certificate_no
        FROM certificates
        WHERE certificate_id = ?
        LIMIT 1
    `;

    const [rows] = await pool.execute(sql, [Number(id)]);

    return rows[0];

};