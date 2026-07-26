import api from "./axios";

const BASE_URL = "/master/section-management";


/*
|--------------------------------------------------------------------------
| Get All Sections
|--------------------------------------------------------------------------
*/

export const getSectionsApi = async () => {

    const res = await api.get(BASE_URL);

    return res.data?.data ?? [];

};


/*
|--------------------------------------------------------------------------
| Get Section By Id
|--------------------------------------------------------------------------
*/

export const getSectionByIdApi = async (id) => {

    const res = await api.get(`${BASE_URL}/${id}`);

    return res.data?.data;

};


/*
|--------------------------------------------------------------------------
| Create Section
|--------------------------------------------------------------------------
*/

export const createSectionApi = async (data) => {

    const res = await api.post(
        BASE_URL,
        data
    );

    return res.data;

};


/*
|--------------------------------------------------------------------------
| Update Section
|--------------------------------------------------------------------------
*/

export const updateSectionApi = async (
    id,
    data
) => {

    const res = await api.put(
        `${BASE_URL}/${id}`,
        data
    );

    return res.data;

};


/*
|--------------------------------------------------------------------------
| Delete Section
|--------------------------------------------------------------------------
*/

export const deleteSectionApi = async (id) => {

    const res = await api.delete(
        `${BASE_URL}/${id}`
    );

    return res.data;

};


/*
|--------------------------------------------------------------------------
| Change Status
|--------------------------------------------------------------------------
*/

export const changeSectionStatusApi = async (
    id,
    is_active
) => {

    const res = await api.patch(
        `${BASE_URL}/${id}/status`,
        {
            is_active,
        }
    );

    return res.data;

};