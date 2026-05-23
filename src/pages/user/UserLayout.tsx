import { Outlet } from "react-router-dom";
import Sidebar from "@components/user-dashboard/Sidebar";

const UserLayout: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-6 lg:py-10">
        <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-0">
          <div className="flex-shrink-0 w-full lg:w-80 mr-0 lg:mr-10 xl:mr-10">
            <Sidebar />
          </div>
          <div className="w-full overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
