import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getTimetableReport,
    printTimetableReport,
    exportTimetablePdf,
    exportTimetableExcel,
} from "../../../redux/reports/reportsThunk";

import ReportFilters from "../../../components/reports/ReportFilters";
import ReportActions from "../../../components/reports/ReportActions";
import ReportTable from "../../../components/reports/ReportTable";

import { fetchAcademicYears } from "../../../redux/master/academicYearThunk";
import { fetchClasses } from "../../../redux/master/Classmasterthunk";
import { fetchSections } from "../../../redux/section/sectionthunk";

const TimetableReport = () => {

    const dispatch = useDispatch();

    const {
        timetableReports,
        loading,
        exporting,
    } = useSelector((state) => state.reports);

    const [filters, setFilters] = useState({
        academic_year_id: "",
        class_id: "",
        section_id: "",
        day_of_week: "",
        status: "",
    });

    useEffect(() => {

        dispatch(
            getTimetableReport(filters)
        );

    }, [dispatch, filters]);

    const handleFilterChange = (field, value) => {

        setFilters((prev) => ({
            ...prev,
            [field]: value,
        }));

    };

    const handlePrint = () => {

        dispatch(
            printTimetableReport(filters)
        );

    };

    const handlePdf = () => {

        dispatch(
            exportTimetablePdf(filters)
        );

    };

    const handleExcel = () => {

        dispatch(
            exportTimetableExcel(filters)
        );

    };

    const { academicYears } = useSelector(
    (state) => state.academicYear
);

const { classes } = useSelector(
    (state) => state.classMaster
);

const { sections } = useSelector(
    (state) => state.section
);


useEffect(() => {

    dispatch(fetchAcademicYears());
    dispatch(fetchClasses());
    dispatch(fetchSections());

}, [dispatch]);


    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-bold">
                    Timetable Report
                </h1>

                <p className="text-gray-500">
                    View, Print and Export Timetable Report
                </p>

            </div>

           <ReportFilters
    type="timetable"
    filters={filters}
    setFilters={setFilters}
    academicYears={academicYears}
    classes={classes}
    sections={sections}
    onSearch={() => dispatch(getTimetableReport(filters))}
    onReset={() => {

        const reset = {
            academic_year_id: "",
            class_id: "",
            section_id: "",
            day_of_week: "",
            status: "",
            search: "",
        };

        setFilters(reset);
        dispatch(getTimetableReport(reset));

    }}
/>

            <ReportActions
                exporting={exporting}
                onPrint={handlePrint}
                onPdf={handlePdf}
                onExcel={handleExcel}
            />

            <ReportTable
                type="timetable"
                loading={loading}
                data={timetableReports}
            />

        </div>

    );

};

export default TimetableReport;