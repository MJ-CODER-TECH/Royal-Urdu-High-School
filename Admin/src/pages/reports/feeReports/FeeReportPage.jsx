import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ReportsFilters from "../../../components/reports/ReportFilters";
import ReportAction from "../../../components/reports/ReportActions";
import ReportTable from "../../../components/reports/ReportTable";

import { fetchAcademicYears } from "../../../redux/master/AcademicYearThunk";
import {
    fetchClasses,
    fetchSections,
} from "../../../redux/timetable/timetableThunk";

import {
    getFeeReport,
    printFeeReport,
    exportFeePdf,
    exportFeeExcel
} from "../../../redux/reports/reportsThunk";


const FeeReportPage = () => {


    const dispatch = useDispatch();


    const {
        feeReports,
        feeLoading
    } = useSelector(
        state => state.reports
    );


    const {
        academicYears,
    } = useSelector((state) => state.academicYear);


    const {
        classes,
        sections,
    } = useSelector((state) => state.timetable);


    const initialFilters = {

        academic_year_id: "",
        class_id: "",
        section_id: "",
        payment_mode: "",
        status: "",
        search: ""

    };


    const [filters, setFilters] = useState(initialFilters);


    // Only fetch on mount. Actual filtering happens via the
    // Search button (handleSearch) — same pattern as StudentReport.
    useEffect(() => {

        dispatch(fetchAcademicYears());
        dispatch(fetchClasses());
        dispatch(fetchSections());

        dispatch(
            getFeeReport(filters)
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);


    const handleSearch = () => {

        dispatch(
            getFeeReport(filters)
        );

    };


    const handleReset = () => {

        setFilters(initialFilters);

        dispatch(
            getFeeReport(initialFilters)
        );

    };


    const handlePrint = () => {

        dispatch(
            printFeeReport(filters)
        );

    };


    const handlePdf = async () => {

        const blob = await dispatch(
            exportFeePdf(filters)
        ).unwrap();


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "fee-report.pdf";


        link.click();

    };


    const handleExcel = async () => {

        const blob = await dispatch(
            exportFeeExcel(filters)
        ).unwrap();


        const url =
            window.URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "fee-report.xlsx";


        link.click();

    };


    return (

        <div className="p-6">


            <div className="flex justify-between mb-5">

                <h1 className="text-2xl font-bold">
                    Fee Report
                </h1>


                <ReportAction

                    onPrint={handlePrint}

                    onPdf={handlePdf}

                    onExcel={handleExcel}

                />


            </div>


            <ReportsFilters

                filters={filters}

                setFilters={setFilters}

                type="fee"

                academicYears={academicYears}

                classes={classes}

                sections={sections}

                onSearch={handleSearch}

                onReset={handleReset}

            />


            <ReportTable

                loading={feeLoading}

                data={feeReports}

                type="fee"

            />


        </div>

    );

};


export default FeeReportPage;