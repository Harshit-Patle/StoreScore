import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'ADMIN') {
            return <Navigate to="/admin" replace />;
        }
        if (role === 'STORE_OWNER') {
            return <Navigate to="/owner-dashboard" replace />;
        }
        return <Navigate to="/stores" replace />;
    }

    return children;
};

export default ProtectedRoute;
