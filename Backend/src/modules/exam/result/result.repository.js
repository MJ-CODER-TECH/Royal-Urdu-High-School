const db = require("../../../config/database");

const query = require("./result.query");


exports.createResult = async(data)=>{

const [result] =
await db.query(
query.CREATE,
data
);


return result;

};



exports.getAllResults = async()=>{

const [rows]=
await db.query(
query.GET_ALL
);

return rows;

};



exports.getResultById = async(id)=>{


const [rows]=
await db.query(
query.GET_BY_ID,
[id]
);


return rows[0];

};



exports.getResultsByFilter = async(
exam_id,
class_id,
section_id
)=>{


const [rows]=
await db.query(
query.GET_BY_FILTER,
[
exam_id,
class_id,
section_id
]
);


return rows;

};



exports.deleteResult = async(id)=>{

const [result]=
await db.query(
query.DELETE,
[id]
);


return result;

};


exports.getMarksForResult = async(
academic_year_id,
class_id,
section_id,
exam_id
)=>{


const [rows]=await db.query(

query.GET_MARKS_FOR_RESULT,

[
academic_year_id,
class_id,
section_id,
exam_id
]

);


return rows;


};




exports.checkExistingResult = async(
    student_id,
    exam_id
)=>{


const [rows] = await db.query(

`
SELECT result_id

FROM results

WHERE student_id = ?
AND exam_id = ?

`,

[
    student_id,
    exam_id
]

);


return rows.length > 0
    ? rows[0]
    : null;


};




exports.updateResult = async(

    student_id,
    exam_id,
    total_marks,
    obtained_marks,
    percentage,
    grade,
    status

)=>{


const [result] = await db.query(

`
UPDATE results

SET

total_marks = ?,
obtained_marks = ?,
percentage = ?,
grade = ?,
result_status = ?,
updated_at = NOW()


WHERE student_id = ?
AND exam_id = ?

`,

[

total_marks,
obtained_marks,
percentage,
grade,
status,

student_id,
exam_id

]

);


return result;


};