import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    getPromotionStudents,
    promoteStudents,
    getPromotionHistory
} from "../../api/promotion.api";

// =======================================================
// Get Students For Promotion
// =======================================================

export const fetchPromotionStudents = createAsyncThunk(
    "promotion/fetchPromotionStudents",
    async (params, { rejectWithValue }) => {

        try {

            const response = await getPromotionStudents(params);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load students."
            );

        }

    }
);

// =======================================================
// Promote Students
// =======================================================

export const promoteStudentsThunk = createAsyncThunk(
    "promotion/promoteStudents",
    async (data, { rejectWithValue }) => {

        try {

            const response = await promoteStudents(data);

            return response;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to promote students."
            );

        }

    }
);

// =======================================================
// Get Promotion History
// =======================================================

export const fetchPromotionHistory = createAsyncThunk(
    "promotion/fetchPromotionHistory",
    async (params, { rejectWithValue }) => {

        try {

            const response = await getPromotionHistory(params);

            return response.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to load promotion history."
            );

        }

    }
);