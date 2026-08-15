//Arquivo de configuração
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./layouts/App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Rotas que devem ser importadas
import Home from "./pages/Home.jsx";
import AdminDashboard from "./layouts/AdminDashboard.jsx";
import Feedback from "./pages/Feedback.jsx";
import AdminHome from "./pages/AdminHome.jsx";
import Historico from "./pages/Historico.jsx";
import AgendamentosAdmin from "./pages/AgendamentosAdmin.jsx";

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
        element: <Feedback />,
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
        element: <AdminHome />,
      },
      {
        path: "/Admin/Historico",
        element: <Historico />,
      },
      {
        path: "/Admin/Agendamentos",
        element: <AgendamentosAdmin />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
