import api from "./axios";

const BASE_URL = "/master/class-management";

/*
|--------------------------------------------------------------------------
| Get All Classes
|--------------------------------------------------------------------------
*/

export const getClassesApi = async () => {

    const res = await api.get(BASE_URL);

    return res.data?.data ?? [];

};

/*
|--------------------------------------------------------------------------
| Get Class By Id
|--------------------------------------------------------------------------
*/

export const getClassByIdApi = async (id) => {

    const res = await api.get(`${BASE_URL}/${id}`);

    return res.data?.data;

};

/*
|--------------------------------------------------------------------------
| Create Class
|--------------------------------------------------------------------------
*/

export const createClassApi = async (data) => {

    const res = await api.post(BASE_URL, data);

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Update Class
|--------------------------------------------------------------------------
*/

export const updateClassApi = async (id, data) => {

    const res = await api.put(`${BASE_URL}/${id}`, data);

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Delete Class
|--------------------------------------------------------------------------
*/

export const deleteClassApi = async (id) => {

    const res = await api.delete(`${BASE_URL}/${id}`);

    return res.data;

};

/*
|--------------------------------------------------------------------------
| Change Class Status
|--------------------------------------------------------------------------
*/

export const changeClassStatusApi = async (id, is_active) => {

    const res = await api.patch(
        `${BASE_URL}/${id}/status`,
        { is_active }
    );

    return res.data;

};