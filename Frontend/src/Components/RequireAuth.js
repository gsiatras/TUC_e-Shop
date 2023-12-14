import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRole }) => {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.role === allowedRole
            ? <Outlet />
            : ( 
                <>
                {console.log("Aunthorized")}
                {console.log("auth.role:", auth?.role)}
                {console.log("allowedRole:", allowedRole)}
                <Navigate to="/" state={{ from: location}} replace />
                </>
            )
    );
}

export default RequireAuth;