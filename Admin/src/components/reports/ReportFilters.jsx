import { Search, RotateCcw } from "lucide-react";

const ReportFilters = ({
    type,
    filters,
    setFilters,
    academicYears = [],
    classes = [],
    sections = [],
    exams = [],
    subjects = [],
    onSearch,
    onReset,
}) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5 items-center">
                
                {/* Academic Year */}
                <select
                    name="academic_year_id"
                    value={filters.academic_year_id || ""}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Academic Year</option>
                    {academicYears.map((item) => (
                        <option key={item.academic_year_id} value={item.academic_year_id}>
                            {item.year_start} - {item.year_end}
                        </option>
                    ))}
                </select>

                {/* Class */}
                <select
                    name="class_id"
                    value={filters.class_id || ""}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Class</option>
                    {classes.map((item) => (
                        <option key={item.class_id} value={item.class_id}>
                            {item.class_name}
                        </option>
                    ))}
                </select>

                {/* Section */}
                <select
                    name="section_id"
                    value={filters.section_id || ""}
                    onChange={handleChange}
                    className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                    <option value="">Section</option>
                    {sections.map((item) => (
                        <option key={item.section_id} value={item.section_id}>
                            {item.class_name} - {item.section_name}
                        </option>
                    ))}
                </select>

                {/* Student Status */}
                {type === "student" && (
                    <select
                        name="status"
                        value={filters.status || ""}
                        onChange={handleChange}
                        className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="">Status</option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                )}

                {/* Attendance */}
                {type === "attendance" && (
                    <>
                        <input
                            type="date"
                            name="attendance_date"
                            value={filters.attendance_date || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <select
                            name="status"
                            value={filters.status || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Attendance Status</option>
                            <option value="Present">Present</option>
                            <option value="Absent">Absent</option>
                            <option value="Leave">Leave</option>
                            <option value="Holiday">Holiday</option>
                            <option value="Half Day">Half Day</option>
                            <option value="Late">Late</option>
                        </select>
                    </>
                )}

                {/* Fee */}
                {type === "fee" && (
                    <>
                        <select
                            name="payment_mode"
                            value={filters.payment_mode || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Payment Mode</option>
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                            <option value="Bank">Bank</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                        <select
                            name="status"
                            value={filters.status || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Fee Status</option>
                            <option value="Paid">Paid</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Partial">Partial</option>
                        </select>
                    </>
                )}

                {/* Exam */}
                {type === "exam" && (
                    <>
                        <select
                            name="exam_id"
                            value={filters.exam_id || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select Exam</option>
                            {exams.map((exam) => (
                                <option key={exam.exam_id} value={exam.exam_id}>
                                    {exam.exam_name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="subject_id"
                            value={filters.subject_id || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                                <option key={subject.exam_subject_id} value={subject.subject_id}>
                                    {subject.subject_name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="status"
                            value={filters.status || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </>
                )}

                {/* Timetable */}
                {type === "timetable" && (
                    <>
                        <select
                            name="day_of_week"
                            value={filters.day_of_week || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                        </select>
                        <select
                            name="status"
                            value={filters.status || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </>
                )}

                {/* Certificate */}
                {type === "certificate" && (
                    <>
                        <select
                            name="certificate_type"
                            value={filters.certificate_type || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Certificate Type</option>
                            <option value="Leaving Certificate">Leaving Certificate</option>
                            <option value="Bonafide">Bonafide</option>
                            <option value="Transfer Certificate">Transfer Certificate</option>
                        </select>
                        <select
                            name="status"
                            value={filters.status || ""}
                            onChange={handleChange}
                            className="rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Status</option>
                            <option value="Generated">Generated</option>
                            <option value="Pending">Pending</option>
                            <option value="Draft">Draft</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </>
                )}

                {/* Search & Actions */}
                <div className="flex gap-2 lg:col-span-2">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search..."
                        value={filters.search || ""}
                        onChange={handleChange}
                        className="flex-1 rounded-lg border border-gray-300 p-2 text-sm text-gray-700 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        onClick={onSearch}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        <Search size={16} />
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={onReset}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    >
                        <RotateCcw size={16} className="text-gray-500" />
                        Reset
                    </button>
                </div>

            </div>
        </div>
    );
};

export default ReportFilters;