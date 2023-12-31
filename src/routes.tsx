import React from 'react';
import SignIn from './pages/SignIn/SignIn';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { Navigate, useRoutes } from 'react-router-dom';
import User from './pages/User/User';
import Account from './pages/Account/Account';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Tables from './pages/Tables/Tables';
import Categories from './pages/Categories/Categories';
import Products from './pages/Products/Products';
import Bills from './pages/Bills/Bills';
import Overview from './pages/Overview/Overview';
import ErrorPage from './pages/404/404';
import OrderPage from './pages/Orders/Orders';

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
        // {
        //     path: '/signup',
        //     element: <SignUp />,
        // },
        {
            path: '/signin',
            element: <SignIn />,
        },
        {
            path: '/reset-password',
            element: <ResetPassword />,
        },
        {
            path: '/change-password',
            element: <ProtectedRoute element={<ChangePassword />} />,
        },
        {
            path: '/',
            element: <ProtectedRoute element={<Overview />} />,
        },
        {
            path: '/users',
            element: <ProtectedRoute element={<User />} adminOnly={true} />,
        },
        {
            path: '/account',
            element: <ProtectedRoute element={<Account />} />,
        },
        {
            path: '/tables',
            element: <ProtectedRoute element={<Tables />} />,
        },
        {
            path: '/categories',
            element: (
                <ProtectedRoute element={<Categories />} adminOnly={true} />
            ),
        },
        {
            path: '/products',
            element: <ProtectedRoute element={<Products />} adminOnly={true} />,
        },
        {
            path: '/orders',
            element: <ProtectedRoute element={<OrderPage />} />,
        },
        {
            path: '/bills',
            element: <ProtectedRoute element={<Bills />} />,
            // children: [
            //     {
            //         path: ':id',
            //         element:
            //     }
            // ]
        },
        {
            path: '/*',
            element: <ErrorPage />,
        },
    ];

    const element = useRoutes(router);

    return element;
}
