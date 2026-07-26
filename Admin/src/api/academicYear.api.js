import api from "./axios";


const URL = "/master/academic-year-management";



/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export const getAcademicYearsApi = async () => {

    const res = await api.get(URL);

    return res.data?.data ?? res.data;

};




/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export const getAcademicYearByIdApi = async (id) => {

    const res = await api.get(
        `${URL}/${id}`
    );

    return res.data?.data ?? res.data;

};




/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createAcademicYearApi = async (data) => {

    const res = await api.post(
        URL,
        data
    );

    return res.data;

};




/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateAcademicYearApi = async (
    id,
    data
) => {

    const res = await api.put(
        `${URL}/${id}`,
        data
    );

    return res.data;

};




/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteAcademicYearApi = async (id) => {

    const res = await api.delete(
        `${URL}/${id}`
    );

    return res.data;

};




/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

export const changeAcademicYearStatusApi = async (
    id,
    is_active
) => {

    const res = await api.patch(

        `${URL}/${id}/status`,

        {
            is_active
        }

    );


    return res.data;

};