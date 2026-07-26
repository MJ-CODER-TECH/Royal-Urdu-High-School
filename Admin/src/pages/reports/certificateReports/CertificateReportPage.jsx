import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    getCertificateReport,
    printCertificateReport,
    exportCertificatePdf,
    exportCertificateExcel,
} from "../../../redux/reports/reportsThunk";

import ReportFilters from "../../../components/reports/ReportFilters";
import ReportActions from "../../../components/reports/ReportActions";
import ReportTable from "../../../components/reports/ReportTable";

import { fetchAcademicYears } from "../../../redux/master/academicYearThunk";
import { fetchClasses } from "../../../redux/master/Classmasterthunk";
import { fetchSections } from "../../../redux/section/sectionthunk";

const CertificateReportPage = () => {

    const dispatch = useDispatch();

    const {

        certificateReports,

        loading,

        exporting,

    } = useSelector(
        (state) => state.reports
    );

   const { classes } = useSelector(
    (state) => state.classMaster
);

const { sections } = useSelector(
    (state) => state.section
);

const { academicYears } = useSelector(
    (state) => state.academicYear
);

    const [filters, setFilters] = useState({

        academic_year_id: "",

        class_id: "",

        section_id: "",

        certificate_type: "",

        status: "",

        search: "",

    });

    useEffect(() => {

        dispatch(
            getCertificateReport(filters)
        );

    }, [dispatch, filters]);

    useEffect(() => {

        dispatch(fetchAcademicYears());

        dispatch(fetchClasses());

        dispatch(fetchSections());

    }, [dispatch]);

    const handlePrint = () => {

        dispatch(
            printCertificateReport(filters)
        );

    };

    const handlePdf = () => {

        dispatch(
            exportCertificatePdf(filters)
        );

    };

    const handleExcel = () => {

        dispatch(
            exportCertificateExcel(filters)
        );

    };

    return (

        <div className="space-y-6">

            <div>

                <h1 className="text-2xl font-bold">
                    Certificate Report
                </h1>

                <p className="text-gray-500">
                    View, Print and Export Certificate Report
                </p>

            </div>

            <ReportFilters

                type="certificate"

                filters={filters}

                setFilters={setFilters}

                academicYears={academicYears}

                classes={classes}

                sections={sections}

                onSearch={() =>
                    dispatch(
                        getCertificateReport(filters)
                    )
                }

                onReset={() => {

                    const reset = {

                        academic_year_id: "",

                        class_id: "",

                        section_id: "",

                        certificate_type: "",

                        status: "",

                        search: "",

                    };

                    setFilters(reset);

                    dispatch(
                        getCertificateReport(reset)
                    );

                }}

            />

            <ReportActions

                exporting={exporting}

                onPrint={handlePrint}

                onPdf={handlePdf}

                onExcel={handleExcel}

            />

            <ReportTable

                type="certificate"

                loading={loading}

                data={certificateReports}

            />

        </div>

    );

};

export default CertificateReportPage;