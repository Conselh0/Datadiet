import { Outlet } from "react-router-dom";
import SidebarUser from "../components/SidebarUser";

function UserDashboard() {
  return (
    <div className="flex min-h-screen w-full min-w-0 flex-col lg:flex-row">
      <SidebarUser />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default UserDashboard;
