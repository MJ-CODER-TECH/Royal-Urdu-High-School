import api from "./axios";

const SUBJECT_URL = "/subjects";


export const getSubjectsApi = async () => {

    const response = await api.get(
        SUBJECT_URL
    );

    return response.data;

};


export const getSubjectByIdApi = async (id) => {

    const response = await api.get(
        `${SUBJECT_URL}/${id}`
    );

    return response.data;

};


export const createSubjectApi = async (data) => {

    const response = await api.post(
        SUBJECT_URL,
        data
    );

    return response.data;

};


export const updateSubjectApi = async (
    id,
    data
) => {

    const response = await api.put(
        `${SUBJECT_URL}/${id}`,
        data
    );

    return response.data;

};


export const deleteSubjectApi = async (id) => {

    const response = await api.delete(
        `${SUBJECT_URL}/${id}`
    );

    return response.data;

};


export const changeSubjectStatusApi = async (
    id,
    is_active
) => {

    const response = await api.patch(
        `${SUBJECT_URL}/${id}/status`,
        {
            is_active
        }
    );

    return response.data;

};