const db = require("../../../config/database");
const repository = require("./studentFee.repository");


exports.assignClass = async (payload) => {

    console.log("===== ASSIGN CLASS PAYLOAD =====");
    console.log(payload);


    const connection = await db.getConnection();


    try {

        await connection.beginTransaction();



        const {
            academic_year_id,
            class_id,
            discount = 0,
            fine = 0,
            previous_balance = 0,
        } = payload;



        console.log({
            academic_year_id,
            class_id,
            discount,
            fine,
            previous_balance
        });



        // GET STUDENTS

        const students =
            await repository.getClassStudents(
                class_id
            );


        console.log(
            "STUDENTS:",
            students
        );


        if(!students.length){

            throw new Error(
                "No students found for this class"
            );

        }




        // GET FEE STRUCTURE


        const feeStructure =
            await repository.getFeeStructure(
                academic_year_id,
                class_id
            );


        console.log(
            "FEE STRUCTURE:",
            feeStructure
        );



        if(!feeStructure.length){

            throw new Error(
                "Fee structure not found"
            );

        }




        // TOTAL FEE


        const totalFee =
            feeStructure.reduce(
                (sum,item)=>
                    sum + Number(item.amount),
                0
            );




        const payableAmount =

            Number(totalFee)
            -
            Number(discount)
            +
            Number(fine)
            +
            Number(previous_balance);





        // ASSIGN STUDENT FEE


      // ASSIGN STUDENT FEE


// ASSIGN STUDENT FEE


for (const student of students) {

    const exists = await repository.checkAlreadyAssigned(
        student.student_id,
        academic_year_id
    );

    // -----------------------------
    // Existing Student Fee
    // -----------------------------
    if (exists) {

        const oldItems =
            await repository.getStudentFeeItems(
                connection,
                exists.student_fee_id
            );

        const oldFeeHeads =
            oldItems.map(item => Number(item.fee_head_id));

        for (const fee of feeStructure) {

            if (!oldFeeHeads.includes(Number(fee.fee_head_id))) {

                await repository.insertStudentFeeItem(
                    connection,
                    exists.student_fee_id,
                    fee.fee_head_id,
                    fee.amount
                );

            }

        }

       // Existing fee head ids from latest fee structure
const feeHeadIds = feeStructure.map(
    item => Number(item.fee_head_id)
);

// Remove deleted fee heads
await repository.deleteRemovedStudentFeeItems(
    connection,
    exists.student_fee_id,
    feeHeadIds
);

// Update totals
await repository.updateStudentFeeTotals(
    connection,
    exists.student_fee_id,
    totalFee,
    payableAmount
);

continue;

    }

    // -----------------------------
    // New Student
    // -----------------------------
    const studentFeeId =
        await repository.assignStudentFee(
            connection,
            {
                student_id: student.student_id,
                academic_year_id,
                class_id,
                total_fee: totalFee,
                discount,
                fine,
                previous_balance,
                payable_amount: payableAmount
            }
        );

    await repository.assignStudentFeeItems(
        connection,
        studentFeeId,
        feeStructure
    );

}


        await connection.commit();



        return {

            success:true,

            message:
            "Fees assigned successfully"

        };



    }
    catch(error){


        await connection.rollback();

        throw error;


    }
    finally{


        connection.release();


    }


};







exports.getStudentFees = async(filters)=>{


    const result =
        await repository.getAll(filters);



    return {


        rows:
        result.rows,


        page:
        Number(filters.page || 1),


        limit:
        Number(filters.limit || 10),


        total:
        result.total,


        summary:
        result.summary


    };


};






exports.getStudentFeeById = async(id)=>{


    const row =
        await repository.getById(id);



    if(!row){

        throw new Error(
            "Student fee not found"
        );

    }


    return row;


};





exports.deleteStudentFee = async(id)=>{


    const row =
        await repository.getById(id);



    if(!row){

        throw new Error(
            "Student fee not found"
        );

    }



    await repository.delete(id);


};