const repository = require("./feeStructure.repository");
const db = require("../../../config/database");

exports.create = async (data) => {

    const duplicate = await repository.checkDuplicate(data);

    if (duplicate) {
        throw new Error("Fee Structure already exists.");
    }

    const id = await repository.create({
        academic_year_id: data.academic_year_id,
        class_id: data.class_id,
        fee_head_id: data.fee_head_id,
        amount: data.amount,
        due_date: data.due_date,
        installment_no: data.installment_no || 1,
        status: data.status || "Active",
    });

    return repository.getById(id);

};

exports.getAll = async (filters) => {

    return await repository.getAll(filters);

};
exports.getById = async (id) => {

    const row = await repository.getById(id);

    if (!row) {
        throw new Error("Fee Structure not found.");
    }

    return row;

};

exports.update = async (id, data) => {

    const row = await repository.getById(id);

    if (!row) {
        throw new Error("Fee Structure not found.");
    }

    await repository.update(id, data);

    return repository.getById(id);

};

exports.delete = async (id) => {

    const row = await repository.getById(id);

    if (!row) {
        throw new Error("Fee Structure not found.");
    }

    await repository.delete(id);

};


// Production Bulk Save
exports.bulkCreate = async (payload) => {

    const connection = await db.getConnection();

    try {

        await connection.beginTransaction();

        const {

            academic_year_id,

            class_id,

            due_date,

            installment_no,

            status,

            fees,

        } = payload;

        for (const fee of fees) {

            const [exists] = await connection.execute(

                `
                SELECT structure_id
                FROM fee_structure
                WHERE
                academic_year_id=?
                AND class_id=?
                AND fee_head_id=?
                AND installment_no=?
                LIMIT 1
                `,

                [

                    academic_year_id,

                    class_id,

                    fee.fee_head_id,

                    installment_no,

                ]

            );

            if (exists.length) {

                throw new Error(
                    `Duplicate Fee Head (${fee.fee_head_id})`
                );

            }

            await connection.execute(

                `
                INSERT INTO fee_structure
                (
                    academic_year_id,
                    class_id,
                    fee_head_id,
                    amount,
                    due_date,
                    installment_no,
                    status,
                    created_at,
                    updated_at
                )
                VALUES
                (
                    ?,?,?,?,?,?,?,NOW(),NOW()
                )
                `,

                [

                    academic_year_id,

                    class_id,

                    fee.fee_head_id,

                    fee.amount,

                    due_date,

                    installment_no,

                    status,

                ]

            );

        }

        await connection.commit();

        return true;

    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};