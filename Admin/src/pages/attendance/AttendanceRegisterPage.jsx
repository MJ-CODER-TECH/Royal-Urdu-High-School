import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import {
  ClipboardList,
  Filter,
  Loader2,
  Save,
  UserCheck,
  UserX,
} from "lucide-react";

import {
  getClassesApi,
  getSectionsApi,
} from "../../api/master.api";

import {
  getStudentsApi,
} from "../../api/student.api";

import {
  getAttendanceApi,
} from "../../api/attendance.api";

import {
  bulkAttendance,
} from "../../redux/attendance/attendanceThunk";

import AttendanceRegisterTable from "./AttendanceRegisterTable";


/* =====================================================
   TODAY DATE
===================================================== */

const todayDate = () => {

  return new Date()
    .toISOString()
    .split("T")[0];

};


/* =====================================================
   COMPONENT
===================================================== */

const AttendanceRegisterPage = () => {


  const dispatch = useDispatch();


  /* =====================================================
     MASTER DATA
  ===================================================== */

  const [classes, setClasses] = useState([]);

  const [sections, setSections] = useState([]);


  /* =====================================================
     FILTER VALUES
  ===================================================== */

  const [classId, setClassId] = useState("");

  const [sectionId, setSectionId] = useState("");

  const [attendanceDate, setAttendanceDate] =
    useState(todayDate());


  /* =====================================================
     STUDENT ATTENDANCE DATA
  ===================================================== */

  const [students, setStudents] = useState([]);

  const [statusMap, setStatusMap] = useState({});

  const [remarksMap, setRemarksMap] = useState({});


  /* =====================================================
     LOADING STATES
  ===================================================== */

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [saving, setSaving] =
    useState(false);


  /* =====================================================
     FILTER SECTIONS BY SELECTED CLASS
  ===================================================== */

  const filteredSections = useMemo(() => {


    if (!classId) {

      return [];

    }


    return sections.filter((section) => {


      /*
      Supports different backend field names:

      section.class_id

      section.classId

      */


      const sectionClassId =

        section.class_id
        ??
        section.classId
        ??
        "";


      return String(sectionClassId)
        ===
        String(classId);


    });


  }, [

    sections,

    classId,

  ]);



  /* =====================================================
     LOAD CLASSES AND SECTIONS
  ===================================================== */

  useEffect(() => {


    const loadMasters = async () => {


      try {


        const [

          classResponse,

          sectionResponse,

        ] = await Promise.all([

          getClassesApi(),

          getSectionsApi(),

        ]);


        /*
        Supports API response formats:

        []

        { data: [] }

        { classes: [] }

        { sections: [] }

        */


        const classList =

          Array.isArray(classResponse)

            ? classResponse

            : (

              classResponse?.data

              ||

              classResponse?.classes

              ||

              []

            );


        const sectionList =

          Array.isArray(sectionResponse)

            ? sectionResponse

            : (

              sectionResponse?.data

              ||

              sectionResponse?.sections

              ||

              []

            );


        setClasses(

          classList

        );


        setSections(

          sectionList

        );


      } catch (error) {


        console.error(

          "Failed to load master data:",

          error

        );


        setClasses([]);

        setSections([]);


      }


    };


    loadMasters();


  }, []);



  /* =====================================================
     LOAD STUDENTS + EXISTING ATTENDANCE
  ===================================================== */

  useEffect(() => {


    const loadStudents = async () => {


      /*
      Class and Section are compulsory
      */


      if (

        !classId

        ||

        !sectionId

      ) {


        setStudents([]);


        setStatusMap({});


        setRemarksMap({});


        return;


      }


      setLoadingStudents(true);


      try {


        const [

          studentsResponse,

          attendanceResponse,

        ] = await Promise.all([


          getStudentsApi({


            classId:

              classId,


            sectionId:

              sectionId,


            status:

              "Active",


            page:

              1,


            limit:

              500,


          }),


          getAttendanceApi({


            classId:

              classId,


            sectionId:

              sectionId,


            attendanceDate:

              attendanceDate,


            page:

              1,


            limit:

              500,


          }),


        ]);


        /*
        Get students safely
        */


        const studentList =

          studentsResponse?.students

          ||

          studentsResponse?.data

          ||

          studentsResponse?.data?.students

          ||

          [];


        /*
        Sort students by roll number
        */


        const sortedStudents =

          Array.isArray(studentList)

            ?

            [...studentList].sort(

              (firstStudent, secondStudent) => {


                const firstRoll =

                  Number(

                    firstStudent.roll_no

                  )

                  ||

                  0;


                const secondRoll =

                  Number(

                    secondStudent.roll_no

                  )

                  ||

                  0;


                return (

                  firstRoll

                  -

                  secondRoll

                );


              }

            )

            :

            [];


        setStudents(

          sortedStudents

        );


        /*
        Get existing attendance records safely
        */


        const existingRecords =

          attendanceResponse?.data?.data

          ||

          attendanceResponse?.data?.attendance

          ||

          attendanceResponse?.data

          ||

          attendanceResponse?.attendance

          ||

          [];


        /*
        Create student attendance map
        */


        const existingAttendanceMap = {};


        if (

          Array.isArray(

            existingRecords

          )

        ) {


          existingRecords.forEach(

            (record) => {


              const studentId =

                record.student_id

                ??

                record.studentId;


              if (studentId) {


                existingAttendanceMap[

                  String(studentId)

                ] = record;


              }


            }

          );


        }


        /*
        Default attendance values
        */


        const defaultStatusMap = {};


        const defaultRemarksMap = {};


        sortedStudents.forEach(

          (student) => {


            const studentId =

              String(

                student.student_id

                ??

                student.studentId

              );


            const existingRecord =

              existingAttendanceMap[

                studentId

              ];


            defaultStatusMap[

              studentId

            ] =

              existingRecord?.status

              ||

              "Present";


            defaultRemarksMap[

              studentId

            ] =

              existingRecord?.remarks

              ||

              "";


          }

        );


        setStatusMap(

          defaultStatusMap

        );


        setRemarksMap(

          defaultRemarksMap

        );


      } catch (error) {


        console.error(

          "Failed to fetch students/attendance:",

          error

        );


        setStudents([]);


        setStatusMap({});


        setRemarksMap({});


      } finally {


        setLoadingStudents(

          false

        );


      }


    };


    loadStudents();


  }, [

    classId,

    sectionId,

    attendanceDate,

  ]);



  /* =====================================================
     CHANGE SINGLE STUDENT STATUS
  ===================================================== */

  const handleStatusChange = (

    studentId,

    status

  ) => {


    setStatusMap(

      (previous) => ({

        ...previous,

        [studentId]:

          status,

      })

    );


  };



  /* =====================================================
     CHANGE SINGLE STUDENT REMARK
  ===================================================== */

  const handleRemarkChange = (

    studentId,

    remark

  ) => {


    setRemarksMap(

      (previous) => ({

        ...previous,

        [studentId]:

          remark,

      })

    );


  };



  /* =====================================================
     MARK ALL STUDENTS
  ===================================================== */

  const handleMarkAll = (

    status

  ) => {


    const updatedStatusMap = {};


    students.forEach(

      (student) => {


        const studentId =

          student.student_id

          ??

          student.studentId;


        updatedStatusMap[

          studentId

        ] = status;


      }

    );


    setStatusMap(

      updatedStatusMap

    );


  };



  /* =====================================================
     SAVE BULK ATTENDANCE
  ===================================================== */

  const handleSave = async () => {


    if (

      !classId

      ||

      !sectionId

      ||

      !attendanceDate

    ) {


      alert(

        "Please select Class, Section and Date."

      );


      return;


    }


    if (

      students.length === 0

    ) {


      alert(

        "No active students found in this Class and Section."

      );


      return;


    }


    const payload = {


      class_id:

        Number(classId),


      section_id:

        Number(sectionId),


      attendance_date:

        attendanceDate,


      attendance:

        students.map(

          (student) => {


            const studentId =

              student.student_id

              ??

              student.studentId;


            return {


              student_id:

                Number(studentId),


              status:

                statusMap[studentId]

                ||

                "Present",


              remarks:

                remarksMap[studentId]

                ||

                null,


            };


          }

        ),


    };


    setSaving(

      true

    );


    try {


      await dispatch(

        bulkAttendance(

          payload

        )

      ).unwrap();


      alert(

        "Attendance saved successfully."

      );


    } catch (error) {


      console.error(

        "Attendance save error:",

        error

      );


      alert(

        typeof error === "string"

          ?

          error

          :

          "Failed to save attendance."

      );


    } finally {


      setSaving(

        false

      );


    }


  };



  /* =====================================================
     UI
  ===================================================== */

  return (


    <div className="space-y-6">


      {/* =================================================
          PAGE HEADER
      ================================================= */}


      <div className="

        flex

        flex-col

        gap-4

        sm:flex-row

        sm:items-center

        sm:justify-between

      ">


        <div>


          <div className="

            flex

            items-center

            gap-2

          ">


            <div className="

              flex

              h-9

              w-9

              items-center

              justify-center

              rounded-lg

              bg-indigo-50

              text-indigo-600

            ">


              <ClipboardList

                size={20}

              />


            </div>


            <h1 className="

              text-xl

              font-bold

              text-slate-800

              sm:text-2xl

            ">


              Attendance Register


            </h1>


          </div>


          <p className="

            mt-1

            text-xs

            text-slate-500

            sm:text-sm

          ">


            Select Class and Section, then mark attendance for all students.


          </p>


        </div>



        {

          students.length > 0

          &&

          (


            <button


              type="button"


              onClick={

                handleSave

              }


              disabled={

                saving

                ||

                loadingStudents

              }


              className="

                inline-flex

                items-center

                justify-center

                gap-2

                rounded-lg

                bg-indigo-600

                px-5

                py-2.5

                text-sm

                font-medium

                text-white

                shadow-sm

                transition-all

                hover:bg-indigo-700

                disabled:cursor-not-allowed

                disabled:opacity-60

              "


            >


              {

                saving

                ?

                <>


                  <Loader2

                    size={18}

                    className="animate-spin"

                  />


                  Saving...


                </>


                :

                <>


                  <Save

                    size={18}

                  />


                  Save Attendance


                </>

              }


            </button>


          )

        }


      </div>



      {/* =================================================
          CLASS / SECTION / DATE FILTER
      ================================================= */}


      <div className="

        rounded-xl

        border

        border-slate-200

        bg-white

        p-5

        shadow-sm

      ">


        <div className="

          mb-4

          flex

          items-center

          gap-2

          text-xs

          font-semibold

          uppercase

          tracking-wider

          text-slate-500

        ">


          <Filter

            size={14}

          />


          Select Register Criteria


        </div>



        <div className="

          grid

          grid-cols-1

          gap-4

          md:grid-cols-3

        ">


          {/* CLASS */}


          <div>


            <label className="

              mb-1

              block

              text-xs

              font-medium

              text-slate-600

            ">


              Class

              <span className="

                ml-1

                text-red-500

              ">

                *

              </span>


            </label>


            <select


              value={

                classId

              }


              onChange={(event) => {


                const selectedClassId =

                  event.target.value;


                setClassId(

                  selectedClassId

                );


                /*
                Reset section when class changes
                */


                setSectionId(

                  ""

                );


                /*
                Clear old student data
                */


                setStudents(

                  []

                );


                setStatusMap(

                  {}

                );


                setRemarksMap(

                  {}

                );


              }}


              className="

                w-full

                rounded-lg

                border

                border-slate-200

                bg-white

                px-3

                py-2

                text-sm

                text-slate-800

                outline-none

                transition-all

                focus:border-indigo-500

                focus:ring-1

                focus:ring-indigo-500

              "


            >


              <option value="">


                -- Select Class --


              </option>


              {

                classes.map(

                  (item) => (


                    <option

                      key={

                        item.class_id

                      }


                      value={

                        item.class_id

                      }

                    >


                      {

                        item.class_name

                      }


                    </option>


                  )

                )

              }


            </select>


          </div>



          {/* SECTION */}


          <div>


            <label className="

              mb-1

              block

              text-xs

              font-medium

              text-slate-600

            ">


              Section

              <span className="

                ml-1

                text-red-500

              ">

                *

              </span>


            </label>


            <select


              value={

                sectionId

              }


              onChange={(event) => {


                setSectionId(

                  event.target.value

                );


              }}


              disabled={

                !classId

              }


              className="

                w-full

                rounded-lg

                border

                border-slate-200

                bg-white

                px-3

                py-2

                text-sm

                text-slate-800

                outline-none

                transition-all

                focus:border-indigo-500

                focus:ring-1

                focus:ring-indigo-500

                disabled:cursor-not-allowed

                disabled:bg-slate-100

                disabled:text-slate-400

              "


            >


              <option value="">


                {

                  classId

                  ?

                  "-- Select Section --"

                  :

                  "Select Class First"

                }


              </option>


              {

                filteredSections.map(

                  (section) => (


                    <option

                      key={

                        section.section_id

                      }


                      value={

                        section.section_id

                      }

                    >


                      {

                        section.section_name

                      }


                    </option>


                  )

                )

              }


            </select>


            {

              classId

              &&

              filteredSections.length === 0

              &&

              (


                <p className="

                  mt-1

                  text-xs

                  text-amber-600

                ">


                  No section found for this class.


                </p>


              )

            }


          </div>



          {/* DATE */}


          <div>


            <label className="

              mb-1

              block

              text-xs

              font-medium

              text-slate-600

            ">


              Date

              <span className="

                ml-1

                text-red-500

              ">

                *

              </span>


            </label>


            <input


              type="date"


              value={

                attendanceDate

              }


              onChange={(event) => {


                setAttendanceDate(

                  event.target.value

                );


              }}


              className="

                w-full

                rounded-lg

                border

                border-slate-200

                bg-white

                px-3

                py-2

                text-sm

                text-slate-800

                outline-none

                transition-all

                focus:border-indigo-500

                focus:ring-1

                focus:ring-indigo-500

              "


            />


          </div>


        </div>


      </div>



      {/* =================================================
          QUICK ACTIONS
      ================================================= */}


      {

        students.length > 0

        &&

        !loadingStudents

        &&

        (


          <div className="

            flex

            flex-wrap

            items-center

            justify-between

            gap-3

            rounded-xl

            border

            border-slate-200

            bg-slate-50

            px-5

            py-3

          ">


            <div className="

              text-xs

              font-medium

              text-slate-600

            ">


              Total Active Students:


              <span className="

                ml-1

                font-bold

                text-slate-800

              ">


                {

                  students.length

                }


              </span>


            </div>


            <div className="

              flex

              flex-wrap

              items-center

              gap-2

            ">


              <span className="

                text-xs

                font-semibold

                text-slate-500

              ">


                Quick Mark All:


              </span>


              <button


                type="button"


                onClick={() => {


                  handleMarkAll(

                    "Present"

                  );


                }}


                className="

                  inline-flex

                  items-center

                  gap-1

                  rounded-lg

                  border

                  border-emerald-200

                  bg-emerald-50

                  px-3

                  py-1.5

                  text-xs

                  font-medium

                  text-emerald-700

                  hover:bg-emerald-100

                "


              >


                <UserCheck

                  size={14}

                />


                All Present


              </button>


              <button


                type="button"


                onClick={() => {


                  handleMarkAll(

                    "Absent"

                  );


                }}


                className="

                  inline-flex

                  items-center

                  gap-1

                  rounded-lg

                  border

                  border-rose-200

                  bg-rose-50

                  px-3

                  py-1.5

                  text-xs

                  font-medium

                  text-rose-700

                  hover:bg-rose-100

                "


              >


                <UserX

                  size={14}

                />


                All Absent


              </button>


            </div>


          </div>


        )

      }



      {/* =================================================
          ATTENDANCE TABLE
      ================================================= */}


      <AttendanceRegisterTable


        students={

          students

        }


        loading={

          loadingStudents

        }


        statusMap={

          statusMap

        }


        remarksMap={

          remarksMap

        }


        onStatusChange={

          handleStatusChange

        }


        onRemarkChange={

          handleRemarkChange

        }


        onMarkAll={

          handleMarkAll

        }


        onSave={

          handleSave

        }


        saving={

          saving

        }


      />


    </div>


  );


};


export default AttendanceRegisterPage;