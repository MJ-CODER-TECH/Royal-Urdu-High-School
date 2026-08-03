import api from "./axios";

// ============================================
// Base URL
// ============================================

const PROMOTION_URL = "/promotion";

// ============================================
// Get Students For Promotion
// GET /promotion/students
// ============================================

export const getPromotionStudents = async (params) => {

    const response = await api.get(
        `${PROMOTION_URL}/students`,
        { params }
    );

    return response.data;
};

// ============================================
// Promote Students
// POST /promotion/promote
// ============================================

export const promoteStudents = async (data) => {

    const response = await api.post(
        `${PROMOTION_URL}/promote`,
        data
    );

    return response.data;
};

// ============================================
// Get Promotion History
// GET /promotion/history
// ============================================

export const getPromotionHistory = async (params) => {

    const response = await api.get(
        `${PROMOTION_URL}/history`,
        { params }
    );

    return response.data;
};