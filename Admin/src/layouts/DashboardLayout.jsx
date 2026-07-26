import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../layouts/Header";

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header — owns the single mobile top bar */}
          <Header onMenuClick={() => setMobileOpen(true)} />

          {/* Main Content */}
          <main
            className="
              flex-1
              overflow-x-hidden
              bg-slate-100
              p-3
              sm:p-4
              lg:p-6
            "
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;