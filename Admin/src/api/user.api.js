import api from "./axios";

const BASE = "/users";

/*
|--------------------------------------------------------------------------
| Roles
|--------------------------------------------------------------------------
*/

export const getRolesApi = async () => {

    const response = await api.get(

        `${BASE}/roles`

    );

    return response.data.data;

};

/*
|--------------------------------------------------------------------------
| Users
|--------------------------------------------------------------------------
*/

export const getUsersApi = async (params) => {
    const response = await api.get(
        BASE,
        {
            params,
        }
    );
    return response.data.data;
};

export const getUserByIdApi = async (id) => {

    const response = await api.get(

        `${BASE}/${id}`

    );

    return response.data.data;

};

export const createUserApi = async (data) => {

    const response = await api.post(

        BASE,

        data

    );

    return response.data.data;

};

export const updateUserApi = async (

    id,

    data

) => {

    const response = await api.put(

        `${BASE}/${id}`,

        data

    );

    return response.data.data;

};

export const deleteUserApi = async (id) => {

    const response = await api.delete(

        `${BASE}/${id}`

    );

    return response.data;

};

export const changeStatusApi = async (id, isActive) => {
    const response = await api.patch(
        `${BASE}/${id}/status`,
        {
            is_active: isActive,
        }
    );
    return response.data;
};

export const resetPasswordApi = async (

    id,

    password

) => {

    const response = await api.patch(

        `${BASE}/${id}/password`,

        {

            password,

        }

    );

    return response.data;

};