import axiosInstance from "./axios";

/*
|--------------------------------------------------------------------------
| GET DASHBOARD
|--------------------------------------------------------------------------
*/

export const getDashboardApi = async () => {

    const response = await axiosInstance.get(
        "/dashboard"
    );

    return response.data;

};