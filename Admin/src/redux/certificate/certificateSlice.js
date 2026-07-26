import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    submitting: false,

    certificates: [],
    certificate: null,

    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,

    error: null,
};

const certificateSlice = createSlice({
    name: "certificate",

    initialState,

    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },

        setSubmitting: (state, action) => {
            state.submitting = action.payload;
        },

        setCertificates: (state, action) => {
    state.certificates = action.payload.data || [];   // ✅ "data" key sahi hai
            state.page = action.payload.page || 1;
            state.limit = action.payload.limit || 20;
            state.total = action.payload.total || 0;
            state.totalPages = action.payload.totalPages || 1;
        },

        setCertificate: (state, action) => {
            state.certificate = action.payload;
        },

        addCertificate: (state, action) => {
            state.certificates.unshift(action.payload);
        },

        updateCertificateSuccess: (state, action) => {
            const index = state.certificates.findIndex(
                (item) =>
                    item.certificate_id === action.payload.certificate_id
            );

            if (index !== -1) {
                state.certificates[index] = action.payload;
            }

            if (
                state.certificate &&
                state.certificate.certificate_id ===
                    action.payload.certificate_id
            ) {
                state.certificate = action.payload;
            }
        },

        removeCertificate: (state, action) => {
            state.certificates = state.certificates.filter(
                (item) => item.certificate_id !== action.payload
            );
        },

        setError: (state, action) => {
            state.error = action.payload;
        },

        clearCertificate: (state) => {
            state.certificate = null;
        },
    },
});

export const {
    setLoading,
    setSubmitting,
    setCertificates,
    setCertificate,
    addCertificate,
    updateCertificateSuccess,
    removeCertificate,
    setError,
    clearCertificate,
} = certificateSlice.actions;

export default certificateSlice.reducer;