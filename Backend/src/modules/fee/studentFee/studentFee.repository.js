const db = require("../../../config/database");

const query = require("./studentFee.query");





exports.assignStudentFee = async(
    connection,
    data
)=>{


console.log(
"===== INSERT STUDENT FEE ====="
);


console.log(data);



const [result] =

await connection.execute(

query.CREATE_STUDENT_FEE,

[

data.student_id,

data.academic_year_id,

data.class_id,

data.fee_head_id || null,

data.total_fee,

data.discount,

data.fine,

data.previous_balance,

data.payable_amount,

0,

data.payable_amount,

"Pending"

]

);



return result.insertId;


};


exports.assignStudentFeeItems = async (
    connection,
    student_fee_id,
    items
)=>{


for(const item of items){


await connection.execute(

query.CREATE_STUDENT_FEE_ITEM,

[

student_fee_id,

item.fee_head_id,

item.amount

]

);


}


};






exports.getClassStudents = async(class_id)=>{


const [rows]=

await db.execute(

query.GET_CLASS_STUDENTS,

[
class_id
]

);


return rows;


};






exports.getFeeStructure = async(
academic_year_id,
class_id
)=>{


const [rows]=

await db.execute(

query.GET_FEE_STRUCTURE,

[

academic_year_id,

class_id

]

);



return rows;


};







exports.checkAlreadyAssigned = async(
student_id,
academic_year_id
)=>{


const [rows]=

await db.execute(

query.CHECK_ALREADY_ASSIGNED,

[

student_id,

academic_year_id

]

);



return rows[0];


};






exports.getAll = async(filters={})=>{


const page =
Number(filters.page)||1;


const limit =
Number(filters.limit)||10;


const offset =
(page-1)*limit;



const search =
filters.search?
filters.search.trim():
null;



const keyword =
search?
`%${search}%`
:null;




const class_id =
filters.class_id?
Number(filters.class_id):
null;



const academic_year_id =
filters.academic_year_id?
Number(filters.academic_year_id):
null;



const status =
filters.status?
filters.status:
null;





const [rows]=

await db.execute(

query.GET_ALL(limit,offset),

[

search,
keyword,
keyword,

class_id,
class_id,

academic_year_id,
academic_year_id,

status,
status

]


);




const [[count]]=

await db.execute(

query.COUNT_ALL,

[

search,
keyword,
keyword,

class_id,
class_id,

academic_year_id,
academic_year_id,

status,
status

]

);



return {

rows,

total:
Number(count.total||0)

};


};







exports.getById = async(id)=>{


const [rows] = await db.execute(

query.GET_ONE,

[id]

);



if(!rows[0]){

    return null;

}



const [items] = await db.execute(

query.GET_ONE_ITEMS,

[id]

);



return {

    ...rows[0],

    items

};


};




exports.delete = async(id)=>{


await db.execute(

query.DELETE_ONE,

[id]

);


};



exports.getStudentFeeItems = async (
    connection,
    student_fee_id
) => {

    const [rows] = await connection.execute(
        `
        SELECT fee_head_id
        FROM student_fee_items
        WHERE student_fee_id = ?
        `,
        [student_fee_id]
    );

    return rows;
};


exports.insertStudentFeeItem = async (
    connection,
    student_fee_id,
    fee_head_id,
    amount
) => {

    await connection.execute(
        `
        INSERT INTO student_fee_items
        (
            student_fee_id,
            fee_head_id,
            amount
        )
        VALUES
        (
            ?,?,?
        )
        `,
        [
            student_fee_id,
            fee_head_id,
            amount
        ]
    );

};



exports.updateStudentFeeTotals = async (
    connection,
    student_fee_id,
    total_fee,
    payable_amount
) => {

    await connection.execute(
        `
        UPDATE student_fees

        SET

            total_fee = ?,

            payable_amount = ?,

            balance_amount = payable_amount - paid_amount,

            updated_at = NOW()

        WHERE student_fee_id = ?
        `,
        [
            total_fee,
            payable_amount,
            student_fee_id
        ]
    );

};




exports.deleteRemovedStudentFeeItems = async (
    connection,
    student_fee_id,
    feeHeadIds
) => {

    if (!feeHeadIds.length) {

        await connection.execute(
            `
            DELETE FROM student_fee_items
            WHERE student_fee_id = ?
            `,
            [student_fee_id]
        );

        return;
    }

    const placeholders = feeHeadIds.map(() => "?").join(",");

    await connection.execute(
        `
        DELETE FROM student_fee_items
        WHERE student_fee_id = ?
        AND fee_head_id NOT IN (${placeholders})
        `,
        [
            student_fee_id,
            ...feeHeadIds
        ]
    );

};