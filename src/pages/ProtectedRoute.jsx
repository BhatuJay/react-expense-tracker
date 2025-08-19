import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
    const login = JSON.parse(localStorage.getItem("loginData") || "{}");

    if (!login.email || !login.password) {
        return <Navigate to="/login" />;
    } else {
        return children;
    }
};