const repository = require("./examSubject.repository");

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

exports.create = async (data) => {

 const duplicate = await repository.checkDuplicate(
    data.exam_id,
    data.class_id,
    data.subject_id
);

    if (duplicate) {
        throw new Error(
            "Exam Subject already exists."
        );
    }

  return await repository.create([
    data.exam_id,
    data.class_id,
    data.subject_id,
    data.max_marks,
    data.pass_marks,
]);
};

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.getAll = async () => {

    return await repository.getAll();

};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

exports.getById = async (id) => {

    const examSubject = await repository.getById(id);

    if (!examSubject) {
        throw new Error(
            "Exam Subject not found."
        );
    }

    return examSubject;
};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.update = async (id, data) => {

    const current = await repository.getById(id);

    if (!current) {
        throw new Error(
            "Exam Subject not found."
        );
    }


    const duplicate = await repository.checkDuplicate(
        data.exam_id,
        data.class_id,
        data.subject_id,
        id
    );


    if (duplicate) {

        throw new Error(
            "Exam Subject already exists."
        );

    }



    return await repository.update(id, [

        data.exam_id,

        data.class_id,

        data.subject_id,

        data.max_marks,

        data.pass_marks,

    ]);

};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

exports.delete = async (id) => {

    const current = await repository.getById(id);

    if (!current) {
        throw new Error(
            "Exam Subject not found."
        );
    }

    return await repository.delete(id);
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.changeStatus = async (
    id,
    status
) => {

    const current = await repository.getById(id);

    if (!current) {
        throw new Error(
            "Exam Subject not found."
        );
    }

    return await repository.changeStatus(
        id,
        status
    );
};