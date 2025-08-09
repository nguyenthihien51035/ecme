import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Import components
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import LayoutRoot from './components/LayoutRoot';
import HomePage from './pages/HomePage';
import UserDetails from './pages/UserDetails';
import UserEdit from './pages/UserEdit';
import UserCreate from './pages/UserCreate';

import './index.css';

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
                path: "dashboard",
                element: <div>Dashboard Page</div>,
            },
            {
                path: "ecommerce",
                element: <div>Ecommerce Page</div>,
            },
            {
                path: "project",
                element: <div>Project Page</div>,
            },
            {
                path: "marketing",
                element: <div>Marketing Page</div>,
            },
            {
                path: "analytic",
                element: <div>Analytic Page</div>,
            },
            {
                path: "customer/list",
                element: <div>Customer List</div>,
            },
            {
                path: "customer/edit",
                element: <div>Customer Edit</div>,
            },
            {
                path: "customer/create",
                element: <div>Customer Create</div>,
            },
            {
                path: "customer/details",
                element: <div>Customer Details</div>,
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
root.render(<RouterProvider router={router} />);

reportWebVitals();