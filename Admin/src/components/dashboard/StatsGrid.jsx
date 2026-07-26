import {

    GraduationCap,

    IndianRupee,

    CalendarCheck,

    UserCheck,

} from "lucide-react";

import DashboardCard from "./DashboardCard";

const StatsGrid = () => {

    const stats = [

        {

            title: "Students",

            value: 5120,

            icon: GraduationCap,

            color: "bg-blue-600",

        },

        {

            title: "Today's Collection",

            value: "₹ 45,200",

            icon: IndianRupee,

            color: "bg-green-600",

        },

        {

            title: "Present Today",

            value: "4,950",

            icon: CalendarCheck,

            color: "bg-orange-500",

        },

        {

            title: "Teachers",

            value: "82",

            icon: UserCheck,

            color: "bg-purple-600",

        },

    ];

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {

                stats.map((item) => (

                    <DashboardCard

                        key={item.title}

                        {...item}

                    />

                ))

            }

        </div>

    );

};

export default StatsGrid;