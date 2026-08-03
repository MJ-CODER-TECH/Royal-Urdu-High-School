import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchClasses } from "../../redux/master/classMasterThunk";
import { fetchSectionsByClass } from "../../redux/section/sectionThunk";


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
transition
focus:border-indigo-500
focus:ring-2
focus:ring-indigo-100
`;



const ClassSectionFilter = ({

    classId,
    setClassId,

    sectionId,
    setSectionId,

}) => {


    const dispatch = useDispatch();



    const {
        classes
    } = useSelector(
        (state)=>state.classMaster
    );



    const {
        sections,
        loading
    } = useSelector(
        (state)=>state.section
    );




    /*
    |--------------------------------------------------------------------------
    | Load Classes
    |--------------------------------------------------------------------------
    */

    useEffect(()=>{


        dispatch(
            fetchClasses()
        );


    },[dispatch]);






    /*
    |--------------------------------------------------------------------------
    | Load Sections According To Class
    |--------------------------------------------------------------------------
    */

    useEffect(()=>{

if(classId){

dispatch(fetchSectionsByClass(classId));

}else{

setSectionId("");

}

},[
classId,
dispatch
]);








    const handleClassChange=(e)=>{


        const value =
        e.target.value;



        setClassId(value);



        // reset old section

        setSectionId("");



    };







return (

<>


{/* Class Dropdown */}


<select

value={classId}

onChange={handleClassChange}

className={selectClass}

>


<option value="">

Select Class

</option>


{
(classes || []).map((item)=>(


<option

key={item.class_id}

value={item.class_id}

>

{item.class_name}

</option>


))

}



</select>









{/* Section Dropdown */}



<select


value={sectionId}


onChange={(e)=>
setSectionId(e.target.value)
}


disabled={!classId || loading}


className={selectClass}


>


<option value="">


{
!classId
?
"Select Class First"
:
loading
?
"Loading Sections..."
:
"Select Section"

}


</option>





{
(sections || []).map((item)=>(


<option


key={item.section_id}


value={item.section_id}


>


{item.section_name}


</option>


))


}




</select>





</>


);


};



export default ClassSectionFilter;