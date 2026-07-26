import React from "react";

// Helper function to safely format dates
const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB");
};

// Helper function to format currency
const formatCurrency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

// Configuration map for all report types
const reportConfigs = {
    student: {
        keyField: "student_id",
        columns: [
            { header: "#", cell: (_, index) => index + 1 },
            { header: "Admission No", accessor: "admission_no" },
            { 
                header: "Student Name", 
                cell: (item) => [item.first_name, item.middle_name, item.last_name].filter(Boolean).join(" ") 
            },
            { header: "Class", accessor: "class_name" },
            { header: "Section", accessor: "section_name" },
            { header: "Mobile", accessor: "mobile" },
            { header: "Gender", accessor: "gender" },
            {
                header: "Status",
                cell: (item) => (
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                        {item.status}
                    </span>
                )
            }
        ]
    },
    attendance: {
        keyField: "attendance_id",
        columns: [
            { header: "Date", cell: (item) => formatDate(item.attendance_date) },
            { header: "Admission No", accessor: "admission_no" },
            { header: "Roll No", accessor: "roll_no" },
            { header: "Student", accessor: "student_name" },
            { header: "Class", accessor: "class_name" },
            { header: "Section", accessor: "section_name" },
            { header: "Status", accessor: "status" },
            { header: "Check In", cell: (item) => item.check_in || "-" },
            { header: "Check Out", cell: (item) => item.check_out || "-" },
            { header: "Remarks", cell: (item) => item.remarks || "-" }
        ]
    },
    fee: {
        keyField: "collection_id",
        columns: [
            { header: "Receipt No", cell: (item) => item.receipt_no || "-" },
            { header: "Date", cell: (item) => formatDate(item.payment_date) },
            { header: "Admission No", cell: (item) => item.admission_no || "-" },
            { header: "Roll No", cell: (item) => item.roll_no || "-" },
            { header: "Student Name", cell: (item) => item.student_name || "-" },
            { header: "Class", cell: (item) => item.class_name || "-" },
            { header: "Section", cell: (item) => item.section_name || "-" },
            { header: "Total Fee", cell: (item) => formatCurrency(item.total_fee) },
            { header: "Paid", cell: (item) => formatCurrency(item.paid_amount) },
            { header: "Balance", cell: (item) => formatCurrency(item.balance_amount) },
            { header: "Payment Mode", cell: (item) => item.payment_mode || "-" },
            {
                header: "Status",
                cell: (item) => {
                    const statusStyles = {
                        Paid: "bg-green-100 text-green-700",
                        Partial: "bg-yellow-100 text-yellow-700",
                    };
                    return (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[item.status] || "bg-red-100 text-red-700"}`}>
                            {item.status}
                        </span>
                    );
                }
            }
        ]
    },
    exam: {
        keyField: "mark_id",
        columns: [
            { header: "Exam", accessor: "exam_name" },
            { header: "Date", cell: (item) => formatDate(item.exam_date) },
            { header: "Admission No", accessor: "admission_no" },
            { header: "Student", accessor: "student_name" },
            { header: "Class", accessor: "class_name" },
            { header: "Section", accessor: "section_name" },
            { header: "Subject", accessor: "subject_name" },
            { header: "Max Marks", accessor: "max_marks" },
            { header: "Obtained", accessor: "obtained_marks" },
            { 
                header: "Grade", 
                cell: (item) => <span className="inline-flex rounded-full bg-blue-100 text-blue-700 px-2.5 py-0.5 text-xs font-medium">{item.grade || "-"}</span> 
            },
            {
                header: "Result",
                cell: (item) => {
                    const isPass = item.obtained_marks >= item.pass_marks;
                    return (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${isPass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {isPass ? "PASS" : "FAIL"}
                        </span>
                    );
                }
            }
        ]
    },
    timetable: {
        keyField: "timetable_id",
        columns: [
            { header: "Day", accessor: "day_of_week" },
            { header: "Period", accessor: "period_no" },
            { header: "Time", cell: (item) => `${item.start_time} - ${item.end_time}` },
            { header: "Class", accessor: "class_name" },
            { header: "Section", accessor: "section_name" },
            { header: "Subject", accessor: "subject_name" },
            { header: "Teacher", cell: (item) => item.teacher_name || "-" },
            { header: "Room", cell: (item) => item.room || "-" },
            {
                header: "Status",
                cell: (item) => (
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${item.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {item.status}
                    </span>
                )
            }
        ]
    },
    certificate: {
        keyField: "certificate_id",
        columns: [
            { header: "Certificate No", cell: (item) => item.certificate_no || "-" },
            { header: "Admission No", accessor: "admission_no" },
            { header: "Student Name", cell: (item) => item.student_name || "-" },
            { header: "Class", accessor: "class_name" },
            { header: "Section", accessor: "section_name" },
            { header: "Certificate Type", cell: (item) => item.certificate_type || "-" },
            { header: "Issue Date", cell: (item) => formatDate(item.issue_date) },
            { header: "Generated By", cell: (item) => item.generated_by || "-" },
            {
                header: "Status",
                cell: (item) => {
                    const statusStyles = {
                        Generated: "bg-green-100 text-green-700",
                        Pending: "bg-yellow-100 text-yellow-700",
                        Draft: "bg-blue-100 text-blue-700",
                    };
                    return (
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[item.status] || "bg-red-100 text-red-700"}`}>
                            {item.status}
                        </span>
                    );
                }
            }
        ]
    }
};

const ReportTable = ({ type, loading, data = [] }) => {
    if (loading) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500 font-medium shadow-sm">
                Loading records...
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500 font-medium shadow-sm">
                No Records Found
            </div>
        );
    }

    const config = reportConfigs[type];

    if (!config) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-10 text-center text-gray-500 font-medium shadow-sm">
                This report is under development.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full border-collapse text-left text-sm text-gray-700">
                <thead className="bg-gray-100 text-xs uppercase text-gray-700 font-semibold">
                    <tr>
                        {config.columns.map((col, idx) => {
                            const isLast = idx === config.columns.length - 1;
                            return (
                                <th 
                                    key={idx} 
                                    className={`border-b border-gray-200 px-4 py-3 ${!isLast ? "border-r border-gray-200" : ""}`}
                                >
                                    {col.header}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((item, index) => (
                        <tr key={item[config.keyField] || index} className="hover:bg-gray-50 transition-colors">
                            {config.columns.map((col, colIdx) => {
                                const isLast = colIdx === config.columns.length - 1;
                                return (
                                    <td 
                                        key={colIdx} 
                                        className={`border-b border-gray-200 px-4 py-2.5 ${!isLast ? "border-r border-gray-200" : ""}`}
                                    >
                                        {col.cell ? col.cell(item, index) : (item[col.accessor] ?? "-")}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportTable;