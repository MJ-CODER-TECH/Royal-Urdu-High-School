import api from "./axios";

/*
|--------------------------------------------------------------------------
| IMPORTANT — adjust these two lines if your existing routes differ
|--------------------------------------------------------------------------
| Change ONLY the URL strings below to match your actual class/section
| routes (check your backend routes file). Everything else in this file
| and in StudentForm.jsx can stay as-is.
|
| These now point to the new master.routes.js, mounted as:
|   router.use("/api/v1/master", masterRoutes);
| in routes/index.js. If you mount it under a different prefix, update
| these two lines to match.
*/

const CLASSES_URL = "/master/classes";
const SECTIONS_URL = "/master/sections";

/*
|--------------------------------------------------------------------------
| Get All Classes
|--------------------------------------------------------------------------
*/

export const getClassesApi = async () => {

    const res = await api.get(CLASSES_URL);

    // Handles both `{ success, data: [...] }` and a raw array response
    return res.data?.data ?? res.data;

};

/*
|--------------------------------------------------------------------------
| Get All Sections
|--------------------------------------------------------------------------
*/

export const getSectionsApi = async () => {

    const res = await api.get(SECTIONS_URL);

    return res.data?.data ?? res.data;

};


/*
|--------------------------------------------------------------------------
| Get All Academic Years
|--------------------------------------------------------------------------
*/

export const getAcademicYearsApi = async () => {

    const res = await api.get("/master/academic-years");

    return res.data?.data ?? res.data;

};




/*
|--------------------------------------------------------------------------
| Get All Subjects
|--------------------------------------------------------------------------
*/

export const getSubjectsApi = async () => {

    const res = await api.get("/master/subjects");

    return res.data?.data ?? res.data;

};