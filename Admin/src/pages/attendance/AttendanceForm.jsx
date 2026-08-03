
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  User,
  Calendar,
  CheckCircle2,
  FileText,
  Loader2,
  Filter,
} from "lucide-react";

import {
  getClassesApi,
  getSectionsApi,
} from "../../api/master.api";

import {
  createAttendance,
  updateAttendance,
} from "../../redux/attendance/attendanceThunk";

import {
  getStudentsApi,
} from "../../api/student.api";


/* =====================================================
   Validation Schema
===================================================== */

const schema = z.object({

  studentId: z
    .string()
    .min(1, "Please select a student"),

  attendanceDate: z
    .string()
    .min(1, "Attendance Date is required"),

  status: z
    .string()
    .min(1, "Status is required"),

  remarks: z
    .string()
    .optional(),

});


/* =====================================================
   Field Mapping
===================================================== */

const FIELD_KEY_MAP = {

  studentId: "student_id",

  attendanceDate: "attendance_date",

};


const REVERSE_FIELD_KEY_MAP =
Object.entries(FIELD_KEY_MAP).reduce(
(acc, [camel, snake]) => {

  acc[snake] = camel;

  return acc;

},
{}
);


const camelToSnake = (value) =>
value.replace(
/[A-Z]/g,
(letter) => `_${letter.toLowerCase()}`
);


const snakeToCamel = (value) =>
value.replace(
/_([a-z])/g,
(_, letter) => letter.toUpperCase()
);


/* =====================================================
   Component
===================================================== */

const AttendanceForm = ({
  attendance,
  onClose,
}) => {


const dispatch = useDispatch();


const {
  submitting,
} = useSelector(
(state) => state.attendance
);



/* =====================================================
   Local State
===================================================== */

const [
  students,
  setStudents,
] = useState([]);


const [
  classes,
  setClasses,
] = useState([]);


const [
  sections,
  setSections,
] = useState([]);


const [
  classId,
  setClassId,
] = useState("");


const [
  sectionId,
  setSectionId,
] = useState("");



/* =====================================================
   React Hook Form
===================================================== */

const {

  register,

  handleSubmit,

  reset,

  setValue,

  formState: {
    errors,
  },

} = useForm({

  resolver:
  zodResolver(schema),

  defaultValues: {

    studentId: "",

    attendanceDate:
    new Date()
    .toISOString()
    .split("T")[0],

    status: "Present",

    remarks: "",

  },

});



/* =====================================================
   Filter Sections By Selected Class
===================================================== */

const filteredSections =
useMemo(() => {

  if (!classId) {

    return [];

  }


  return sections.filter(
  (section) =>

  String(
  section.class_id
  ) === String(classId)

  );


}, [
  sections,
  classId,
]);



/* =====================================================
   Load Classes And Sections
===================================================== */

useEffect(() => {


const loadMasters =
async () => {


try {


const [
  classList,
  sectionList,
] = await Promise.all([

  getClassesApi(),

  getSectionsApi(),

]);


setClasses(
classList || []
);


setSections(
sectionList || []
);


}
catch (error) {


console.error(

"Failed to load classes/sections",

error

);


setClasses([]);


setSections([]);


}


};


loadMasters();


}, []);



/* =====================================================
   Load Students
===================================================== */

useEffect(() => {


const loadStudents =
async () => {


/*
Do not load students
until both Class and
Section are selected.
*/

if (
!classId ||
!sectionId
) {


setStudents([]);


setValue(
"studentId",
""
);


return;


}


try {


const response =
await getStudentsApi({

  classId,

  sectionId,

  status: "Active",

  page: 1,

  limit: 500,

});


const studentList =

response?.students ||

response?.data ||

[];


setStudents(
studentList
);


}
catch (error) {


console.error(

"Failed to load students",

error

);


setStudents([]);


}


};


loadStudents();


}, [

classId,

sectionId,

setValue,

]);



/* =====================================================
   Edit Mode
===================================================== */

useEffect(() => {


if (!attendance) {


return;


}


/*
Set Class
*/

if (
attendance.class_id
) {


setClassId(

String(
attendance.class_id
)

);


}


/*
Set Section
*/

if (
attendance.section_id
) {


setSectionId(

String(
attendance.section_id
)

);


}


/*
Convert API fields
to form fields
*/

const formData = {};


Object.entries(
attendance
).forEach(

([
key,
value,
]) => {


const camelKey =

REVERSE_FIELD_KEY_MAP[
key
]

??

snakeToCamel(
key
);


formData[
camelKey
] =

value ?? "";


}

);


/*
Reset form values
*/

reset({

...formData,


studentId:

String(

attendance.student_id

?? ""

),


attendanceDate:

attendance.attendance_date

?

String(

attendance
.attendance_date

).slice(

0,

10

)

:

"",


status:

attendance.status

??

"Present",


remarks:

attendance.remarks

??

"",

});


}, [

attendance,

reset,

]);



/* =====================================================
   Class Change
===================================================== */

const handleClassChange =
(event) => {


const selectedClassId =
event.target.value;


setClassId(
selectedClassId
);


/*
Reset Section
when Class changes
*/

setSectionId(
""
);


/*
Reset Student
when Class changes
*/

setValue(

"studentId",

""

);


setStudents([]);


};



/* =====================================================
   Section Change
===================================================== */

const handleSectionChange =
(event) => {


const selectedSectionId =
event.target.value;


setSectionId(
selectedSectionId
);


/*
Reset Student
when Section changes
*/

setValue(

"studentId",

""

);


setStudents([]);


};



/* =====================================================
   Submit
===================================================== */

const onSubmit =
async (data) => {


const payload = {};


Object.entries(
data
).forEach(

([
key,
value,
]) => {


payload[

FIELD_KEY_MAP[
key
]

??

camelToSnake(
key
)

] = value;


});


const result =

attendance

?

await dispatch(

updateAttendance({

id:

attendance
.attendance_id,

data:

payload,

})

)

:

await dispatch(

createAttendance(

payload

)

);


/*
Close only after
successful API call
*/

if (

!result.meta
.requestStatus

||

result.meta
.requestStatus

===

"fulfilled"

) {


onClose?.();


}


};



/* =====================================================
   UI
===================================================== */

return (

<form

onSubmit={
handleSubmit(
onSubmit
)
}

className="
space-y-5
"


>


<div

className="
rounded-xl
border
border-slate-200
bg-white
p-6
shadow-sm
"


>


{/* =================================================
    Class And Section Filter
================================================= */}

<div

className="
mb-6
rounded-lg
border
border-slate-100
bg-slate-50
p-4
"


>


<div

className="
mb-3
flex
items-center
gap-2
text-xs
font-semibold
uppercase
tracking-wider
text-slate-500
"


>


<Filter
size={14}
/>


Select Class
And Section


</div>



<div

className="
grid
grid-cols-1
gap-4
md:grid-cols-2
"


>


{/* Class */}

<div>


<label

className="
mb-1
block
text-xs
font-medium
text-slate-600
"


>


Class

<span

className="
text-red-500
"

>

*

</span>


</label>



<select

value={
classId
}

onChange={
handleClassChange
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
text-slate-700
outline-none
transition-all
focus:border-indigo-500
focus:ring-1
focus:ring-indigo-500
"


>


<option
value=""
>

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



{/* Section */}

<div>


<label

className="
mb-1
block
text-xs
font-medium
text-slate-600
"


>


Section

<span

className="
text-red-500
"

>

*

</span>


</label>



<select

value={
sectionId
}

onChange={
handleSectionChange
}

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
text-slate-700
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


<option
value=""
>

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


</div>


</div>


</div>



{/* =================================================
    Main Form
================================================= */}

<div

className="
grid
grid-cols-1
gap-5
md:grid-cols-2
"


>


{/* Student */}

<div

className="
md:col-span-2
"


>


<label

className="
mb-1.5
flex
items-center
gap-1.5
text-xs
font-medium
text-slate-700
"


>


<User
size={14}
className="
text-slate-400
"
/>


Student Name

<span

className="
text-red-500
"

>

*

</span>


</label>



<select

{

...register(

"studentId"

)

}

disabled={

!classId

||

!sectionId

}

className={`

w-full

rounded-lg

border

bg-white

px-3

py-2

text-sm

text-slate-800

outline-none

transition-all

focus:ring-1

disabled:cursor-not-allowed

disabled:bg-slate-100

disabled:text-slate-400

${

errors.studentId

?

"border-red-400 focus:border-red-500 focus:ring-red-500"

:

"border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"

}

`}


>


<option
value=""
>

{

!classId

?

"Select Class First"

:

!sectionId

?

"Select Section First"

:

students.length === 0

?

"No Students Found"

:

"-- Select Student --"

}

</option>


{

students.map(
(student) => (

<option

key={
student.student_id
}

value={
student.student_id
}

>

{
student.admission_no
}

{" - "}

{
student.first_name
}

{" "}

{
student.last_name
}

</option>

)

)

}


</select>


{

errors.studentId

&&

(

<p

className="
mt-1
text-xs
font-medium
text-red-500
"

>

{
errors
.studentId
.message
}

</p>

)

}


</div>



{/* Date */}

<div>


<label

className="
mb-1.5
flex
items-center
gap-1.5
text-xs
font-medium
text-slate-700
"


>


<Calendar
size={14}
className="
text-slate-400
"
/>


Attendance Date

<span

className="
text-red-500
"

>

*

</span>


</label>



<input

type="date"

{

...register(

"attendanceDate"

)

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
focus:border-indigo-500
focus:ring-1
focus:ring-indigo-500
"


/>


</div>



{/* Status */}

<div>


<label

className="
mb-1.5
flex
items-center
gap-1.5
text-xs
font-medium
text-slate-700
"


>


<CheckCircle2
size={14}
className="
text-slate-400
"
/>


Status

<span

className="
text-red-500
"

>

*

</span>


</label>



<select

{

...register(

"status"

)

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
focus:border-indigo-500
focus:ring-1
focus:ring-indigo-500
"


>


<option
value="Present"
>

Present

</option>


<option
value="Absent"
>

Absent

</option>


<option
value="Leave"
>

Leave

</option>


<option
value="Late"
>

Late

</option>


<option
value="Half Day"
>

Half Day

</option>


</select>


</div>



{/* Remarks */}

<div

className="
md:col-span-2
"


>


<label

className="
mb-1.5
flex
items-center
gap-1.5
text-xs
font-medium
text-slate-700
"


>


<FileText
size={14}
className="
text-slate-400
"
/>


Remarks


</label>



<textarea

rows={3}

{

...register(

"remarks"

)

}

placeholder="
Add any specific notes or remarks...
"

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
    Footer
================================================= */}

<div

className="
flex
items-center
justify-end
gap-3
pt-2
"


>


<button

type="button"

onClick={
onClose
}

className="
rounded-lg
border
border-slate-200
bg-white
px-5
py-2
text-sm
font-medium
text-slate-600
hover:bg-slate-50
"


>

Cancel

</button>



<button

type="submit"

disabled={
submitting
}

className="
flex
items-center
gap-2
rounded-lg
bg-indigo-600
px-6
py-2
text-sm
font-medium
text-white
hover:bg-indigo-700
disabled:cursor-not-allowed
disabled:opacity-60
"


>


{

submitting

?

(

<>

<Loader2

size={16}

className="
animate-spin
"

/>

Saving...

</>

)

:

attendance

?

"Update Attendance"

:

"Mark Attendance"

}


</button>


</div>


</form>

);


};


export default AttendanceForm;

