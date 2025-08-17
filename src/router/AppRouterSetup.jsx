import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// Import components
import SignUp from '../components/SignUp';
import SignIn from '../components/SignIn';
import LayoutRoot from '../components/LayoutRoot';
import HomePage from '../HomePage';
import UserDetails from '../components/UserDetails';
import UserEdit from '../components/UserEdit';
import UserCreate from '../components/UserCreate';
import CustomerEdit from '../components/CustomerEdit'

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
        ],
    },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

reportWebVitals();