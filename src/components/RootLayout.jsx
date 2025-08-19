import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import "react-toastify/dist/ReactToastify.css";

export const RootLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <div>Footer</div>
        </>
    );
};