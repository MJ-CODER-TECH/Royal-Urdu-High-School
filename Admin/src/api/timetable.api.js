import api from "./axios";

/*
/*
|--------------------------------------------------------------------------
| GET ALL TIMETABLES
|--------------------------------------------------------------------------
*/

export const getTimetablesApi = async (filters = {}) => {

    console.log("FILTERS =>", filters);

    const response = await api.get("/timetable", {
        params: filters,
    });

    return response.data.data || [];
};
/*
|--------------------------------------------------------------------------
| GET TIMETABLE BY ID
|--------------------------------------------------------------------------
*/

export const getTimetableByIdApi = async (id) => {
    const response = await api.get(`/timetable/${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE TIMETABLE
|--------------------------------------------------------------------------
*/

export const createTimetableApi = async (data) => {
    const response = await api.post("/timetable", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE TIMETABLE
|--------------------------------------------------------------------------
*/

export const updateTimetableApi = async (id, data) => {
    const response = await api.put(`/timetable/${id}`, data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE TIMETABLE
|--------------------------------------------------------------------------
*/

export const deleteTimetableApi = async (id) => {
    const response = await api.delete(`/timetable/${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeTimetableStatusApi = async (id, status) => {
    const response = await api.patch(`/timetable/${id}/status`, {
        status,
    });

    return response.data;
};


/*
|--------------------------------------------------------------------------
| GET CLASS TIMETABLE VIEW
|--------------------------------------------------------------------------
*/

export const getClassTimetableApi = async (filters) => {

    const response = await api.get(
        "/timetable/class-view",
        {
            params: filters,
        }
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| GET TEACHER TIMETABLE
|--------------------------------------------------------------------------
*/

export const getTeacherTimetableApi = async (filters = {}) => {

    const response = await api.get(
        "/timetable/teacher-view",
        {
            params: filters,
        }
    );

    return response.data;

};