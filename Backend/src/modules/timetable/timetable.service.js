const repository = require("./timetable.repository");

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

exports.getAll = async (filters) => {
    return await repository.findAll(filters);
};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

exports.getById = async (id) => {

    const timetable = await repository.findById(id);

    if (!timetable) {
        throw new Error("Timetable not found.");
    }

    return timetable;

};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

exports.create = async (data) => {

    const {
        academic_year_id,
        class_id,
        section_id,
        subject_id,
        teacher_id,
        day_of_week,
        period_no,
        start_time,
        end_time,
        room,
    } = data;

    if (
        !academic_year_id ||
        !class_id ||
        !section_id ||
        !subject_id ||
        !day_of_week ||
        !period_no ||
        !start_time ||
        !end_time
    ) {
        throw new Error("Please fill all required fields.");
    }

    // Teacher Conflict
    if (
        await repository.checkTeacherConflict(
            academic_year_id,
            teacher_id,
            day_of_week,
            period_no
        )
    ) {
        throw new Error(
            "Teacher is already assigned for this period."
        );
    }

    // Class Conflict
    if (
        await repository.checkClassConflict(
            academic_year_id,
            class_id,
            section_id,
            day_of_week,
            period_no
        )
    ) {
        throw new Error(
            "This class already has a timetable for this period."
        );
    }

    // Room Conflict
    if (
        await repository.checkRoomConflict(
            academic_year_id,
            room,
            day_of_week,
            period_no
        )
    ) {
        throw new Error(
            "Room is already occupied during this period."
        );
    }

    return await repository.create(data);

};
/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

exports.update = async (id, data) => {

    const timetable = await repository.findById(id);

    if (!timetable) {
        throw new Error("Timetable not found.");
    }

    const {
        academic_year_id,
        class_id,
        section_id,
        teacher_id,
        day_of_week,
        period_no,
        room,
    } = data;

    // Teacher Conflict
    if (
        await repository.checkTeacherConflict(
            academic_year_id,
            teacher_id,
            day_of_week,
            period_no,
            id
        )
    ) {
        throw new Error(
            "Teacher is already assigned for this period."
        );
    }

    // Class Conflict
    if (
        await repository.checkClassConflict(
            academic_year_id,
            class_id,
            section_id,
            day_of_week,
            period_no,
            id
        )
    ) {
        throw new Error(
            "This class already has a timetable for this period."
        );
    }

    // Room Conflict
    if (
        await repository.checkRoomConflict(
            academic_year_id,
            room,
            day_of_week,
            period_no,
            id
        )
    ) {
        throw new Error(
            "Room is already occupied during this period."
        );
    }

    await repository.update(id, data);

};
/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

exports.remove = async (id) => {

    const timetable = await repository.findById(id);

    if (!timetable) {
        throw new Error("Timetable not found.");
    }

    await repository.remove(id);

};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

exports.changeStatus = async (id, status) => {

    const timetable = await repository.findById(id);

    if (!timetable) {
        throw new Error("Timetable not found.");
    }

    await repository.changeStatus(id, status);

};




/*
|--------------------------------------------------------------------------
| CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

exports.getClassTimetable = async(filters)=>{


    const {
        academic_year_id,
        class_id,
        section_id
    } = filters;


    if(
        !academic_year_id ||
        !class_id ||
        !section_id
    ){

        throw new Error(
            "Academic year, class and section required."
        );

    }


    return await repository.findClassTimetable(
        filters
    );

};



/*
|--------------------------------------------------------------------------
| TEACHER TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

exports.getTeacherTimetable = async(filters)=>{


    const {
        academic_year_id,
        teacher_id
    } = filters;



    if(
        !academic_year_id ||
        !teacher_id
    ){

        throw new Error(
            "Academic year and teacher required."
        );

    }



    return await repository.findTeacherTimetable(
        filters
    );

};