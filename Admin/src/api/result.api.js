import api from "./axios";


/*
|--------------------------------------------------------------------------
| GET ALL RESULTS
|--------------------------------------------------------------------------
*/

export const getResultsApi = async () => {

    const response = await api.get(
        "/result"
    );

    return response.data;

};



/*
|--------------------------------------------------------------------------
| GET RESULT BY ID
|--------------------------------------------------------------------------
*/

export const getResultByIdApi = async (id) => {

    const response = await api.get(
        `/result/${id}`
    );

    return response.data;

};



/*
|--------------------------------------------------------------------------
| GENERATE RESULT
|--------------------------------------------------------------------------
*/

export const generateResultApi = async (data) => {

    const response = await api.post(
        "/result/generate",
        data
    );

    return response.data;

};



/*
|--------------------------------------------------------------------------
| GET RESULT BY FILTER
|--------------------------------------------------------------------------
*/

export const getResultsByFilterApi = async (params) => {

    const response = await api.get(
        "/result/filter",
        {
            params,
        }
    );

    return response.data;

};



/*
|--------------------------------------------------------------------------
| DELETE RESULT
|--------------------------------------------------------------------------
*/

export const deleteResultApi = async (id) => {

    const response = await api.delete(
        `/result/${id}`
    );

    return response.data;

};