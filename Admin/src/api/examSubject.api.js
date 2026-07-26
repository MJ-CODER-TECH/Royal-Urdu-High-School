import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL EXAM SUBJECTS
|--------------------------------------------------------------------------
*/

export const getExamSubjectsApi = async () => {

    const response = await axiosInstance.get(
        "/exam-subjects"
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET EXAM SUBJECT BY ID
|--------------------------------------------------------------------------
*/

export const getExamSubjectByIdApi = async (id) => {

    const response = await axiosInstance.get(
        `/exam-subjects/${id}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE EXAM SUBJECT
|--------------------------------------------------------------------------
*/

export const createExamSubjectApi = async (data) => {

    const response = await axiosInstance.post(
        "/exam-subjects",
        data
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE EXAM SUBJECT
|--------------------------------------------------------------------------
*/

export const updateExamSubjectApi = async (
    id,
    data
) => {

    const response = await axiosInstance.put(
        `/exam-subjects/${id}`,
        data
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE EXAM SUBJECT
|--------------------------------------------------------------------------
*/

export const deleteExamSubjectApi = async (id) => {

    const response = await axiosInstance.delete(
        `/exam-subjects/${id}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| CHANGE STATUS
|--------------------------------------------------------------------------
*/

export const changeExamSubjectStatusApi = async (
    id,
    status
) => {

    const response = await axiosInstance.patch(
        `/exam-subjects/${id}/status`,
        {
            status,
        }
    );

    return response.data;
};