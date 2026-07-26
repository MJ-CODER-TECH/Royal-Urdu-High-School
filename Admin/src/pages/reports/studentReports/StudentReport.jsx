import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAcademicYears } from "../../../redux/master/academicYearThunk";
import {
    fetchClasses,
    fetchSections,
} from "../../../redux/timetable/timetableThunk";
import {
    getStudentReport,
    printStudentReport,
    exportStudentPdf,
    exportStudentExcel,
} from "../../../redux/reports/reportsThunk";

import ReportFilters from "../../../components/reports/ReportFilters";
import ReportTable from "../../../components/reports/ReportTable";
import ReportActions from "../../../components/reports/ReportActions";

const initialFilters = {
    academic_year_id: "",
    class_id: "",
    section_id: "",
    status: "",
    search: "",
};

const StudentReport = () => {
    const dispatch = useDispatch();

    const {
        studentReports,
        loading,
        exporting,
    } = useSelector((state) => state.reports);

    const { academicYears } = useSelector((state) => state.academicYear);
    const { classes, sections } = useSelector((state) => state.timetable);

    const [filters, setFilters] = useState(initialFilters);

    // Initial data fetch on mount
    useEffect(() => {
        dispatch(fetchAcademicYears());
        dispatch(fetchClasses());
        dispatch(fetchSections());
        dispatch(getStudentReport({}));
    }, [dispatch]);

    const handleSearch = () => {
        dispatch(getStudentReport(filters));
    };

    const handleReset = () => {
        setFilters(initialFilters);
        dispatch(getStudentReport(initialFilters));
    };

    const handlePrint = () => {
        dispatch(printStudentReport(filters));
    };

    const handlePdf = () => {
        dispatch(exportStudentPdf(filters));
    };

    const handleExcel = () => {
        dispatch(exportStudentExcel(filters));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Student Report
                    </h1>
                    <p className="text-gray-500">
                        View, Print and Export Student Reports
                    </p>
                </div>

                <ReportActions
                    exporting={exporting}
                    onPrint={handlePrint}
                    onPdf={handlePdf}
                    onExcel={handleExcel}
                />
            </div>

            <ReportFilters
                type="student"
                filters={filters}
                setFilters={setFilters}
                academicYears={academicYears}
                classes={classes}
                sections={sections}
                onSearch={handleSearch}
                onReset={handleReset}
            />

            <ReportTable
                type="student"
                loading={loading}
                data={studentReports}
            />
        </div>
    );
};

export default StudentReport;