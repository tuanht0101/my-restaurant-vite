import React from 'react';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { Navigate, useRoutes } from 'react-router-dom';

export default function Routes() {
    const isAuthenticated = () => {
        // Check if the user is authenticated (e.g., by verifying tokens)
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');
        return accessToken && refreshToken;
    };

    const getRoleFromToken = () => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            try {
                const tokenPayload = JSON.parse(
                    atob(accessToken.split('.')[1])
                );
                return tokenPayload.role;
            } catch (error) {
                console.error('Error decoding access token:', error);
            }
        }
        return null;
    };

    const isAdmin = () => {
        const userRole = getRoleFromToken();
        return userRole === 'ADMIN';
    };

    const ProtectedRoute: React.FC<{
        element: React.ReactNode;
        adminOnly?: boolean;
    }> = ({ element, adminOnly = false }) => {
        if (adminOnly && !isAdmin()) {
            return <Navigate to="/signin" replace={true} />;
        }

        return isAuthenticated() ? (
            element
        ) : (
            <Navigate to="/signin" replace={true} />
        );
    };

    const router = [
        {
            path: '/signup',
            element: <SignUp />,
        },
        {
            path: '/signin',
            element: <SignIn />,
        },
        {
            path: '/reset-password',
            element: <ResetPassword />,
        },
        {
            path: '/',
            element: <ProtectedRoute element={<Home />} />,
        },
    ];

    const element = useRoutes(router);

    return element;
}
