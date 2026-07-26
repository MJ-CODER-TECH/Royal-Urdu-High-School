import api from "./axios";

/*
|--------------------------------------------------------------------------
| GET
|--------------------------------------------------------------------------
*/

export const getFeeStructuresApi = async (params) => {

    const { data } = await api.get("/fee-structure", { params })

    return data;

};

/*
|--------------------------------------------------------------------------
| GET BY ID
|--------------------------------------------------------------------------
*/

export const getFeeStructureByIdApi = async (id) => {

    const { data } = await api.get(
        `/fee-structure/${id}`
    );

    return data;

};

/*
|--------------------------------------------------------------------------
| CREATE
|--------------------------------------------------------------------------
*/

export const createFeeStructureApi = async (payload) => {

    const { data } = await api.post(
        "/fee-structure",
        payload
    );

    return data;

};

/*
|--------------------------------------------------------------------------
| UPDATE
|--------------------------------------------------------------------------
*/

export const updateFeeStructureApi = async (
    id,
    payload
) => {

    const { data } = await api.put(
        `/fee-structure/${id}`,
        payload
    );

    return data;

};

/*
|--------------------------------------------------------------------------
| DELETE
|--------------------------------------------------------------------------
*/

export const deleteFeeStructureApi = async (id) => {

    const { data } = await api.delete(
        `/fee-structure/${id}`
    );

    return data;

};