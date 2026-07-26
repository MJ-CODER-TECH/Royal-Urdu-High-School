const service = require("./feeCollection.service");


// ======================================
// COLLECT FEE
// ======================================

exports.collectFee = async (req, res, next) => {

    console.log("================================");
    console.log("REQ USER =>", req.user);
    console.log("REQ BODY =>", req.body);
    console.log("================================");


    try {


     const result = await service.collectFee(
    req.body,
    req.user.userId
);

        return res.status(201).json({

            success: true,

            message: "Fee collected successfully.",

            data: result,

        });


    } 
    catch (error) {


        console.log(
            "CONTROLLER ERROR =>",
            error
        );


        next(error);


    }

};




// ======================================
// GET ALL RECEIPTS
// ======================================

exports.getAllReceipts = async (
    req,
    res,
    next
) => {


    try {


        const result =
            await service.getAllReceipts(
                req.query
            );



        return res.status(200).json({


            success:true,


            data:result.rows,


            pagination:{


                page:result.page,


                limit:result.limit,


                total:result.total,


                totalPages:Math.ceil(
                    result.total / result.limit
                )

            },


            summary:result.summary


        });


    }
    catch(error){


        next(error);


    }


};





// ======================================
// GET RECEIPT BY ID
// ======================================

exports.getReceiptById = async (
    req,
    res,
    next
)=>{


    try{


        console.log(
            "RECEIPT ID =>",
            req.params.id
        );


        const data =
            await service.getReceiptById(
                req.params.id
            );



        return res.json({


            success:true,


            data


        });



    }
    catch(error){


        next(error);


    }


};






// ======================================
// DELETE RECEIPT
// ======================================

exports.deleteReceipt = async (
    req,
    res,
    next
)=>{


    try{


        await service.deleteReceipt(
            req.params.id
        );



        return res.status(200).json({


            success:true,


            message:
            "Receipt deleted successfully."


        });



    }
    catch(error){


        next(error);


    }


};






// ======================================
// GET PENDING STUDENT FEES
// ======================================

exports.getPendingStudentFees = async (
    req,
    res,
    next
)=>{


    try{


        const data =
            await service.getPendingStudentFees(
                req.query
            );



        return res.status(200).json({


            success:true,


            data


        });



    }
    catch(error){


        console.log(
            "PENDING FEE ERROR =>",
            error
        );


        next(error);


    }


};