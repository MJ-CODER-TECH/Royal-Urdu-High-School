import api from "./axios";

/*
|--------------------------------------------------------------------------
| GET EXAMS
|--------------------------------------------------------------------------
*/

export const getExamsApi = async () => {
    const res = await api.get("/exam/exam-management");
    return res.data.data;
};
/*
|--------------------------------------------------------------------------
| GET EXAM BY ID
|--------------------------------------------------------------------------
*/

export const getExamByIdApi = async (id) => {

    const response = await api.get(
        `/exam/exam-management/${id}`
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| CREATE EXAM
|--------------------------------------------------------------------------
*/

export const createExamApi = async (data) => {

    const response = await api.post(
        "/exam/exam-management",
        data
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| UPDATE EXAM
|--------------------------------------------------------------------------
*/

export const updateExamApi = async (
    id,
    data
) => {

    const response = await api.put(
        `/exam/exam-management/${id}`,
        data
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| DELETE EXAM
|--------------------------------------------------------------------------
*/

export const deleteExamApi = async (id) => {

    const response = await api.delete(
        `/exam/exam-management/${id}`
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| CHANGE EXAM STATUS
|--------------------------------------------------------------------------
*/

export const changeExamStatusApi = async (
    id,
    status
) => {

    const response = await api.patch(
        `/exam/exam-management/${id}/status`,
        {
            status,
        }
    );

    return response.data;

};