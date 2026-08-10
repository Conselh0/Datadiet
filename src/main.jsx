//Arquivo de configuração
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

//Rotas que devem ser importadas
import Home from "./pages/Home.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

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
    ],
  },
  //Fica de fora e é executado a parte.
  {
    path: "/Admin",
    element: <AdminDashboard />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
