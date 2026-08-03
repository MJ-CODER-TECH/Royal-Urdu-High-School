import { Routes, Route, Navigate } from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../layouts/DashboardLayout";

// Auth
import Login from "../pages/auth/Login";

// Dashboard
import DashboardPage from "../pages/dashboard/DashboardPage";
// User Management
import UsersPage from "../pages/user/UsersPage";
import UserForm from "../pages/user/UserForm";

// Student Management
import StudentsPage from "../pages/student/StudentsPage";
import StudentForm from "../pages/student/StudentForm";
import StudentView from "../pages/student/StudentView";
import CertificatePage from "../pages/certificate/CertificatesPage";
import AttendancePage from "../pages/attendance/AttendancePage";
import AttendanceRegisterPage from "../pages/attendance/AttendanceRegisterPage";
import FeeHeadPage from "../pages/fee/feeHead/FeeHeadPage";
import FeeStructurePage from "../pages/fee/feeStructure/FeeStructurePage";
import StudentFeePage from "../pages/fee/studentFee/StudentFeePage";
import FeeCollectionPage from "../pages/fee/feeCollection/FeeCollectionPage";
import ClassPage from "../pages/master/classMaster/ClassPage";
import SectionPage from "../pages/master/sectionMaster/SectionPage";
import AcademicYearPage from "../pages/master/academicYear/AcademicYearPage";
import ExamPage from "../pages/exam/examMaster/ExamPage";
import ExamSubjectPage from "../pages/exam/examSubject/ExamSubjectPage";
import MarksEntryPage from "../pages/exam/examMark/MarksEntryPage"
import ResultPage from "../pages/exam/result/ResultPage";
import TimetablePage from "../pages/timetable/TimetablePage";
import ClassTimetableView from "../pages/timetable/ClassTimetableView";
import TeacherTimetableView from "../pages/timetable/TeacherTimetableView";
import ReportsPage from "../pages/reports/ReportsPage"
import StudentReport from "../pages/reports/studentReports/StudentReport"
import AttendanceReportPage from "../pages/reports/attendanceReports/AttendanceReportPage";
import FeeReportPage from "../pages/reports/feeReports/FeeReportPage";
import ExamReportPage from "../pages/reports/examReports/ExamReportPage";
import TimetableReport from "../pages/reports/timeTableReports/TimetableReport";
import CertificateReportPage from "../pages/reports/certificateReports/CertificateReportPage";
import ProfilePage from "../pages/profile/ProfilePage";
import PromotionPage from "../pages/promotion/PromotionPage";
import PromotionHistoryPage from "../pages/promotion/PromotionHistoryPage";
import SchoolProfilePage from "../pages/schoolProfile/SchoolProfilePage";
import SubjectsPage from "../pages/subjects/SubjectsPage";

const AppRoutes = () => {
    return (
        <Routes>
            {/* ================= AUTH ================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* ================ PRIVATE ================ */}

            <Route element={<PrivateRoute />}>
                <Route element={<DashboardLayout />}>

                    {/* Dashboard */}

                    <Route
    path="/dashboard"
    element={<DashboardPage />}
/>

<Route
 path="/profile"
 element={<ProfilePage />}
/>

<Route
    path="/subjects"
    element={<SubjectsPage />}
/>

                    {/* ================= USER MANAGEMENT ================= */}

                    <Route
                        path="/users"
                        element={<UsersPage />}
                    />

                    <Route
                        path="/users/create"
                        element={<UserForm />}
                    />

                    <Route
                        path="/users/edit/:id"
                        element={<UserForm />}
                    />

                    {/* ================= STUDENT MANAGEMENT ================= */}

                    <Route
                        path="/students"
                        element={<StudentsPage />}
                    />

                    <Route
                        path="/students/admission"
                        element={<StudentForm />}
                    />

                    <Route
                        path="/students/edit/:id"
                        element={<StudentForm />}
                    />

                    <Route
                        path="/students/view/:id"
                        element={<StudentView />}
                    />
                    <Route
                        path="/certificates"
                        element={<CertificatePage />}
                    />
                    <Route
                        path="/attendance"
                        element={<AttendancePage />}
                    />
                    <Route
    path="/attendance/register"
    element={<AttendanceRegisterPage />}
/>






{/* ================= Master MANAGEMENT ================= */}

<Route
    path="/school-profile"
    element={<SchoolProfilePage />}
/>

<Route
    path="/master/classes"
    element={<ClassPage />}
/>
<Route
    path="/master/sections"
    element={<SectionPage />}
/>
<Route
    path="/master/academic-years"
    element={<AcademicYearPage />}
/>

<Route
    path="/timetable"
    element={<TimetablePage />}
/>

<Route
 path="/timetable/class-view"
 element={<ClassTimetableView/>}
/>

<Route
 path="/timetable/teacher-view"
 element={<TeacherTimetableView />}
/>

{/* ================= FEE MANAGEMENT ================= */}

<Route
    path="/fee-heads"
    element={<FeeHeadPage />}
/>
<Route

    path="/fee-structure"

    element={<FeeStructurePage />}

/>
<Route
    path="/fees/fee-student"
    element={<StudentFeePage />}
/>

<Route
    path="/fees/fee-collection"
    element={<FeeCollectionPage />}
/>



{/* ================= Exam MANAGEMENT ================= */}



<Route
    path="/exam-management"
    element={<ExamPage />}
/>

<Route
    path="/exam-subjects"
    element={<ExamSubjectPage />}
/>
 <Route
    path="/marks-entry"
    element={<MarksEntryPage />}
/>

<Route
    path="/exam/result"
    element={
        <ResultPage />
    }
/>






{/* ================= Reports MANAGEMENT ================= */}


<Route
    path="/reports"
    element={<ReportsPage />}
/>

<Route
    path="/reports/students"
    element={<StudentReport />}
/>
<Route
    path="/reports/attendance"
    element={<AttendanceReportPage />}
/>

<Route
    path="/reports/fees"
    element={<FeeReportPage />}
/>

<Route
    path="/reports/exams"
    element={<ExamReportPage />}
/>

<Route
    path="/reports/timetable"
    element={<TimetableReport />}
/>

<Route
    path="/reports/certificate"
    element={<CertificateReportPage />}
/>



<Route
    path="/promotion"
    element={<PromotionPage />}
/>

<Route
    path="/promotion/history"
    element={<PromotionHistoryPage />}
/>  

                    {/* ================= FUTURE MODULES ================= */}

                    {/*
                    <Route path="/attendance" element={<AttendancePage />} />
                    <Route path="/fees/collection" element={<FeeCollection />} />
                    <Route path="/exam" element={<ExamPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/roles" element={<RolesPage />} />
                    */}

                </Route>
            </Route>

            {/* Default Route */}

            <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
            />

            {/* 404 */}

            <Route
                path="*"
                element={<Navigate to="/dashboard" replace />}
            />
        </Routes>
    );
};

export default AppRoutes;