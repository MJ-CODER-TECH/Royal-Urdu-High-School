/*
|--------------------------------------------------------------------------
| Note
|--------------------------------------------------------------------------
| Ye strings ab WhatsApp ko seedhe NAHI bheji jaatin (production me
| Meta-approved templates use hoti hain — whatsapp.service.js dekho).
|
| Ye sirf `whatsapp_log.message` column me human-readable audit trail
| save karne ke liye use hoti hain, taaki aap DB me dekh sako ki
| parent ko asal me kya content bheja gaya tha.
|--------------------------------------------------------------------------
*/

exports.admissionConfirmation = (student) => {

    return `Dear Parent,

Your child ${student.student_name} has been successfully admitted to ${student.school_name}.

Admission No : ${student.admission_no}

Class : ${student.class_name}

Section : ${student.section_name}

Thank you.

${student.school_name}`;

};


exports.studentAbsentAlert = (student, attendanceDate) => {

    return `Dear Parent,

Your child ${student.student_name}

(Class ${student.class_name} - ${student.section_name})

was marked ABSENT on ${attendanceDate}.

If this is incorrect, kindly contact the school office.

Regards,

${student.school_name}`;

};


exports.certificateGenerated = (student, certificateType) => {

    return `Dear Parent,

${certificateType} has been generated successfully for

${student.student_name}

Admission No : ${student.admission_no}

Please find the attached PDF.

Regards,

${student.school_name}`;

};