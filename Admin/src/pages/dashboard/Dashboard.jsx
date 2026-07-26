import StatsGrid from "../../components/dashboard/StatsGrid";

const Dashboard = () => {

    return (

        <>

            <div className="mb-8">

                <h1 className="text-3xl font-bold">

                    Dashboard

                </h1>

                <p className="text-gray-500">

                    Welcome Back Administrator

                </p>

            </div>

            <StatsGrid />

        </>

    );

};

export default Dashboard;