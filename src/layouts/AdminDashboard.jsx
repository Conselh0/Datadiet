// pages/AdminDashboard.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  return (
    // O 'flex' aqui garante que a Sidebar fique do lado do conteúdo do Outlet
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      {/* O 'flex-1' faz o Outlet ocupar todo o resto do espaço da tela */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminDashboard;
