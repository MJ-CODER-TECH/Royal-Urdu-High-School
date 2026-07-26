import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| GET ALL MARKS
|--------------------------------------------------------------------------
*/

export const getMarksApi = async () => {
    const response = await axiosInstance.get("/marks");
    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET MARK BY ID
|--------------------------------------------------------------------------
*/

export const getMarkByIdApi = async (id) => {
    const response = await axiosInstance.get(`/marks/${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE MARK
|--------------------------------------------------------------------------
*/

export const createMarkApi = async (data) => {
    const response = await axiosInstance.post("/marks", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| BULK CREATE MARKS
|--------------------------------------------------------------------------
*/

export const bulkCreateMarksApi = async (data) => {
    const response = await axiosInstance.post("/marks/bulk", data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE MARK
|--------------------------------------------------------------------------
*/

export const updateMarkApi = async (id, data) => {
    const response = await axiosInstance.put(`/marks/${id}`, data);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE MARK
|--------------------------------------------------------------------------
*/

export const deleteMarkApi = async (id) => {
    const response = await axiosInstance.delete(`/marks/${id}`);
    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET MARKS BY FILTER
|--------------------------------------------------------------------------
*/

export const getMarksByFilterApi = async (params) => {
    const response = await axiosInstance.get("/marks/filter", {
        params,
    });

    return response.data;
};


export const getStudentsForMarksApi = async (params) => {

    const response = await axiosInstance.get(
        "/marks/students",
        {
            params,
        }
    );

    return response.data;

};