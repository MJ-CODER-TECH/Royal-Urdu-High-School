import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getAttendanceReport,
    printAttendanceReport,
    exportAttendancePdf,
    exportAttendanceExcel,
} from "../../../redux/reports/reportsThunk";

import {
    getAcademicYearsApi,
    getClassesApi,
    getSectionsApi,
} from "../../../api/master.api";

import ReportFilters from "../../../components/reports/ReportFilters";
import ReportTable from "../../../components/reports/ReportTable";
import ReportActions from "../../../components/reports/ReportActions";

const AttendanceReportPage = () => {

    const dispatch = useDispatch();

    const {
        attendanceReports,
        loading,
        exporting,
    } = useSelector(
        (state) => state.reports
    );

    const [academicYears, setAcademicYears] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    const [filters, setFilters] = useState({

        academic_year_id: "",
        class_id: "",
        section_id: "",

        attendance_date: "",
        status: "",
        search: "",

        class_name: "",
        section_name: "",

    });

    /*
    |--------------------------------------------------------------------------
    | LOAD MASTER DATA
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadMasters();

    }, []);

    const loadMasters = async () => {

        try {

            const years = await getAcademicYearsApi();
            const cls = await getClassesApi();
            const sec = await getSectionsApi();

            setAcademicYears(years || []);
            setClasses(cls || []);
            setSections(sec || []);

        } catch (error) {

            console.error(error);

        }

    };

    /*
    |--------------------------------------------------------------------------
    | LOAD REPORT
    |--------------------------------------------------------------------------
    */

    const loadReport = () => {

        dispatch(
            getAttendanceReport(filters)
        );

    };

    /*
    |--------------------------------------------------------------------------
    | CLASS CHANGE
    |--------------------------------------------------------------------------
    */

    const handleClassChange = (value) => {

        const selected = classes.find(
            (item) =>
                String(item.class_id) === String(value)
        );

        setFilters((prev) => ({

            ...prev,

            class_id: value,
            class_name: selected?.class_name || "",

            section_id: "",
            section_name: "",

        }));

    };

        /*
    |--------------------------------------------------------------------------
    | SECTION CHANGE
    |--------------------------------------------------------------------------
    */

    const handleSectionChange = (value) => {

        const selected = sections.find(
            (item) =>
                String(item.section_id) === String(value)
        );

        setFilters((prev) => ({

            ...prev,

            section_id: value,
            section_name: selected?.section_name || "",

        }));

    };

    /*
    |--------------------------------------------------------------------------
    | PRINT
    |--------------------------------------------------------------------------
    */

    const handlePrint = () => {

        dispatch(
            printAttendanceReport(filters)
        );

    };

    /*
    |--------------------------------------------------------------------------
    | EXPORT PDF
    |--------------------------------------------------------------------------
    */

    const handlePdf = () => {

        dispatch(
            exportAttendancePdf(filters)
        );

    };

    /*
    |--------------------------------------------------------------------------
    | EXPORT EXCEL
    |--------------------------------------------------------------------------
    */

    const handleExcel = () => {

        dispatch(
            exportAttendanceExcel(filters)
        );

    };

    /*
    |--------------------------------------------------------------------------
    | FILTERED SECTIONS
    |--------------------------------------------------------------------------
    */

    const filteredSections = sections.filter(

        (item) =>

            !filters.class_id ||

            String(item.class_id) ===
            String(filters.class_id)

    );

    /*
    |--------------------------------------------------------------------------
    | FILTER CHANGE
    |--------------------------------------------------------------------------
    */

    const handleFiltersChange = (data) => {

        if (
            data.class_id !== filters.class_id
        ) {

            handleClassChange(data.class_id);
            return;

        }

        if (
            data.section_id !== filters.section_id
        ) {

            handleSectionChange(data.section_id);
            return;

        }

        setFilters(data);

    };

    /*
    |--------------------------------------------------------------------------
    | RESET FILTERS
    |--------------------------------------------------------------------------
    */

    const handleReset = () => {

        setFilters({

            academic_year_id: "",
            class_id: "",
            section_id: "",

            attendance_date: "",
            status: "",
            search: "",

            class_name: "",
            section_name: "",

        });

    };

    return (

        <div className="p-6">

            <div className="mb-6 flex items-center justify-between">

                <h2 className="text-2xl font-bold">

                    Attendance Report

                </h2>

                <ReportActions
                    exporting={exporting}
                    onPrint={handlePrint}
                    onPdf={handlePdf}
                    onExcel={handleExcel}
                />
      
            </div>

                        <ReportFilters
                type="attendance"
                filters={filters}
                setFilters={handleFiltersChange}
                academicYears={academicYears}
                classes={classes}
                sections={filteredSections}
                onSearch={loadReport}
                onReset={handleReset}
            />

            <div className="mt-6">

                <ReportTable
                    type="attendance"
                    loading={loading}
                    data={attendanceReports}
                />

            </div>

        </div>

    );

};

export default AttendanceReportPage;