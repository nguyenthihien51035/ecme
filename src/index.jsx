import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./index.scss";

import reportWebVitals from "./reportWebVitals";

import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";

import HomePage from "./components/user/HomePage";

import SignIn from "./components/admin/SignIn";
import SignUp from "./components/admin/SignUp";
import UserProfile from "./components/admin/UserProfile";
import ForgotPassword from "./components/admin/ForgotPassword";
import ResetPassword from "./components/admin/ResetPassword";
import CustomerTable from "./components/admin/CustomerTable";
import CustomerCreate from "./components/admin/CustomerCreate";
import CustomerEdit from "./components/admin/CustomerEdit";
import CustomerDetails from "./components/admin/CustomerDetails";
import ProductCreate from "./components/admin/ProductCreate";
import ProductTable from "./components/admin/ProductTable";
import ProductEdit from "./components/admin/ProductEdit";
import ProductDetails from "./components/admin/ProductDetails";

import ProductsPage from "./components/user/ProductSearch";
import ProductDetail from "./components/user/ProductDetail";
import Cart from "./components/user/Cart";
import Favorites from "./components/user/Favorites";
import ProductsByCategory from "./components/user/ProductByCategory";
import Checkout from "./components/user/Checkout";
import OrderDetails from "./components/user/OrderDetail";

const router = createBrowserRouter([
  // ================= User =================
  {
    path: "/",
    element: <UserLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },
      { path: "products/:productId", element: <ProductDetail /> },
      { path: "/cart", element: <Cart /> },
      { path: "/favorites", element: <Favorites /> },
      { path: "/products/category/:categoryId", element: <ProductsByCategory /> },
      { path: "/checkout", element: <Checkout /> },
      { path: "/orders/:id", element: <OrderDetails /> },



    ],
  },

  // ================= Admin =================
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <CustomerTable />, },
      { path: "customer/list", element: <CustomerTable /> },
      { path: "customer/create", element: <CustomerCreate /> },
      { path: "customer/edit/:id", element: <CustomerEdit /> },
      { path: "customer/view/:id", element: <CustomerDetails /> },
      { path: "my-profile", element: <UserProfile /> },
      { path: "products", element: <ProductTable /> },
      { path: "products/list", element: <ProductTable /> },
      { path: "products/create", element: <ProductCreate /> },
      { path: "products/edit/:productId", element: <ProductEdit /> },
      { path: "products/view/:id", element: <ProductDetails /> },

    ],
  },

  // ================= Auth (không layout) =================
  { path: "/admin/sign-in", element: <SignIn /> },
  { path: "/admin/sign-up", element: <SignUp /> },
  { path: "/admin/forgot-password", element: <ForgotPassword /> },
  { path: "/admin/reset-password", element: <ResetPassword /> },

]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" autoClose={3000} />
  </>
);

reportWebVitals();
