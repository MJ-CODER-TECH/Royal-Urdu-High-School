import { createSlice } from "@reduxjs/toolkit";

import {
    getStudentReport,
    printStudentReport,
    exportStudentPdf,
    exportStudentExcel,

    getAttendanceReport,
    
   getExamReport,
   printExamReport,
   exportExamPdf,
   exportExamExcel,

    getTimetableReport,
    printTimetableReport,
exportTimetablePdf,
exportTimetableExcel,

      getCertificateReport,
    printCertificateReport,
    exportCertificatePdf,
    exportCertificateExcel,

 getFeeReport,
    printFeeReport,
    exportFeePdf,
    exportFeeExcel,

    printAttendanceReport,
exportAttendancePdf,
exportAttendanceExcel,

} from "./reportsThunk";

const initialState = {

    studentReports: [],
    attendanceReports: [],
    feeReports: [],
    examReports: [],
    timetableReports: [],
    certificateReports: [],
   
    loading: false,
    exporting: false,

    error: null,

};

const reportsSlice = createSlice({

    name: "reports",

    initialState,

    reducers: {

        clearReportsError: (state) => {

            state.error = null;

        },

    },

    extraReducers: (builder) => {

        /*
        |--------------------------------------------------------------------------
        | STUDENT REPORT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getStudentReport.pending, (state) => {

                state.loading = true;
                state.error = null;

            })

            .addCase(getStudentReport.fulfilled, (state, action) => {

                state.loading = false;

                state.studentReports = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })

            .addCase(getStudentReport.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });


        /*
        |--------------------------------------------------------------------------
        | ATTENDANCE REPORT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getAttendanceReport.pending, (state) => {

                state.loading = true;

            })

            .addCase(getAttendanceReport.fulfilled, (state, action) => {

                state.loading = false;

                state.attendanceReports = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })

            .addCase(getAttendanceReport.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });


       /*
|--------------------------------------------------------------------------
| FEE REPORT
|--------------------------------------------------------------------------
*/

builder

.addCase(
    getFeeReport.pending,
    (state) => {

        state.feeLoading = true;
        state.feeError = null;

    }
)

.addCase(
    getFeeReport.fulfilled,
    (state, action) => {

        state.feeLoading = false;

        state.feeReports = action.payload;

    }
)

.addCase(
    getFeeReport.rejected,
    (state, action) => {

        state.feeLoading = false;

        state.feeError = action.payload;

    }
);

          /*
        |--------------------------------------------------------------------------
        | EXAM REPORT
        |--------------------------------------------------------------------------
        */


        builder

        .addCase(
            getExamReport.pending,
            (state)=>{

                state.examLoading=true;

            }
        )


        .addCase(
            getExamReport.fulfilled,
            (state,action)=>{

                state.examLoading=false;


                state.examReports =
                    action.payload;


            }
        )


        .addCase(
            getExamReport.rejected,
            (state,action)=>{


                state.examLoading=false;


                state.error =
                    action.error.message;


            }
        );



        /*
        |--------------------------------------------------------------------------
        | TIMETABLE REPORT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(getTimetableReport.pending, (state) => {

                state.loading = true;

            })

            .addCase(getTimetableReport.fulfilled, (state, action) => {

                state.loading = false;

                state.timetableReports = Array.isArray(action.payload)
                    ? action.payload
                    : action.payload.data || [];

            })

            .addCase(getTimetableReport.rejected, (state, action) => {

                state.loading = false;
                state.error = action.payload;

            });




        /*
|--------------------------------------------------------------------------
| TIMETABLE PRINT
|--------------------------------------------------------------------------
*/

builder

.addCase(printTimetableReport.pending, (state) => {

    state.exporting = true;

})

.addCase(printTimetableReport.fulfilled, (state) => {

    state.exporting = false;

})

.addCase(printTimetableReport.rejected, (state, action) => {

    state.exporting = false;
    state.error = action.payload;

});


/*
|--------------------------------------------------------------------------
| TIMETABLE PDF
|--------------------------------------------------------------------------
*/

builder

.addCase(exportTimetablePdf.pending, (state) => {

    state.exporting = true;

})

.addCase(exportTimetablePdf.fulfilled, (state) => {

    state.exporting = false;

})

.addCase(exportTimetablePdf.rejected, (state, action) => {

    state.exporting = false;
    state.error = action.payload;

});


/*
|--------------------------------------------------------------------------
| TIMETABLE EXCEL
|--------------------------------------------------------------------------
*/

builder

.addCase(exportTimetableExcel.pending, (state) => {

    state.exporting = true;

})

.addCase(exportTimetableExcel.fulfilled, (state) => {

    state.exporting = false;

})

.addCase(exportTimetableExcel.rejected, (state, action) => {

    state.exporting = false;
    state.error = action.payload;

});


        /*
        |--------------------------------------------------------------------------
        | CERTIFICATE REPORT
        |--------------------------------------------------------------------------
        */

        builder

         /*
|--------------------------------------------------------------------------
| CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

.addCase(

    getCertificateReport.pending,

    (state) => {

        state.loading = true;

    }

)

.addCase(

    getCertificateReport.fulfilled,

    (state, action) => {

        state.loading = false;

        state.certificateReports =
            action.payload;

    }

)

.addCase(

    getCertificateReport.rejected,

    (state) => {

        state.loading = false;

    }

)



/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE PDF
|--------------------------------------------------------------------------
*/

.addCase(

    exportCertificatePdf.pending,

    (state) => {

        state.exporting = true;

    }

)

.addCase(

    exportCertificatePdf.fulfilled,

    (state) => {

        state.exporting = false;

    }

)

.addCase(

    exportCertificatePdf.rejected,

    (state) => {

        state.exporting = false;

    }

)



/*
|--------------------------------------------------------------------------
| EXPORT CERTIFICATE EXCEL
|--------------------------------------------------------------------------
*/

.addCase(

    exportCertificateExcel.pending,

    (state) => {

        state.exporting = true;

    }

)

.addCase(

    exportCertificateExcel.fulfilled,

    (state) => {

        state.exporting = false;

    }

)

.addCase(

    exportCertificateExcel.rejected,

    (state) => {

        state.exporting = false;

    }

)

/*
|--------------------------------------------------------------------------
| PRINT CERTIFICATE REPORT
|--------------------------------------------------------------------------
*/

.addCase(

    printCertificateReport.pending,

    (state) => {

        state.exporting = true;

    }

)

.addCase(

    printCertificateReport.fulfilled,

    (state) => {

        state.exporting = false;

    }

)

.addCase(

    printCertificateReport.rejected,

    (state) => {

        state.exporting = false;

    }

)

        /*
        |--------------------------------------------------------------------------
        | EXPORT / PRINT
        |--------------------------------------------------------------------------
        */

        builder

            .addCase(printStudentReport.pending, (state) => {

                state.exporting = true;

            })

            .addCase(printStudentReport.fulfilled, (state) => {

                state.exporting = false;

            })

            .addCase(printStudentReport.rejected, (state, action) => {

                state.exporting = false;
                state.error = action.payload;

            });


        builder

            .addCase(exportStudentPdf.pending, (state) => {

                state.exporting = true;

            })

            .addCase(exportStudentPdf.fulfilled, (state) => {

                state.exporting = false;

            })

            .addCase(exportStudentPdf.rejected, (state, action) => {

                state.exporting = false;
                state.error = action.payload;

            });


        builder

            .addCase(exportStudentExcel.pending, (state) => {

                state.exporting = true;

            })

            .addCase(exportStudentExcel.fulfilled, (state) => {

                state.exporting = false;

            })

            .addCase(exportStudentExcel.rejected, (state, action) => {

                state.exporting = false;
                state.error = action.payload;

            })




            builder

.addCase(printAttendanceReport.pending, (state) => {

    state.exporting = true;

})

.addCase(printAttendanceReport.fulfilled, (state) => {

    state.exporting = false;

})

.addCase(printAttendanceReport.rejected, (state, action) => {

    state.exporting = false;
    state.error = action.payload;

});


builder

.addCase(exportAttendancePdf.pending, (state) => {

    state.exporting = true;

})

.addCase(exportAttendancePdf.fulfilled, (state) => {

    state.exporting = false;

})

.addCase(exportAttendancePdf.rejected, (state, action) => {

    state.exporting = false;
    state.error = action.payload;

});


builder

.addCase(exportAttendanceExcel.pending, (state) => {

    state.exporting = true;

})

.addCase(exportAttendanceExcel.fulfilled, (state) => {

    state.exporting = false;

})

.addCase(exportAttendanceExcel.rejected, (state, action) => {

    state.exporting = false;
    state.error = action.payload;

});

    },

});

export const {
    clearReportsError,
} = reportsSlice.actions;

export default reportsSlice.reducer;