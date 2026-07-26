import api from "./axios";

const BASE = "/students";

/*
|--------------------------------------------------------------------------
| GET STUDENTS
|--------------------------------------------------------------------------
*/

export const getStudentsApi = async (params) => {
    const res = await api.get(BASE, {
        params,
    });

    return res.data;
};

/*
|--------------------------------------------------------------------------
| GET STUDENT
|--------------------------------------------------------------------------
*/

export const getStudentByIdApi = async (id) => {
    const res = await api.get(`${BASE}/${id}`);

    return res.data;
};

/*
|--------------------------------------------------------------------------
| CREATE STUDENT
|--------------------------------------------------------------------------
*/

export const createStudentApi = async (data) => {
    const res = await api.post(BASE, data);

    return res.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE STUDENT
|--------------------------------------------------------------------------
*/

export const updateStudentApi = async (id, data) => {
    const res = await api.put(`${BASE}/${id}`, data);

    return res.data;
};

/*
|--------------------------------------------------------------------------
| DELETE STUDENT
|--------------------------------------------------------------------------
*/

export const deleteStudentApi = async (id) => {
    const res = await api.delete(`${BASE}/${id}`);

    return res.data;
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeStudentStatusApi = async (
    id,
    isActive
) => {
    const res = await api.patch(
        `${BASE}/${id}/status`,
        {
            is_active: isActive,
        }
    );

    return res.data;
};