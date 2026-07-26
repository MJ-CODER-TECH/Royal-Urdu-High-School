import api from "./axios";

// ===========================
// GET ALL RECEIPTS
// ===========================
export const getFeeCollectionsApi = (params) => {
    return api.get("/fee-collection", {
        params,
    });
};

// ===========================
// GET RECEIPT BY ID
// ===========================
export const getFeeReceiptByIdApi = async (id) => {

    const res = await api.get(`/fee-collection/${id}`);

    // console.log("API RESPONSE =>", res);

    // console.log("API DATA =>", res.data);

    return res;
};

// ===========================
// COLLECT FEE
// ===========================
// Collect Fee
export const collectFeeApi = (data) => {
    return api.post("/fee-collection/pay", data);
};

// ===========================
// DELETE RECEIPT
// ===========================
export const deleteFeeReceiptApi = (id) => {
    return api.delete(`/fee-collection/${id}`);
};


// Get Pending Student Fees

export const getPendingStudentFeesApi = (params) => {

    return api.get(
        "/fee-collection/fee-student/pending",
        {
            params
        }
    );

};