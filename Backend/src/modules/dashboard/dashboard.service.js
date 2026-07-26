const repository = require("./dashboard.repository");

/*
|--------------------------------------------------------------------------
| GET DASHBOARD DATA
|--------------------------------------------------------------------------
*/

exports.getDashboard = async () => {

    const [

        totalStudents,

        activeStudents,

        inactiveStudents,

        totalUsers,

        totalClasses,

        attendance,

        pendingFees,

        todayCollection,

        monthlyCollection,

        totalExams,

        totalResults,

        totalCertificates,

        recentAdmissions,

        recentCollections,

        lowAttendance,

        resultAnalysis

    ] = await Promise.all([

        repository.getTotalStudents(),

        repository.getActiveStudents(),

        repository.getInactiveStudents(),

        repository.getTotalUsers(),

        repository.getTotalClasses(),

        repository.getTodayAttendance(),

        repository.getPendingFees(),

        repository.getTodayCollection(),

        repository.getMonthlyCollection(),

        repository.getTotalExams(),

        repository.getTotalResults(),

        repository.getTotalCertificates(),

        repository.getRecentAdmissions(),

        repository.getRecentCollections(),

        repository.getLowAttendance(),

        repository.getResultAnalysis()

    ]);


    const attendancePercentage =

        Number(attendance.total_students || 0) > 0

            ? (

                (Number(attendance.present_students || 0) * 100)

                /

                Number(attendance.total_students)

            ).toFixed(2)

            : 0;


    return {

        students: {

            total: Number(
                totalStudents.total_students || 0
            ),

            active: Number(
                activeStudents.active_students || 0
            ),

            inactive: Number(
                inactiveStudents.inactive_students || 0
            )

        },


        users: {

            total: Number(
                totalUsers.total_users || 0
            )

        },


        classes: {

            total: Number(
                totalClasses.total_classes || 0
            )

        },


        attendance: {

            totalStudents: Number(
                attendance.total_students || 0
            ),

            present: Number(
                attendance.present_students || 0
            ),

            absent: Number(
                attendance.absent_students || 0
            ),

            percentage: Number(
                attendancePercentage
            )

        },


        fees: {

            pending: Number(
                pendingFees.pending_fee || 0
            ),

            todayCollection: Number(
                todayCollection.today_collection || 0
            ),

            monthlyCollection: Number(
                monthlyCollection.monthly_collection || 0
            )

        },


        exams: {

            total: Number(
                totalExams.total_exams || 0
            )

        },


        results: {

            total: Number(
                totalResults.total_results || 0
            ),

            pass: Number(
                resultAnalysis.pass_count || 0
            ),

            fail: Number(
                resultAnalysis.fail_count || 0
            ),

            passPercentage: Number(
                resultAnalysis.pass_percentage || 0
            ),

            failPercentage: Number(
                resultAnalysis.fail_percentage || 0
            )

        },


        certificates: {

            total: Number(
                totalCertificates.total_certificates || 0
            )

        },


        recentAdmissions,

        recentCollections,

        lowAttendance

    };

};