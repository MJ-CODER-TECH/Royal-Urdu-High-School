import { createAsyncThunk } from "@reduxjs/toolkit";

import {

    getStudentReportApi,
    printStudentReportApi,
    exportStudentPdfApi,
    exportStudentExcelApi,

    getAttendanceReportApi,
    printAttendanceReportApi,
    exportAttendancePdfApi,
    exportAttendanceExcelApi,

     getFeeReportApi,
    printFeeReportApi,
    exportFeePdfApi,
    exportFeeExcelApi,

     getExamReportApi,
    printExamReportApi,
    exportExamPdfApi,
    exportExamExcelApi,


    getTimetableReportApi,
    printTimetableReportApi,
exportTimetablePdfApi,
exportTimetableExcelApi,

   getCertificateReportApi,
printCertificateReportApi,
exportCertificatePdfApi,
exportCertificateExcelApi,

} from "../../api/reports/reports.api";

/*
|--------------------------------------------------------------------------
| STUDENT REPORT
|--------------------------------------------------------------------------
*/

export const getStudentReport = createAsyncThunk(
    "reports/getStudentReport",
    async (filters = {}, thunkAPI) => {

        try {

            return await getStudentReportApi(filters);

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load student report."
            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| PRINT STUDENT REPORT
|--------------------------------------------------------------------------
*/

export const printStudentReport = createAsyncThunk(
    "reports/printStudentReport",
    async (filters = {}, thunkAPI) => {

        try {

            printStudentReportApi(filters);

            return true;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to print report."
            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| EXPORT STUDENT REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportStudentPdf = createAsyncThunk(
    "reports/exportStudentPdf",
    async(filters)=>{

        const blob = await exportStudentPdfApi(filters);


        const url = window.URL.createObjectURL(blob);


        const link = document.createElement("a");

        link.href = url;

        link.download = "student-report.pdf";

        document.body.appendChild(link);

        link.click();


        link.remove();

        window.URL.revokeObjectURL(url);


        return true;

    }
);

/*
|--------------------------------------------------------------------------
| EXPORT STUDENT REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportStudentExcel = createAsyncThunk(
    "reports/exportStudentExcel",

    async(filters)=>{

        const blob =
            await exportStudentExcelApi(filters);


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href=url;

        link.download="student-report.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();


        window.URL.revokeObjectURL(url);


        return true;

    }
);

/*
|--------------------------------------------------------------------------
| ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

export const getAttendanceReport = createAsyncThunk(
    "reports/getAttendanceReport",
    async (filters = {}, thunkAPI) => {

        try {

            return await getAttendanceReportApi(filters);

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load attendance report."
            );

        }

    }
);



/*
|--------------------------------------------------------------------------
| PRINT ATTENDANCE REPORT
|--------------------------------------------------------------------------
*/

export const printAttendanceReport = createAsyncThunk(
    "reports/printAttendanceReport",
    async (filters = {}, thunkAPI) => {

        try {

            await printAttendanceReportApi(filters);

            return true;

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to print attendance report."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT ATTENDANCE REPORT PDF
|--------------------------------------------------------------------------
*/

export const exportAttendancePdf = createAsyncThunk(
    "reports/exportAttendancePdf",

    async (filters) => {

        const blob =
            await exportAttendancePdfApi(filters);

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = "attendance-report.pdf";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        return true;

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT ATTENDANCE REPORT EXCEL
|--------------------------------------------------------------------------
*/

export const exportAttendanceExcel = createAsyncThunk(
    "reports/exportAttendanceExcel",

    async (filters) => {

        const blob =
            await exportAttendanceExcelApi(filters);

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download = "attendance-report.xlsx";

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

        return true;

    }
);

/*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

export const getFeeReport = createAsyncThunk(
    "reports/getFeeReport",
    async (filters = {}, { rejectWithValue }) => {

        try {

            const data = await getFeeReportApi(filters);

            return data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch fee report"
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| PRINT FEE REPORT
|--------------------------------------------------------------------------
*/

export const printFeeReport = createAsyncThunk(
    "reports/printFeeReport",
    async (filters = {}, { rejectWithValue }) => {

        try {

            await printFeeReportApi(filters);

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to print fee report"
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT FEE PDF
|--------------------------------------------------------------------------
*/

export const exportFeePdf = createAsyncThunk(
    "reports/exportFeePdf",
    async (filters = {}, { rejectWithValue }) => {

        try {

            const blob = await exportFeePdfApi(filters);

            return blob;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to export fee PDF"
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT FEE EXCEL
|--------------------------------------------------------------------------
*/

export const exportFeeExcel = createAsyncThunk(
    "reports/exportFeeExcel",
    async (filters = {}, { rejectWithValue }) => {

        try {

            const blob = await exportFeeExcelApi(filters);

            return blob;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to export fee Excel"
            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| EXAM REPORT
|--------------------------------------------------------------------------
*/


export const getExamReport = createAsyncThunk(
    "reports/getExamReport",

    async (filters = {}, { rejectWithValue }) => {

        try {

            const data = await getExamReportApi(filters);

            return data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch exam report"
            );

        }

    }
);




/*
|--------------------------------------------------------------------------
| PRINT EXAM REPORT
|--------------------------------------------------------------------------
*/


export const printExamReport = createAsyncThunk(
    "reports/printExamReport",

    async (filters = {}, { rejectWithValue }) => {

        try {

            await printExamReportApi(filters);

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to print exam report"
            );

        }

    }
);




/*
|--------------------------------------------------------------------------
| EXPORT EXAM PDF
|--------------------------------------------------------------------------
*/


export const exportExamPdf = createAsyncThunk(
    "reports/exportExamPdf",

    async (filters = {}, { rejectWithValue }) => {

        try {

            const blob = await exportExamPdfApi(filters);

            return blob;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to export exam PDF"
            );

        }

    }
);




/*
|--------------------------------------------------------------------------
| EXPORT EXAM EXCEL
|--------------------------------------------------------------------------
*/


export const exportExamExcel = createAsyncThunk(
    "reports/exportExamExcel",

    async (filters = {}, { rejectWithValue }) => {

        try {

            const blob = await exportExamExcelApi(filters);

            return blob;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to export exam Excel"
            );

        }

    }
);
/*
|--------------------------------------------------------------------------
| TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

export const getTimetableReport = createAsyncThunk(
    "reports/getTimetableReport",
    async (filters = {}, thunkAPI) => {

        try {

            return await getTimetableReportApi(filters);

        } catch (error) {

            return thunkAPI.rejectWithValue(
                error.response?.data?.message ||
                "Failed to load timetable report."
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| PRINT TIMETABLE REPORT
|--------------------------------------------------------------------------
*/

export const printTimetableReport = createAsyncThunk(
    "reports/printTimetableReport",
    async (filters = {}, { rejectWithValue }) => {

        try {

            await printTimetableReportApi(filters);

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to print timetable report"
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE PDF
|--------------------------------------------------------------------------
*/

export const exportTimetablePdf = createAsyncThunk(
    "reports/exportTimetablePdf",
    async (filters = {}, { rejectWithValue }) => {

        try {

            const blob = await exportTimetablePdfApi(filters);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "timetable-report.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to export timetable PDF"
            );

        }

    }
);


/*
|--------------------------------------------------------------------------
| EXPORT TIMETABLE EXCEL
|--------------------------------------------------------------------------
*/

export const exportTimetableExcel = createAsyncThunk(
    "reports/exportTimetableExcel",
    async (filters = {}, { rejectWithValue }) => {

        try {

            const blob = await exportTimetableExcelApi(filters);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;
            link.download = "timetable-report.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

            return true;

        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to export timetable Excel"
            );

        }

    }
);

/*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

export const getCertificateReport = createAsyncThunk(

    "reports/getCertificateReport",

    async (filters = {}, thunkAPI) => {

        try {

            const data =
                await getCertificateReportApi(filters);

            return data.data || [];

        } catch(error){

            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to fetch certificate report"

            );

        }

    }

);


/*
|--------------------------------------------------------------------------
| PRINT CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

export const printCertificateReport = createAsyncThunk(

"reports/printCertificateReport",

async(filters,{rejectWithValue})=>{

try{


const html =
await printCertificateReportApi(filters);


const printWindow =
window.open(
"",
"_blank"
);


printWindow.document.open();

printWindow.document.write(html);

printWindow.document.close();


return true;


}catch(error){


return rejectWithValue(
error.response?.data?.message ||
"Failed to print certificate report"
);


}


}

);


/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE PDF
|--------------------------------------------------------------------------
*/
export const exportCertificatePdf = createAsyncThunk(

    "reports/exportCertificatePdf",

    async(filters, thunkAPI)=>{

        try{


            const blob =
                await exportCertificatePdfApi(filters);



            const url =
                window.URL.createObjectURL(blob);



            const link =
                document.createElement("a");


            link.href=url;


            link.download =
                "certificate-report.pdf";


            document.body.appendChild(link);


            link.click();


            link.remove();


            window.URL.revokeObjectURL(url);


            return true;



        }catch(error){


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to export PDF"

            );


        }


    }

);


/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE EXCEL
|--------------------------------------------------------------------------
*/

export const exportCertificateExcel = createAsyncThunk(

    "reports/exportCertificateExcel",

    async(filters, thunkAPI)=>{

        try{


            const blob =
                await exportCertificateExcelApi(filters);



            const url =
                window.URL.createObjectURL(blob);



            const link =
                document.createElement("a");



            link.href=url;



            link.download =
                "certificate-report.xlsx";



            document.body.appendChild(link);



            link.click();



            link.remove();



            window.URL.revokeObjectURL(url);



            return true;



        }catch(error){


            return thunkAPI.rejectWithValue(

                error.response?.data?.message ||
                "Failed to export Excel"

            );


        }

    }

);