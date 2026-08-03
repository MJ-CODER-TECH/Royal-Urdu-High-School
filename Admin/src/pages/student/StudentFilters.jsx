import { Search, X, SlidersHorizontal } from "lucide-react";

import ClassSectionFilter from "../../components/common/ClassSectionFilter";
import AcademicYearFilter from "../../components/common/AcademicYearFilter";


const selectClass =
`
rounded-lg
border
border-slate-300
bg-white
px-3
py-2
text-sm
text-slate-700
outline-none
transition-colors
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-100
`;



const StudentFilters = ({

  search,
  setSearch,

  academicYearId,
  setAcademicYearId,

  classId,
  setClassId,

  sectionId,
  setSectionId,

  status,
  setStatus,

}) => {



const hasActiveFilters =
search ||
academicYearId ||
classId ||
sectionId ||
status;






const clearFilters = ()=>{


setSearch("");

setAcademicYearId("");

setClassId("");

setSectionId("");

setStatus("");



};






return (

<div className="
rounded-xl
border
border-slate-200
bg-white
p-5
shadow-sm
">


{/* Header */}

<div className="
mb-4
flex
items-center
justify-between
">


<div className="
flex
items-center
gap-2
text-sm
font-medium
text-slate-700
">


<SlidersHorizontal

size={16}

className="text-slate-400"

/>


Filters


</div>





{
hasActiveFilters &&

<button

onClick={clearFilters}

className="
flex
items-center
gap-1
text-xs
font-medium
text-slate-500
hover:text-red-600
"

>


<X size={14}/>

Clear all


</button>

}



</div>







<div className="
grid
gap-3
md:grid-cols-5
">





{/* Search */}

<div className="
relative
">


<Search

size={17}

className="
pointer-events-none
absolute
left-3
top-1/2
-translate-y-1/2
text-slate-400
"

/>




<input


value={search}

onChange={(e)=>
setSearch(e.target.value)
}


placeholder="
Search by name, admission no...
"


className={`
w-full
pl-9
${selectClass}
`}


/>


</div>








{/* Academic Year Filter */}


<AcademicYearFilter


academicYearId={academicYearId}

setAcademicYearId={setAcademicYearId}


/>








{/* Class + Section Common Filter */}


<ClassSectionFilter


classId={classId}

setClassId={setClassId}


sectionId={sectionId}

setSectionId={setSectionId}


/>









{/* Status */}


<select


value={status}

onChange={(e)=>
setStatus(e.target.value)
}


className={selectClass}


>


<option value="">

All Status

</option>



<option value="Active">

Active

</option>



<option value="Inactive">

Inactive

</option>


</select>







</div>




</div>


);


};



export default StudentFilters;