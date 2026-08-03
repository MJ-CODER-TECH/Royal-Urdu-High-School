import { toast } from "react-toastify";

import {
    setLoading,
    setSubmitting,
    setCertificates,
    setCertificate,
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
    downloadCertificatePdfApi,
} from "../../api/certificate.api";


/* ==========================================================
   Get Certificates
========================================================== */

export const getCertificates =
    (params = {}) =>
    async (dispatch) => {

        try {

            dispatch(
                setLoading(true)
            );

            const response =
                await getCertificatesApi(
                    params
                );

            const data =
                response?.data ??
                response;

            dispatch(
                setCertificates(data)
            );

            return data;

        } catch (error) {

            const message =
                error.response?.data?.message ||
                "Failed to load certificates.";

            dispatch(
                setError(message)
            );

            toast.error(
                message
            );

            return false;

        } finally {

            dispatch(
                setLoading(false)
            );

        }

    };


/* ==========================================================
   Get Certificate By ID
========================================================== */

export const getCertificate =
    (id) =>
    async (dispatch) => {

        try {

            dispatch(
                setLoading(true)
            );

            const response =
                await getCertificateByIdApi(
                    id
                );

            const data =
                response?.data ??
                response;

            dispatch(
                setCertificate(data)
            );

            return data;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load certificate."
            );

            return false;

        } finally {

            dispatch(
                setLoading(false)
            );

        }

    };


/* ==========================================================
   Create Certificate
========================================================== */

export const createCertificate =
    (payload) =>
    async (dispatch, getState) => {

        try {

            dispatch(
                setSubmitting(true)
            );

            const response =
                await createCertificateApi(
                    payload
                );

            toast.success(
                response?.data?.message ||
                "Certificate created successfully."
            );

            const {
                page,
                limit,
            } =
                getState().certificate;

            dispatch(
                getCertificates({
                    page,
                    limit,
                })
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to create certificate."
            );

            return false;

        } finally {

            dispatch(
                setSubmitting(false)
            );

        }

    };


/* ==========================================================
   Update Certificate
========================================================== */

export const updateCertificate =
    ({ id, data }) =>
    async (dispatch, getState) => {

        try {

            dispatch(
                setSubmitting(true)
            );

            const response =
                await updateCertificateApi(
                    id,
                    data
                );

            toast.success(
                response?.data?.message ||
                "Certificate updated successfully."
            );

            const {
                page,
                limit,
            } =
                getState().certificate;

            dispatch(
                getCertificates({
                    page,
                    limit,
                })
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to update certificate."
            );

            return false;

        } finally {

            dispatch(
                setSubmitting(false)
            );

        }

    };


/* ==========================================================
   Delete Certificate
========================================================== */

export const deleteCertificate =
    (id) =>
    async (dispatch) => {

        try {

            await deleteCertificateApi(
                id
            );

            dispatch(
                removeCertificate(id)
            );

            toast.success(
                "Certificate deleted."
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Delete failed."
            );

            return false;

        }

    };


/* ==========================================================
   Download Blob Helper
========================================================== */

const downloadBlob =
    (blob, filename) => {

        const url =
            window.URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href =
            url;

        link.download =
            filename;

        document.body.appendChild(
            link
        );

        link.click();

        link.remove();

        window.URL.revokeObjectURL(
            url
        );

    };


/* ==========================================================
   Generate Bonafide
========================================================== */

export const generateBonafide =
    (studentId, payload = {}) =>
    async (dispatch, getState) => {

        try {

            dispatch(
                setSubmitting(true)
            );

            const response =
                await generateBonafidePdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                response.data,
                `Bonafide_${studentId}.pdf`
            );

            toast.success(
                "Bonafide generated successfully."
            );

            const {
                page,
                limit,
            } =
                getState().certificate;

            dispatch(
                getCertificates({
                    page,
                    limit,
                })
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to generate Bonafide."
            );

            return false;

        } finally {

            dispatch(
                setSubmitting(false)
            );

        }

    };


/* ==========================================================
   Generate Transfer Certificate
========================================================== */

export const generateTC =
    (studentId, payload = {}) =>
    async (dispatch, getState) => {

        try {

            dispatch(
                setSubmitting(true)
            );

            const response =
                await generateTcPdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                response.data,
                `Transfer_Certificate_${studentId}.pdf`
            );

            toast.success(
                "Transfer Certificate generated successfully."
            );

            const {
                page,
                limit,
            } =
                getState().certificate;

            dispatch(
                getCertificates({
                    page,
                    limit,
                })
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to generate Transfer Certificate."
            );

            return false;

        } finally {

            dispatch(
                setSubmitting(false)
            );

        }

    };


/* ==========================================================
   Generate Leaving Certificate
========================================================== */

export const generateLC =
    (studentId, payload = {}) =>
    async (dispatch, getState) => {

        try {

            dispatch(
                setSubmitting(true)
            );

            const response =
                await generateLcPdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                response.data,
                `Leaving_Certificate_${studentId}.pdf`
            );

            toast.success(
                "Leaving Certificate generated successfully."
            );

            const {
                page,
                limit,
            } =
                getState().certificate;

            dispatch(
                getCertificates({
                    page,
                    limit,
                })
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to generate Leaving Certificate."
            );

            return false;

        } finally {

            dispatch(
                setSubmitting(false)
            );

        }

    };


/* ==========================================================
   Generate Character Certificate
========================================================== */

export const generateCharacter =
    (studentId, payload = {}) =>
    async (dispatch, getState) => {

        try {

            dispatch(
                setSubmitting(true)
            );

            const response =
                await generateCharacterPdfApi(
                    studentId,
                    payload
                );

            downloadBlob(
                response.data,
                `Character_Certificate_${studentId}.pdf`
            );

            toast.success(
                "Character Certificate generated successfully."
            );

            const {
                page,
                limit,
            } =
                getState().certificate;

            dispatch(
                getCertificates({
                    page,
                    limit,
                })
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to generate Character Certificate."
            );

            return false;

        } finally {

            dispatch(
                setSubmitting(false)
            );

        }

    };


/* ==========================================================
   Download Existing Certificate
========================================================== */

export const downloadCertificate =
    (id, certificateNo) =>
    async () => {

        try {

            const response =
                await downloadCertificatePdfApi(
                    id
                );

            downloadBlob(
                response.data,
                `${certificateNo || id}.pdf`
            );

            return true;

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "PDF not available. Please generate it first."
            );

            return false;

        }

    };