import {
    Bell,
    Search,
    UserCircle,
    ChevronDown
} from "lucide-react";

import {
    useSelector
} from "react-redux";

import {
    useState
} from "react";

import {
    useNavigate
} from "react-router-dom";


const Header = () => {


    const user = useSelector(
        state => state.auth.user
    );


    const [open, setOpen] = useState(false);


    const navigate = useNavigate();



    return (

        <header className="flex h-16 items-center justify-between bg-white px-6 shadow">


            {/* Search */}

            <div className="flex items-center gap-3">


                <Search size={20}/>


                <input

                    placeholder="Search..."

                    className="outline-none"

                />


            </div>





            {/* Right Side */}

            <div className="flex items-center gap-5">


                <Bell
                    className="cursor-pointer"
                />





                <div className="relative">



                    {/* Profile Button */}

                    <div

                        onClick={() => setOpen(!open)}

                        className="
                            flex
                            cursor-pointer
                            items-center
                            gap-2
                            select-none
                        "

                    >


                        <UserCircle
                            size={35}
                        />



                        <div className="text-left">


                            <p className="font-semibold">

                                {
                                    user?.name || "User"
                                }

                            </p>



                            <p className="text-sm text-gray-500">

                                {
                                    user?.role || "Administrator"
                                }

                            </p>


                        </div>



                        <ChevronDown
                            size={18}
                        />


                    </div>







                    {/* Dropdown */}

                    {
                        open && (

                            <div

                                className="
                                    absolute
                                    right-0
                                    mt-3
                                    w-48
                                    rounded-lg
                                    border
                                    bg-white
                                    shadow-lg
                                    z-50
                                "

                            >



                               <button

    onClick={() => {

        console.log("PROFILE BUTTON CLICKED");

        navigate("/profile");

    }}

    className="block w-full px-4 py-2 text-left hover:bg-gray-100"

>
    My Profile
</button>





                                <button

                                    onClick={() => {

                                        setOpen(false);

                                    }}

                                    className="
                                        block
                                        w-full
                                        px-4
                                        py-2
                                        text-left
                                        hover:bg-gray-100
                                    "

                                >

                                    Settings


                                </button>




                            </div>

                        )
                    }



                </div>



            </div>



        </header>

    );

};


export default Header;