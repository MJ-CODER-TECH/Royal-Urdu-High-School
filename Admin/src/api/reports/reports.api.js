import api from "../axios";

/*
|--------------------------------------------------------------------------
| STUDENT REPORT
|--------------------------------------------------------------------------
*/

export const getStudentReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/student",
        {
            params: filters,
        }
    );

    return response.data.data || [];

};

/*
|--------------------------------------------------------------------------
| PRINT STUDENT REPORT
|--------------------------------------------------------------------------
*/

export const printStudentReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/student/print",
        {
            params: filters,
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data], {
            type: "text/html",
        })
    );

    window.open(url, "_blank");
};

/*
|--------------------------------------------------------------------------
| EXPORT STUDENT REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportStudentPdfApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/student/pdf",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| EXPORT STUDENT REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportStudentExcelApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/student/excel",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

export const getAttendanceReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/attendance",
        {
            params: filters,
        }
    );

    return response.data.data || [];

};

/*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

export const getFeeReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/fee",
        {
            params: filters,
        }
    );

    return response.data.data || [];

};

/*
|--------------------------------------------------------------------------
| PRINT FEE REPORT
|--------------------------------------------------------------------------
*/

export const printFeeReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/fee/print",
        {
            params: filters,
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data], {
            type: "text/html",
        })
    );

    window.open(url, "_blank");

};


/*
|--------------------------------------------------------------------------
| EXPORT FEE REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportFeePdfApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/fee/pdf",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| EXPORT FEE REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportFeeExcelApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/fee/excel",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| EXAM REPORT
|--------------------------------------------------------------------------
*/

export const getExamReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/exam",
        {
            params: filters,
        }
    );


    return response.data.data || [];

};





/*
|--------------------------------------------------------------------------
| PRINT EXAM REPORT
|--------------------------------------------------------------------------
*/

export const printExamReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/exam/print",
        {
            params: filters,
            responseType: "blob",
        }
    );


    const url =
        window.URL.createObjectURL(
            new Blob(
                [response.data],
                {
                    type:"text/html",
                }
            )
        );


    window.open(
        url,
        "_blank"
    );

};





/*
|--------------------------------------------------------------------------
| EXPORT EXAM REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportExamPdfApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/exam/pdf",
        {
            params: filters,
            responseType:"blob",
        }
    );


    return response.data;

};





/*
|--------------------------------------------------------------------------
| EXPORT EXAM REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportExamExcelApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/exam/excel",
        {
            params: filters,
            responseType:"blob",
        }
    );


    return response.data;

};

/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

export const getTimetableReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/timetable",
        {
            params: filters,
        }
    );

    return response.data.data || [];

};


/*
|--------------------------------------------------------------------------
| PRINT TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

export const printTimetableReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/timetable/print",
        {
            params: filters,
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data], {
            type: "text/html",
        })
    );

    window.open(url, "_blank");

};


/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportTimetablePdfApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/timetable/pdf",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportTimetableExcelApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/timetable/excel",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

export const getCertificateReportApi = async(filters)=>{

    const response = await api.get(
        "/reports/certificate",
        {
            params: filters
        }
    );

    return response.data;

};



export const printCertificateReportApi = async(filters)=>{

    const response = await api.get(
        "/reports/certificate/print",
        {
            params: filters,
            responseType: "text",
        }
    );

    return response.data;

};


export const exportCertificatePdfApi = async (params = {}) => {

    const response = await api.get(
        "/reports/certificate/pdf",
        {
            params,
            responseType:"blob",
        }
    );


    return response.data;

};




export const exportCertificateExcelApi = async (params = {}) => {

    const response = await api.get(
        "/reports/certificate/excel",
        {
            params,
            responseType:"blob",
        }
    );


    return response.data;

};






/*
|--------------------------------------------------------------------------
| PRINT ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

export const printAttendanceReportApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/attendance/print",
        {
            params: filters,
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data], {
            type: "text/html",
        })
    );

    window.open(url, "_blank");

};


/*
|--------------------------------------------------------------------------
| EXPORT ATTENDANCE REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportAttendancePdfApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/attendance/pdf",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};


/*
|--------------------------------------------------------------------------
| EXPORT ATTENDANCE REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportAttendanceExcelApi = async (filters = {}) => {

    const response = await api.get(
        "/reports/attendance/excel",
        {
            params: filters,
            responseType: "blob",
        }
    );

    return response.data;

};