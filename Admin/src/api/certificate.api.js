import api from "./axios";

export const getCertificatesApi = (params) =>
    api.get("/certificates", { params });

export const getCertificateByIdApi = (id) =>
    api.get(`/certificates/${id}`);

export const getStudentCertificatesApi = (studentId) =>
    api.get(`/certificates/student/${studentId}`);

export const createCertificateApi = (data) =>
    api.post("/certificates", data);

export const updateCertificateApi = (id, data) =>
    api.put(`/certificates/${id}`, data);

export const deleteCertificateApi = (id) =>
    api.delete(`/certificates/${id}`);

export const generateBonafidePdfApi = (studentId) =>
    api.get(`/certificates/bonafide/${studentId}/pdf`, {
        responseType: "blob",
    });

export const generateTcPdfApi = (studentId, data) =>
    api.post(`/certificates/tc/${studentId}/pdf`, data, {
        responseType: "blob",
    });

export const generateLcPdfApi = (studentId, data) =>
    api.post(`/certificates/lc/${studentId}/pdf`, data, {
        responseType: "blob",
    });

export const generateCharacterPdfApi = (studentId, data) =>
    api.post(`/certificates/character/${studentId}/pdf`, data, {
        responseType: "blob",
    });

    export const downloadCertificatePdfApi = (id) =>
    api.get(`/certificates/${id}/download`, {
        responseType: "blob",
    });