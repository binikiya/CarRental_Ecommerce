import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface Props {
    allowedRoles?: string[];
}

const ProtectedRoute = ({ allowedRoles }: Props) => {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const location = useLocation();

    const isAuthenticated = token && token !== "undefined" && token !== "";

    let userRole = "";
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            userRole = user.role;
        }
        catch (e) {
            console.error("User data corrupted");
        }
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Navigate to={userRole === 'admin' ? "/admin/dashboard" : "/seller/dashboard"} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;