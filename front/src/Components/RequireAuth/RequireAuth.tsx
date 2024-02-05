import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const RequireAuth = ({ allowedRole }: any) => {
    const { auth }:any  = useAuth()
    const location = useLocation()
    return (
        auth?.role?.includes(allowedRole)
            ? <Outlet />
            : auth?.token
                ? <Navigate to="/unauthorized" state={{from: location}} replace />
                : <Navigate to="/login" state={{from: location}} replace />
    )
}

export default RequireAuth