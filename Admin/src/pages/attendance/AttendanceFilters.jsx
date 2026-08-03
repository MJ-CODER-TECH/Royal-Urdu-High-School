import {
  Search,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

import { useCallback } from "react";

import ClassSectionFilter from "../../components/common/ClassSectionFilter";


const AttendanceFilters = ({
  filters,
  setFilters,
}) => {


  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;


    setFilters((prev)=>({

      ...prev,

      [name]: value,

      page:1,

    }));

  };



  const handleClassChange = useCallback((value)=>{

    setFilters((prev)=>({

      ...prev,

      classId:value,

      sectionId:"",

      page:1,

    }));

  },[setFilters]);





  const handleSectionChange = useCallback((value)=>{

    setFilters((prev)=>({

      ...prev,

      sectionId:value,

      page:1,

    }));

  },[setFilters]);






  const handleReset = ()=>{

    setFilters({

      search:"",

      attendanceDate:"",

      classId:"",

      sectionId:"",

      status:"",

      page:1,

      limit:20,

    });

  };





return (

<div className="
rounded-xl
border
border-slate-200
bg-white
p-4
shadow-sm
">


<div className="
mb-3
flex
items-center
gap-2
text-slate-600
">


<SlidersHorizontal size={16}/>


<span className="
text-xs
font-semibold
uppercase
tracking-wider
">

Filters

</span>


</div>





<div className="
grid
grid-cols-1
gap-3
sm:grid-cols-2
lg:grid-cols-6
">





{/* Search */}

<div className="relative">


<Search

size={16}

className="
absolute
left-3
top-1/2
-translate-y-1/2
text-slate-400
"

/>



<input

type="text"

name="search"

placeholder="Search student..."

value={filters.search || ""}

onChange={handleChange}

className="
w-full
rounded-lg
border
border-slate-200
bg-slate-50
py-2
pl-9
pr-3
text-sm
outline-none
focus:border-indigo-500
"

/>


</div>







{/* Date */}

<input


type="date"

name="attendanceDate"

value={filters.attendanceDate || ""}

onChange={handleChange}

className="
rounded-lg
border
border-slate-200
bg-slate-50
px-3
py-2
text-sm
"

/>








{/* Class Section */}


<div className="lg:col-span-2">


<ClassSectionFilter

classId={filters.classId}

sectionId={filters.sectionId}

setClassId={handleClassChange}

setSectionId={handleSectionChange}

/>


</div>








{/* Status */}


<select


name="status"

value={filters.status || ""}

onChange={handleChange}

className="
rounded-lg
border
border-slate-200
bg-slate-50
px-3
py-2
text-sm
"


>


<option value="">
All Status
</option>


<option value="Present">
Present
</option>


<option value="Absent">
Absent
</option>


<option value="Late">
Late
</option>


<option value="Half Day">
Half Day
</option>


<option value="Leave">
Leave
</option>


</select>









{/* Reset */}


<button

type="button"

onClick={handleReset}

className="
flex
items-center
justify-center
gap-2
rounded-lg
border
border-slate-200
bg-slate-50
px-3
py-2
text-sm
font-medium
"


>


<RotateCcw size={15}/>

Reset


</button>





</div>


</div>


);


};


export default AttendanceFilters;