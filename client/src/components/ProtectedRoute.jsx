import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user } = useAuth();

    if (user === null) {
        return <Navigate to={'/login'}/>
    } 

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to={'/login'}/>
    } else {
        return children;
    }
}
