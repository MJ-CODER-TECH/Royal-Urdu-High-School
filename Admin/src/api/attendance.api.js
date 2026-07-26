import api from "./axios";

/* ==========================================
   Attendance CRUD
========================================== */

export const getAttendanceApi = (params) =>
    api.get("/attendance", { params });

export const getAttendanceByIdApi = (attendanceId) =>
    api.get(`/attendance/${attendanceId}`);

export const getAttendanceByStudentApi = (studentId) =>
    api.get(`/attendance/student/${studentId}`);

export const getAttendanceByDateApi = (attendanceDate) =>
    api.get(`/attendance/date/${attendanceDate}`);

export const createAttendanceApi = (data) =>
    api.post("/attendance", data);

export const updateAttendanceApi = (attendanceId, data) =>
    api.put(`/attendance/${attendanceId}`, data);

export const deleteAttendanceApi = (attendanceId) =>
    api.delete(`/attendance/${attendanceId}`);

export const bulkAttendanceApi = (data) =>
    api.post("/attendance/bulk", data);


/* ==========================================
   Monthly Attendance Reports
========================================== */

export const getMonthlyAttendanceApi = (params) =>
    api.get("/monthly-attendance", { params });

export const getStudentMonthlyAttendanceApi = (params) =>
    api.get("/monthly-attendance/student", { params });

export const getClassMonthlyAttendanceApi = (params) =>
    api.get("/monthly-attendance/class", { params });

export const getAttendanceCalendarApi = (params) =>
    api.get("/monthly-attendance/calendar", { params });

export const getLowAttendanceStudentsApi = (params) =>
    api.get("/monthly-attendance/low-attendance", { params });

export const getAttendanceDashboardApi = () =>
    api.get("/monthly-attendance/dashboard");

export const getYearlyAttendanceApi = (params) =>
    api.get("/monthly-attendance/yearly", { params });

export const getAttendanceRegisterApi = (params) =>
    api.get("/monthly-attendance/register", { params });

export const getAttendanceRegisterMatrixApi = (params) =>
    api.get("/monthly-attendance/register-matrix", { params });

export const getAttendanceAnalyticsApi = (params) =>
    api.get("/monthly-attendance/analytics", { params });


/* ==========================================
   Export Reports
========================================== */

export const exportMonthlyAttendancePdfApi = (params) =>
    api.get("/monthly-attendance/pdf/monthly", {
        params,
        responseType: "blob",
    });

export const exportMonthlyAttendanceExcelApi = (params) =>
    api.get("/monthly-attendance/excel/monthly", {
        params,
        responseType: "blob",
    });