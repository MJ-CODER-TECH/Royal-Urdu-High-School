import api from "./axios";

const SCHOOL_PROFILE_URL = "/school-profile";

/*
|--------------------------------------------------------------------------
| Get School Profile
|--------------------------------------------------------------------------
*/

export const getSchoolProfileApi = async () => {

  const response = await api.get(
    SCHOOL_PROFILE_URL
  );

  return response.data;

};


/*
|--------------------------------------------------------------------------
| Create School Profile
|--------------------------------------------------------------------------
*/

export const createSchoolProfileApi = async (
  data
) => {

  const response = await api.post(
    SCHOOL_PROFILE_URL,
    data
  );

  return response.data;

};


/*
|--------------------------------------------------------------------------
| Update School Profile
|--------------------------------------------------------------------------
*/

export const updateSchoolProfileApi = async (
  id,
  data
) => {

  const response = await api.put(
    `${SCHOOL_PROFILE_URL}/${id}`,
    data
  );

  return response.data;

};


/*
|--------------------------------------------------------------------------
| Add School Unit
|--------------------------------------------------------------------------
*/

export const addSchoolUnitApi = async (
  schoolId,
  data
) => {

  const response = await api.post(
    `${SCHOOL_PROFILE_URL}/${schoolId}/units`,
    data
  );

  return response.data;

};


/*
|--------------------------------------------------------------------------
| Delete School Unit
|--------------------------------------------------------------------------
*/

export const deleteSchoolUnitApi = async (
  unitId
) => {

  const response = await api.delete(
    `${SCHOOL_PROFILE_URL}/units/${unitId}`
  );

  return response.data;

};