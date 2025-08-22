import { Outlet } from "react-router-dom";
import Header from "../components/user/Header";

export default function UserLayout() {
    return (
        <div>
            <Header />
            <Outlet />
        </div>
    );
}