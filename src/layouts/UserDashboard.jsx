import { Outlet } from "react-router-dom";
import SidebarUser from "../components/SidebarUser";

function UserDashboard() {
  return (
    <div>
      <SidebarUser />
      <Outlet />
    </div>
  );
}

export default UserDashboard;
