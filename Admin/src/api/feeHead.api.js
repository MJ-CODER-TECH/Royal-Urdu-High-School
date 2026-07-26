import api from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL
|--------------------------------------------------------------------------
*/

export const getFeeHeadsApi = async (params) => {

    const { data } = await api.get(
        "/fee-heads",
        {
            params
        }
    );

    return data;

};


/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export const getFeeHeadByIdApi = async (id) => {

    const { data } = await api.get(
        `/fee-heads/${id}`
    );

    return data;

};


/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createFeeHeadApi = async (payload) => {

    const { data } = await api.post(
        "/fee-heads",
        payload
    );

    return data;

};


/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateFeeHeadApi = async (
    id,
    payload
) => {

    const { data } = await api.put(
        `/fee-heads/${id}`,
        payload
    );

    return data;

};


/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteFeeHeadApi = async (id) => {

    const { data } = await api.delete(
        `/fee-heads/${id}`
    );

    return data;

};