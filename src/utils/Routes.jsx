import Layout from "../ui-components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Home from "../pages/Home";
import School from "../pages/School";
import Login from "../pages/Login";
import Student from "../pages/Student";
import User from "../pages/User";
import Campus from "../pages/Campus";
import Class from "../pages/Class";
import Section from "../pages/Section";
import Teacher from "../pages/Teacher";


export const routes = [
  {
    path: "/login",
    element:<PublicRoute><Login /> </PublicRoute>  ,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "school", element: <School /> },
      {path:"campus", element: <Campus />},
      {path:"class", element: <Class />},
      {path:"section", element: <Section />},
      {path:"teacher", element: <Teacher />},
      {path:"student", element: <Student />},
      {path:"users", element: <User />},

      { path: "*", element: <Home /> },
    ]
  }
];
