const db = require("../../config/database");
const query = require("./dashboard.query");

/*
|--------------------------------------------------------------------------
| STUDENTS
|--------------------------------------------------------------------------
*/

exports.getTotalStudents = async () => {

    const [rows] = await db.query(
        query.GET_TOTAL_STUDENTS
    );

    return rows[0];
};



exports.getActiveStudents = async () => {

    const [rows] = await db.query(
        query.GET_ACTIVE_STUDENTS
    );

    return rows[0];
};



exports.getInactiveStudents = async () => {

    const [rows] = await db.query(
        query.GET_INACTIVE_STUDENTS
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| USERS
|--------------------------------------------------------------------------
*/

exports.getTotalUsers = async () => {

    const [rows] = await db.query(
        query.GET_TOTAL_USERS
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| CLASSES
|--------------------------------------------------------------------------
*/

exports.getTotalClasses = async () => {

    const [rows] = await db.query(
        query.GET_TOTAL_CLASSES
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| ATTENDANCE
|--------------------------------------------------------------------------
*/

exports.getTodayAttendance = async () => {

    const [rows] = await db.query(
        query.GET_TODAY_ATTENDANCE
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| FEES
|--------------------------------------------------------------------------
*/

exports.getPendingFees = async () => {

    const [rows] = await db.query(
        query.GET_PENDING_FEES
    );

    return rows[0];
};



exports.getTodayCollection = async () => {

    const [rows] = await db.query(
        query.GET_TODAY_COLLECTION
    );

    return rows[0];
};



exports.getMonthlyCollection = async () => {

    const [rows] = await db.query(
        query.GET_MONTHLY_COLLECTION
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| EXAMS
|--------------------------------------------------------------------------
*/

exports.getTotalExams = async () => {

    const [rows] = await db.query(
        query.GET_TOTAL_EXAMS
    );

    return rows[0];
};



exports.getTotalResults = async () => {

    const [rows] = await db.query(
        query.GET_TOTAL_RESULTS
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| CERTIFICATES
|--------------------------------------------------------------------------
*/

exports.getTotalCertificates = async () => {

    const [rows] = await db.query(
        query.GET_TOTAL_CERTIFICATES
    );

    return rows[0];
};



/*
|--------------------------------------------------------------------------
| RECENT ADMISSIONS
|--------------------------------------------------------------------------
*/

exports.getRecentAdmissions = async () => {

    const [rows] = await db.query(
        query.GET_RECENT_ADMISSIONS
    );

    return rows;
};



/*
|--------------------------------------------------------------------------
| RECENT COLLECTIONS
|--------------------------------------------------------------------------
*/

exports.getRecentCollections = async () => {

    const [rows] = await db.query(
        query.GET_RECENT_COLLECTIONS
    );

    return rows;
};



/*
|--------------------------------------------------------------------------
| LOW ATTENDANCE
|--------------------------------------------------------------------------
*/

exports.getLowAttendance = async () => {

    const [rows] = await db.query(
        query.GET_LOW_ATTENDANCE
    );

    return rows;
};



/*
|--------------------------------------------------------------------------
| RESULT ANALYSIS
|--------------------------------------------------------------------------
*/

exports.getResultAnalysis = async () => {

    const [rows] = await db.query(
        query.GET_RESULT_ANALYSIS
    );

    return rows[0];
};