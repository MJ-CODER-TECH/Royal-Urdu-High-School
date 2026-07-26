import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import ReportFilters from "../../../components/reports/ReportFilters";
import ReportTable from "../../../components/reports/ReportTable";
import ReportActions from "../../../components/reports/ReportActions";


import {
    getExamReport,
    printExamReport,
    exportExamPdf,
    exportExamExcel

} from "../../../redux/reports/reportsThunk";


// Classes / Sections
import {
    fetchClasses,
    fetchSections

} from "../../../redux/timetable/timetableThunk";


// Academic Years
import {
    fetchAcademicYears

} from "../../../redux/master/academicYearThunk";


// Exams
import {
    getExams

} from "../../../redux/exam/examMaster/examThunk";


// Exam Subjects
import {
    getExamSubjects

} from "../../../redux/exam/examSubject/examSubjectThunk";





const ExamReportPage = () => {


    const dispatch = useDispatch();



    /*
    |--------------------------------------------------------------------------
    | REPORT DATA
    |--------------------------------------------------------------------------
    */


    const {

        examReports = [],
        examLoading = false

    } = useSelector(
        state => state.reports || {}
    );





    /*
    |--------------------------------------------------------------------------
    | MASTER DATA
    |--------------------------------------------------------------------------
    */


    const {

        academicYears = []

    } = useSelector(
        state => state.academicYear || {}
    );




    const {

        classes = [],
        sections = []

    } = useSelector(
        state => state.timetable || {}
    );






    /*
    |--------------------------------------------------------------------------
    | EXAM MASTER DATA
    |--------------------------------------------------------------------------
    */


    const {

        exams = []

    } = useSelector(
        state => state.exam || {}
    );





    /*
    |--------------------------------------------------------------------------
    | EXAM SUBJECT DATA
    |--------------------------------------------------------------------------
    */


    const {

        examSubjects = []

    } = useSelector(
        state => state.examSubject || {}
    );





    console.log(
        "SUBJECT DATA =>",
        examSubjects
    );





    const [filters,setFilters] = useState({

        academic_year_id:"",
        class_id:"",
        section_id:"",
        exam_id:"",
        subject_id:"",
        status:"",
        search:""

    });







    /*
    |--------------------------------------------------------------------------
    | LOAD DROPDOWNS
    |--------------------------------------------------------------------------
    */


    useEffect(()=>{


        dispatch(fetchAcademicYears());


        dispatch(fetchClasses());


        dispatch(fetchSections());


        dispatch(getExams());


        dispatch(getExamSubjects());


    },[dispatch]);









    /*
    |--------------------------------------------------------------------------
    | LOAD REPORT
    |--------------------------------------------------------------------------
    */


    useEffect(()=>{


        dispatch(
            getExamReport(filters)
        );


    },[
        filters,
        dispatch
    ]);









    /*
    |--------------------------------------------------------------------------
    | PRINT
    |--------------------------------------------------------------------------
    */


    const handlePrint = ()=>{


        dispatch(
            printExamReport(filters)
        );


    };








    /*
    |--------------------------------------------------------------------------
    | PDF
    |--------------------------------------------------------------------------
    */


    const handlePdf = async()=>{


        const blob = await dispatch(
            exportExamPdf(filters)
        ).unwrap();



        const url =
            window.URL.createObjectURL(blob);



        const link =
            document.createElement("a");



        link.href = url;


        link.download =
            "exam-report.pdf";



        link.click();


    };









    /*
    |--------------------------------------------------------------------------
    | EXCEL
    |--------------------------------------------------------------------------
    */


    const handleExcel = async()=>{


        const blob = await dispatch(
            exportExamExcel(filters)
        ).unwrap();



        const url =
            window.URL.createObjectURL(blob);



        const link =
            document.createElement("a");



        link.href = url;



        link.download =
            "exam-report.xlsx";



        link.click();


    };









    /*
    |--------------------------------------------------------------------------
    | RESET
    |--------------------------------------------------------------------------
    */


    const handleReset = ()=>{


        setFilters({

            academic_year_id:"",
            class_id:"",
            section_id:"",
            exam_id:"",
            subject_id:"",
            status:"",
            search:""

        });


    };









    return (

        <div className="p-6">


            <div className="flex justify-between mb-5">


                <h1 className="text-2xl font-bold">
                    Exam Report
                </h1>




                <ReportActions

                    onPrint={handlePrint}

                    onPdf={handlePdf}

                    onExcel={handleExcel}

                />


            </div>







            <ReportFilters

                type="exam"

                filters={filters}

                setFilters={setFilters}


                academicYears={academicYears}

                classes={classes}

                sections={sections}


                exams={exams}

                subjects={examSubjects}


                onReset={handleReset}

            />









            <ReportTable

                type="exam"

                loading={examLoading}

                data={examReports}

            />




        </div>

    );

};


export default ExamReportPage;