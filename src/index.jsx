import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDOM from "react-dom/client";
import "./index.scss";
import HomePage from "./HomePage";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutRoot from "./components/LayoutRoot";
import "@fortawesome/fontawesome-free/css/all.min.css";
import UserDetails from "./components/UserDetails";
import UserCreate from "./components/UserCreate";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import CustomerEdit from "./components/CustomerEdit";
import UserProfile from "./components/UserProfile";

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
        element: <CustomerEdit />,
      },
      {
        path: "user/create",
        element: <UserCreate />,
      },
      {
        path: "user/my-profile",
        element: <UserProfile />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);

reportWebVitals();
