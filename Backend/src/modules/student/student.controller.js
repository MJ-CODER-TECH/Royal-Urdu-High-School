const studentService = require("./student.service");

exports.createStudent = async (req, res) => {
  const studentData = {
    admission_no: req.body.admission_no,
    pen_number: req.body.pen_number,
    gr_no: req.body.gr_no,
    roll_no: req.body.roll_no,

    first_name: req.body.first_name,
    middle_name: req.body.middle_name,
    last_name: req.body.last_name,

    sub_caste: req.body.sub_caste, // ⭐ NEW
    admission_std: req.body.admission_std,
    parent_mobile: req.body.parent_mobile, // ✅ Add this

    dob: req.body.dob,
    gender: req.body.gender,

    religion: req.body.religion,
    category: req.body.category,
    caste: req.body.caste,
    nationality: req.body.nationality,

    aadhaar: req.body.aadhaar,

    blood_group: req.body.blood_group,

    // NEW
    mother_tongue: req.body.mother_tongue,
    place_of_birth: req.body.place_of_birth,

    mobile: req.body.mobile,
    email: req.body.email,

    admission_date: req.body.admission_date,
    last_school_attended: req.body.last_school_attended,

    class_id: req.body.class_id,
    section_id: req.body.section_id,

    status: req.body.is_active === "true" ? "Active" : "Inactive",

    father_name: req.body.father_name,
    mother_name: req.body.mother_name,
    guardian_name: req.body.guardian_name,

    parent_email: req.body.email,

    father_mobile: req.body.father_mobile,
    father_occupation: req.body.father_occupation,

    mother_mobile: req.body.mother_mobile,
    mother_occupation: req.body.mother_occupation,

    guardian_mobile: req.body.guardian_mobile,

    // Address fields — NOTE: house/village/taluka/country ab
    // request se poore aa rahe hain
    house: req.body.house,
    // ✅ sahi
    street: req.body.street,
    village: req.body.village,
    city: req.body.city,
    taluka: req.body.taluka,
    district: req.body.district,
    state: req.body.state,
    country: req.body.country,
    pincode: req.body.pincode,

    photo_path: req.file ? req.file.path : null,

    // NEW — logged-in user se aana chahiye, form se nahi
    created_by: req.user?.id ?? null,
    updated_by: req.user?.id ?? null,
  };

  const student = await studentService.createStudent(studentData);

  res.status(201).json({
    success: true,
    data: student,
  });
};

exports.getAllStudents = async (req, res) => {
  const students = await studentService.getAllStudents();

  res.status(200).json({
    success: true,

    count: students.length,

    data: students,
  });
};

exports.getStudentById = async (req, res) => {
  const { studentId } = req.params;

  const student = await studentService.getStudentById(studentId);

  res.status(200).json({
    success: true,
    data: student,
  });
};

exports.getStudents = async (req, res) => {
  const result = await studentService.getStudents(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
};

exports.updateStudent = async (req, res) => {

    const { studentId } = req.params;

    const studentData = {
        admission_no: req.body.admission_no ?? null,
        pen_number: req.body.pen_number ?? null,
        gr_no: req.body.gr_no ?? null,
        roll_no: req.body.roll_no ?? null,

        first_name: req.body.first_name ?? null,
        middle_name: req.body.middle_name ?? null,
        last_name: req.body.last_name ?? null,

        dob: req.body.dob ?? null,
        gender: req.body.gender ?? null,

        religion: req.body.religion ?? null,
        category: req.body.category ?? null,
        caste: req.body.caste ?? null,
        nationality: req.body.nationality ?? null,

        aadhaar: req.body.aadhaar ?? null,

        blood_group: req.body.blood_group ?? null,

        mother_tongue: req.body.mother_tongue ?? null,
        place_of_birth: req.body.place_of_birth ?? null,

        mobile: req.body.mobile ?? null,
        email: req.body.email ?? null,
        parent_mobile: req.body.parent_mobile ?? null,

        admission_date: req.body.admission_date ?? null,
        last_school_attended: req.body.last_school_attended ?? null,
        admission_std: req.body.admission_std ?? null,

        class_id: req.body.class_id ?? null,
        section_id: req.body.section_id ?? null,

        status: req.body.is_active === "true" ? "Active" : "Inactive",

        father_name: req.body.father_name ?? null,
        mother_name: req.body.mother_name ?? null,
        guardian_name: req.body.guardian_name ?? null,

        parent_email: req.body.email ?? null,

        father_mobile: req.body.father_mobile ?? null,
        father_occupation: req.body.father_occupation ?? null,

        mother_mobile: req.body.mother_mobile ?? null,
        mother_occupation: req.body.mother_occupation ?? null,

        guardian_mobile: req.body.guardian_mobile ?? null,

        sub_caste: req.body.sub_caste ?? null,

        house: req.body.house ?? null,
        street: req.body.street ?? null,
        village: req.body.village ?? null,
        city: req.body.city ?? null,
        taluka: req.body.taluka ?? null,
        district: req.body.district ?? null,
        state: req.body.state ?? null,
        country: req.body.country ?? null,
        pincode: req.body.pincode ?? null,

        photo_path: req.file
            ? req.file.path
            : (req.body.existing_photo_path ?? null),

        updated_by: req.user?.id ?? null,
    };

    const result = await studentService.updateStudent(
        studentId,
        studentData
    );

    res.status(200).json({
        success: true,
        data: result
    });

};

exports.deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  const result = await studentService.deleteStudent(studentId);

  res.status(200).json({
    success: true,

    data: result,
  });
};



exports.changeStatus = async (req, res) => {

    const { studentId } = req.params;
    const { is_active } = req.body;

    const status = is_active === true || is_active === "true"
        ? "Active"
        : "Inactive";

    const result = await studentService.updateStudentStatus(
        studentId,
        status
    );

    res.status(200).json({
        success: true,
        data: result
    });

};