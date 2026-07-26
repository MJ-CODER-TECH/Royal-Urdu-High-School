import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./auth/authSlice";
import userReducer from "./user/userSlice";
import studentReducer from "./student/studentSlice";
import classMasterReducer from "./master/classMasterSlice";
import sectionReducer from "./section/sectionslice";
import certificateReducer from "./certificate/certificateSlice";
import attendanceReducer from "./attendance/attendanceSlice";
import feeHeadReducer from "./fee/feeHead/feeHeadSlice";
import feeStructureReducer from "./fee/feeStructure/feeStructureSlice";
import academicYearReducer from "./master/academicYearSlice";
import studentFeeReducer from "./fee/studentFee/studentFeeSlice";
import feeCollectionReducer from "./fee/feeCollection/feeCollectionSlice"
import examReducer from "./exam/examMaster/examSlice";
import examSubjectReducer from "./exam/examSubject/examSubjectSlice";
import markReducer from "./exam/examMark/markSlice";
import resultReducer from "./exam/result/resultSlice";
import dashboardReducer from "./dashboard/dashboardSlice";
import timetableReducer from "./timetable/timetableSlice";
import reportsReducer from "./reports/reportsSlice";


export const store = configureStore({

    reducer: {

        auth: authReducer,
        user: userReducer,
        student: studentReducer,
        classMaster: classMasterReducer,
        section: sectionReducer,
        certificate: certificateReducer,
        attendance: attendanceReducer,
        feeHead: feeHeadReducer,
        feeStructure: feeStructureReducer,
        academicYear: academicYearReducer,
        studentFee: studentFeeReducer,
        feeCollection: feeCollectionReducer,
        exam: examReducer,
        examSubject: examSubjectReducer,
        mark: markReducer,
        result: resultReducer,
        dashboard: dashboardReducer,
        timetable: timetableReducer,
        reports: reportsReducer,

    },

});