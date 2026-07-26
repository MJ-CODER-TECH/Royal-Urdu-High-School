import { toast } from "react-toastify";

import {
    setLoading,
    setSubmitting,
    setCertificates,
    setCertificate,
    addCertificate,
    updateCertificateSuccess,
    removeCertificate,
    setError,
} from "./certificateSlice";

import {
    getCertificatesApi,
    getCertificateByIdApi,
    createCertificateApi,
    updateCertificateApi,
    deleteCertificateApi,
    generateBonafidePdfApi,
    generateTcPdfApi,
    generateLcPdfApi,
    generateCharacterPdfApi,
} from "../../api/certificate.api";

/* ==========================================================
   Get Certificates
========================================================== */

export const getCertificates =
    (params = {}) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            const { data } = await getCertificatesApi(params);

            dispatch(setCertificates(data));
        } catch (error) {
            dispatch(
                setError(
                    error.response?.data?.message ||
                        "Failed to load certificates."
                )
            );

            toast.error(
                error.response?.data?.message ||
                    "Failed to load certificates."
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

/* ==========================================================
   Get Certificate
========================================================== */

export const getCertificate =
    (id) =>
    async (dispatch) => {
        try {
            dispatch(setLoading(true));

            const { data } = await getCertificateByIdApi(id);

            dispatch(setCertificate(data));
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to load certificate."
            );
        } finally {
            dispatch(setLoading(false));
        }
    };

/* ==========================================================
   Create
========================================================== */

export const createCertificate =
    (payload) =>
    async (dispatch, getState) => {
        try {
            dispatch(setSubmitting(true));

            const { data } = await createCertificateApi(payload);

            toast.success(
                data.message || "Certificate created successfully."
            );

            // list ko fresh refetch karo taaki poora joined data mile
            const { page, limit } = getState().certificate;
            dispatch(getCertificates({ page, limit }));

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to create certificate."
            );

            return false;
        } finally {
            dispatch(setSubmitting(false));
        }
    };

/* ==========================================================
   Update
========================================================== */

export const updateCertificate =
    ({ id, data }) =>
    async (dispatch, getState) => {
        try {
            dispatch(setSubmitting(true));

            const response = await updateCertificateApi(id, data);

            toast.success(
                response.data.message || "Certificate updated successfully."
            );

            const { page, limit } = getState().certificate;
            dispatch(getCertificates({ page, limit }));

            return true;
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update certificate."
            );

            return false;
        } finally {
            dispatch(setSubmitting(false));
        }
    };

/* ==========================================================
   Delete
========================================================== */

export const deleteCertificate =
    (id) =>
    async (dispatch) => {
        try {
            await deleteCertificateApi(id);

            dispatch(removeCertificate(id));

            toast.success("Certificate deleted.");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "Delete failed."
            );
        }
    };

/* ==========================================================
   Download Helper
========================================================== */

const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = filename;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);
};

/* ==========================================================
   Bonafide PDF
========================================================== */

export const generateBonafide =
    (studentId) =>
    async (dispatch, getState) => {
        try {
            const { data } =
                await generateBonafidePdfApi(studentId);

            downloadBlob(
                data,
                `Bonafide_${studentId}.pdf`
            );

            toast.success("Bonafide generated.");

            const { page, limit } = getState().certificate;
            dispatch(getCertificates({ page, limit }));
        } catch (error) {
            toast.error("Failed to generate Bonafide.");
        }
    };

/* ==========================================================
   Transfer Certificate
========================================================== */

export const generateTC =
    (studentId, payload) =>
    async (dispatch, getState) => {
        try {
            const { data } =
                await generateTcPdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                data,
                `Transfer_Certificate_${studentId}.pdf`
            );

            toast.success("Transfer Certificate generated.");

            const { page, limit } = getState().certificate;
            dispatch(getCertificates({ page, limit }));
        } catch (error) {
            toast.error(
                "Failed to generate Transfer Certificate."
            );
        }
    };

/* ==========================================================
   Leaving Certificate
========================================================== */

export const generateLC =
    (studentId, payload) =>
    async (dispatch, getState) => {
        try {
            const { data } =
                await generateLcPdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                data,
                `Leaving_Certificate_${studentId}.pdf`
            );

            toast.success("Leaving Certificate generated.");

            const { page, limit } = getState().certificate;
            dispatch(getCertificates({ page, limit }));
        } catch (error) {
            toast.error(
                "Failed to generate Leaving Certificate."
            );
        }
    };

/* ==========================================================
   Character Certificate
========================================================== */

export const generateCharacter =
    (studentId, payload) =>
    async (dispatch, getState) => {
        try {
            const { data } =
                await generateCharacterPdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                data,
                `Character_Certificate_${studentId}.pdf`
            );

            toast.success(
                "Character Certificate generated."
            );

            const { page, limit } = getState().certificate;
            dispatch(getCertificates({ page, limit }));
        } catch (error) {
            toast.error(
                "Failed to generate Character Certificate."
            );
        }
    };


    export const downloadCertificate =
    (id, certificateNo) =>
    async () => {
        try {
            const { data } = await downloadCertificatePdfApi(id);

            downloadBlob(data, `${certificateNo || id}.pdf`);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                    "PDF not available. Please generate it first."
            );
        }
    };