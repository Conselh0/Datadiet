//Arquivo de configuração
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./layouts/App.jsx";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

//Rotas que devem ser importadas
import Home from "./pages/Home.jsx";
import AdminDashboard from "./layouts/AdminDashboard.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Calendario from "./pages/Calendario.jsx";
import Historico from "./pages/Historico.jsx";
import AgendamentosAdmin from "./pages/AgendamentosAdmin.jsx";
import LoginPa from "./pages/LoginPa.jsx";
import CadPa from "./pages/CadPa.jsx";
import FichaAnam from "./pages/FichaAnam.jsx";
import CadNu from "./pages/CadNu.jsx";
import UserDashboard from "./layouts/UserDashboard.jsx";
import UserHome from "./pages/UserHome.jsx";
import UserHistorico from "./pages/UserHistorico.jsx";
import Agendamentos from "./pages/Agendamentos.jsx";
import Pacientes from "./pages/Pacientes.jsx";
import RedefinirSenha from "./pages/RedefinirSenha.jsx";
import ConfirmarRedefinicaoSenha from "./pages/ConfirmarRedefinicaoSenha.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //Elemento que permite que usemos o outlet
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/feedback",
        element: <Navigate to="/#feedback" replace />,
      },
    ],
  },
  //Fica de fora e é executado a parte.
  {
    path: "/Admin",
    element: <AdminDashboard />,
    children: [
      {
        path: "/Admin",
        element: <Dashboard />,
      },
      {
        path: "/Admin/Perfil",
        element: <AdminHome />,
      },
      {
        path: "/Admin/Agenda",
        element: <Calendario />,
      },
      {
        path: "/Admin/Historico",
        element: <Historico />,
      },
      {
        path: "/Admin/Agendamentos",
        element: <AgendamentosAdmin />,
      },
      {
        path: "/Admin/Pacientes",
        element: <Pacientes />,
      },
    ],
  },
  {
    path: "/User",
    element: <UserDashboard />,
    children: [
      {
        path: "/User",
        element: <UserHome />,
      },
      {
        path: "/User/Historico",
        element: <UserHistorico />,
      },
      {
        path: "/User/Agendamentos",
        element: <Agendamentos />,
      },
    ],
  },
  {
    path: "/LoginPa",
    element: <LoginPa />,
  },
  {
    path: "/RedefinirSenha",
    element: <RedefinirSenha />,
  },
  {
    path: "/ConfirmarRedefinicaoSenha",
    element: <ConfirmarRedefinicaoSenha />,
  },
  {
    path: "/CadPa",
    element: <CadPa />,
  },
  {
    path: "/FichaAnam",
    element: <FichaAnam />,
  },
  {
    path: "/CadNu",
    element: <CadNu />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ADICIONE ESTE BLOCO FONTFAMILY AQUI:
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
