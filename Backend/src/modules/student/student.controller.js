const studentService = require("./student.service");


/*
|--------------------------------------------------------------------------
| CREATE STUDENT
|--------------------------------------------------------------------------
*/

exports.createStudent = async (req, res) => {

    const studentData = {

        // Student Details

        admission_no: req.body.admission_no ?? null,
        pen_number: req.body.pen_number ?? null,
        gr_no: req.body.gr_no ?? null,
        roll_no: req.body.roll_no ?? null,

        first_name: req.body.first_name,
        middle_name: req.body.middle_name ?? null,
        last_name: req.body.last_name ?? null,

        dob: req.body.dob ?? null,
        place_of_birth: req.body.place_of_birth ?? null,

        gender: req.body.gender ?? null,

        religion: req.body.religion ?? null,
        category: req.body.category ?? null,
        caste: req.body.caste ?? null,
        sub_caste: req.body.sub_caste ?? null,

        nationality: req.body.nationality ?? null,
        mother_tongue: req.body.mother_tongue ?? null,

        aadhaar: req.body.aadhaar ?? null,
        blood_group: req.body.blood_group ?? null,

        mobile: req.body.mobile ?? null,
        email: req.body.email ?? null,

        admission_date: req.body.admission_date ?? null,

        last_school_attended:
            req.body.last_school_attended ?? null,

        admission_std:
            req.body.admission_std ?? null,


        // IMPORTANT: Academic Details

        academic_year_id:
            req.body.academic_year_id ?? null,

        class_id:
            req.body.class_id ?? null,

        section_id:
            req.body.section_id ?? null,


        // Status

        status:
            req.body.is_active === false ||
            req.body.is_active === "false"
                ? "Inactive"
                : "Active",


        // Parent Details

        father_name:
            req.body.father_name ?? null,

        father_mobile:
            req.body.father_mobile ?? null,

        father_occupation:
            req.body.father_occupation ?? null,


        mother_name:
            req.body.mother_name ?? null,

        mother_mobile:
            req.body.mother_mobile ?? null,

        mother_occupation:
            req.body.mother_occupation ?? null,


        parent_mobile:
            req.body.parent_mobile ?? null,


        guardian_name:
            req.body.guardian_name ?? null,

        guardian_mobile:
            req.body.guardian_mobile ?? null,


        annual_income:
            req.body.annual_income ?? null,

        parent_email:
            req.body.parent_email ??
            req.body.email ??
            null,

        relation:
            req.body.relation ?? "Father",


        // Address Details

        house:
            req.body.house ?? null,

        street:
            req.body.street ?? null,

        village:
            req.body.village ?? null,

        city:
            req.body.city ?? null,

        taluka:
            req.body.taluka ?? null,

        district:
            req.body.district ?? null,

        state:
            req.body.state ?? null,

        country:
            req.body.country ?? null,

        pincode:
            req.body.pincode ?? null,


        // Student Photo

        photo_path: req.file
            ? `uploads/photos/${req.file.filename}`
            : null,


        // Logged-in User

        created_by:
            req.user?.id ?? null,

        updated_by:
            req.user?.id ?? null,

    };


    const student =
        await studentService.createStudent(
            studentData
        );


    res.status(201).json({

        success: true,

        message:
            "Student created successfully.",

        data:
            student,

    });

};


/*
|--------------------------------------------------------------------------
| GET ALL STUDENTS
|--------------------------------------------------------------------------
*/

exports.getAllStudents = async (
    req,
    res
) => {

    const students =
        await studentService.getAllStudents();


    res.status(200).json({

        success: true,

        count:
            students.length,

        data:
            students,

    });

};


/*
|--------------------------------------------------------------------------
| GET STUDENT BY ID
|--------------------------------------------------------------------------
*/

exports.getStudentById = async (
    req,
    res
) => {

    const {
        studentId
    } = req.params;


    const student =
        await studentService.getStudentById(
            studentId
        );


    res.status(200).json({

        success: true,

        data:
            student,

    });

};


/*
|--------------------------------------------------------------------------
| GET STUDENTS WITH FILTER + PAGINATION
|--------------------------------------------------------------------------
*/

exports.getStudents = async (
    req,
    res
) => {

    const result =
        await studentService.getStudents(
            req.query
        );


    res.status(200).json({

        success: true,

        ...result,

    });

};


/*
|--------------------------------------------------------------------------
| UPDATE STUDENT
|--------------------------------------------------------------------------
*/

exports.updateStudent = async (
    req,
    res
) => {

    const {
        studentId
    } = req.params;


    const studentData = {

        // Student Details

        admission_no:
            req.body.admission_no ?? null,

        pen_number:
            req.body.pen_number ?? null,

        gr_no:
            req.body.gr_no ?? null,

        roll_no:
            req.body.roll_no ?? null,


        first_name:
            req.body.first_name ?? null,

        middle_name:
            req.body.middle_name ?? null,

        last_name:
            req.body.last_name ?? null,


        dob:
            req.body.dob ?? null,

        place_of_birth:
            req.body.place_of_birth ?? null,


        gender:
            req.body.gender ?? null,


        religion:
            req.body.religion ?? null,

        category:
            req.body.category ?? null,

        caste:
            req.body.caste ?? null,

        sub_caste:
            req.body.sub_caste ?? null,


        nationality:
            req.body.nationality ?? null,

        mother_tongue:
            req.body.mother_tongue ?? null,


        aadhaar:
            req.body.aadhaar ?? null,

        blood_group:
            req.body.blood_group ?? null,


        mobile:
            req.body.mobile ?? null,

        email:
            req.body.email ?? null,


        admission_date:
            req.body.admission_date ?? null,

        last_school_attended:
            req.body.last_school_attended ?? null,

        admission_std:
            req.body.admission_std ?? null,


        // IMPORTANT

        academic_year_id:
            req.body.academic_year_id ?? null,

        class_id:
            req.body.class_id ?? null,

        section_id:
            req.body.section_id ?? null,


        // Status

        status:
            req.body.is_active === false ||
            req.body.is_active === "false"
                ? "Inactive"
                : "Active",


        // Parent Details

        father_name:
            req.body.father_name ?? null,

        father_mobile:
            req.body.father_mobile ?? null,

        father_occupation:
            req.body.father_occupation ?? null,


        mother_name:
            req.body.mother_name ?? null,

        mother_mobile:
            req.body.mother_mobile ?? null,

        mother_occupation:
            req.body.mother_occupation ?? null,


        parent_mobile:
            req.body.parent_mobile ?? null,


        guardian_name:
            req.body.guardian_name ?? null,

        guardian_mobile:
            req.body.guardian_mobile ?? null,


        annual_income:
            req.body.annual_income ?? null,

        parent_email:
            req.body.parent_email ??
            req.body.email ??
            null,

        relation:
            req.body.relation ?? "Father",


        // Address

        house:
            req.body.house ?? null,

        street:
            req.body.street ?? null,

        village:
            req.body.village ?? null,

        city:
            req.body.city ?? null,

        taluka:
            req.body.taluka ?? null,

        district:
            req.body.district ?? null,

        state:
            req.body.state ?? null,

        country:
            req.body.country ?? null,

        pincode:
            req.body.pincode ?? null,


        // Photo

        photo_path: req.file
            ? `uploads/photos/${req.file.filename}`
            : (
                req.body.existing_photo_path
                ?? null
            ),


        updated_by:
            req.user?.id ?? null,

    };


    const result =
        await studentService.updateStudent(

            studentId,

            studentData

        );


    res.status(200).json({

        success: true,

        message:
            "Student updated successfully.",

        data:
            result,

    });

};


/*
|--------------------------------------------------------------------------
| DELETE STUDENT
|--------------------------------------------------------------------------
*/

exports.deleteStudent = async (
    req,
    res
) => {

    const {
        studentId
    } = req.params;


    const result =
        await studentService.deleteStudent(
            studentId
        );


    res.status(200).json({

        success: true,

        data:
            result,

    });

};


/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.changeStatus = async (
    req,
    res
) => {

    const {
        studentId
    } = req.params;


    const {
        is_active
    } = req.body;


    const status =

        is_active === true ||
        is_active === "true"

            ? "Active"

            : "Inactive";


    const result =
        await studentService.updateStudentStatus(

            studentId,

            status

        );


    res.status(200).json({

        success: true,

        data:
            result,

    });

};