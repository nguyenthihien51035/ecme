import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import HomePage from "./HomePage";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./components/LayoutRoot";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UserDetails from "./components/UserDetails";
import UserEdit from "./components/UserEdit";
import UserCreate from "./components/UserCreate";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

const router = createBrowserRouter([
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <LayoutRoot />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user/view/:id",
        element: <UserDetails />,
      },
      {
        path: "user/edit/:id",
        element: <UserEdit />,
      },
      {
        path: "user/create",
        element: <UserCreate />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router}></RouterProvider>);
reportWebVitals();
