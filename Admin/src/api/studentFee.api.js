import api from "./axios";

const BASE = "/fee-student";

/*
|--------------------------------------------------------------------------
| GET STUDENT FEES
|--------------------------------------------------------------------------
*/

export const getStudentFeesApi = async (filters) => {

    const params = {
        page: filters.page,
        limit: filters.limit,
    };

    if (filters.search)
        params.search = filters.search;

    if (filters.class_id)
        params.class_id = filters.class_id;

    if (filters.academic_year_id)
        params.academic_year_id = filters.academic_year_id;

    if (filters.status)
        params.status = filters.status;

    const res = await api.get(BASE, {
        params,
    });

    return res.data;
};

/*
|--------------------------------------------------------------------------
| GET STUDENT FEE BY ID
|--------------------------------------------------------------------------
*/

export const getStudentFeeByIdApi = async (id) => {

    const res = await api.get(`${BASE}/${id}`);

    return res.data;
};

/*
|--------------------------------------------------------------------------
| ASSIGN CLASS FEES
|--------------------------------------------------------------------------
*/

export const assignClassFeeApi = async (data) => {

    const res = await api.post(`${BASE}/assign-class`, data);

    return res.data;
};

/*
|--------------------------------------------------------------------------
| DELETE STUDENT FEE
|--------------------------------------------------------------------------
*/

export const deleteStudentFeeApi = async (id) => {

    const res = await api.delete(`${BASE}/${id}`);

    return res.data;
};


export const changeStudentStatusApi = async (id, isActive) => {

    const res = await api.patch(
        `${BASE}/${id}/status`,
        {
            is_active: isActive,
        }
    );

    return res.data;

};