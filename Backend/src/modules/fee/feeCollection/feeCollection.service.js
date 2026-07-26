const db = require("../../../config/database");

const repository = require("./feeCollection.repository");

// ======================================
// COLLECT FEE
// ======================================

exports.collectFee = async (

    payload,

    userId

) => {

    const connection = await db.getConnection();

    try {

        console.log("========================================");
        console.log("USER ID =>", userId);
        console.log("PAYLOAD =>", payload);
        console.log("========================================");

        await connection.beginTransaction();

        // Student Fee

        const studentFee =
            await repository.getStudentFee(
                payload.student_fee_id
            );

        console.log("STUDENT FEE =>", studentFee);

        if (!studentFee) {

            throw new Error(
                "Student fee not found."
            );

        }

        const balance =
            Number(studentFee.balance_amount);

        const amount =
            Number(payload.amount);

        if (amount <= 0) {

            throw new Error(
                "Invalid amount."
            );

        }

        if (amount > balance) {

            throw new Error(
                "Amount exceeds balance."
            );

        }

        const collectionData = {

            receipt_no: "",

            student_id:
                studentFee.student_id,

            payment_date:
                payload.payment_date,

            payment_mode:
                payload.payment_mode,

            total_amount:
                amount,

         reference_no:
    payload.reference_no || null,


remarks:
    payload.remarks || null,

            collected_by:
                userId

        };

        console.log("CREATE COLLECTION DATA =>", collectionData);

        // Create Receipt

        const collectionId =
            await repository.createCollection(

                connection,

                collectionData

            );

        console.log("COLLECTION ID =>", collectionId);

        // Receipt Number

        const receiptNo =
            `RCPT-${
                new Date().getFullYear()
            }-${
                String(collectionId)
                .padStart(6, "0")
            }`;

        console.log("RECEIPT NO =>", receiptNo);

        await repository.updateReceiptNumber(

            connection,

            collectionId,

            receiptNo

        );

  const itemData = {

    collection_id:
        collectionId,

    student_fee_id:
        payload.student_fee_id,

    fee_head_id:
        payload.fee_head_id || null,

    amount_paid:
        amount

};

        console.log("COLLECTION ITEM =>", itemData);

        // Collection Item

        await repository.createCollectionItem(

            connection,

            itemData

        );

        console.log("STUDENT FEE UPDATE =>", {

            student_fee_id:
                payload.student_fee_id,

            amount

        });

        // Update Student Fee

        await repository.updateStudentFee(

            connection,

            payload.student_fee_id,

            amount

        );

        await connection.commit();

        console.log("TRANSACTION COMMIT SUCCESS");

        return await repository.getReceipt(
            collectionId
        );

    }

    catch (error) {

        console.log("========================================");
        console.log("SERVICE ERROR =>", error);
        console.log("========================================");

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};

// ======================================
// GET ALL
// ======================================

exports.getAllReceipts = async (

    filters

) => {

    const rows =
        await repository.getAll(filters);

    const total =
        await repository.countAll(filters);

    const summary =
        await repository.getSummary();

    return {

        rows,

        summary,

        page:
            Number(filters.page || 1),

        limit:
            Number(filters.limit || 10),

        total

    };

};

// ======================================
// GET RECEIPT
// ======================================

exports.getReceiptById = async (

    id

) => {

    const receipt =
        await repository.getReceipt(id);

    if (!receipt) {

        throw new Error(
            "Receipt not found."
        );

    }

    return receipt;

};

// ======================================
// DELETE RECEIPT
// ======================================

exports.deleteReceipt = async (

    id

) => {

    const connection =
        await db.getConnection();

    try {

        await connection.beginTransaction();

        const receipt =
            await repository.getReceipt(id);

        if (!receipt) {

            throw new Error(
                "Receipt not found."
            );

        }

        await repository.deleteCollectionItems(

            connection,

            id

        );

        await repository.deleteReceipt(

            connection,

            id

        );

        await connection.commit();

    }

    catch (error) {

        await connection.rollback();

        throw error;

    }

    finally {

        connection.release();

    }

};



// ======================================
// GET PENDING STUDENT FEES
// ======================================

// ======================================
// GET PENDING STUDENT FEES
// ======================================

exports.getPendingStudentFees = async (query)=>{

    const filters = {

        search:
            query.search || "",

        academic_year_id:
            query.academic_year_id || null,

        class_id:
            query.class_id || null,

        section_id:
            query.section_id || null

    };


    const data =
        await repository.getPendingStudentFees(
            filters
        );


    return data;

};