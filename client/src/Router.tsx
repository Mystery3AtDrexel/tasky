import { createBrowserRouter, RouterProvider } from "react-router-dom";

import TaskViewPage from "./pages/TaskViewPage";
import CalendarPage from "./pages/CalendarPage";
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import Layout from "./components/Layout/Layout";

function Router() {
  return <RouterProvider router={router} />;
}

const protectedRoutes = [
  {
    path: "/",
    element: <TaskViewPage />,
  },
  {
    path: "/calendar",
    element: <CalendarPage />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: protectedRoutes,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

export default Router;
