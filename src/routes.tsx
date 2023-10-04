import React from 'react';
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import SignIn from './pages/SignIn/SignIn';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import { useRoutes } from 'react-router-dom';

export default function Routes() {
    const router = [
        {
            path: '/',
            element: <Home />,
        },
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
    ];

    const element = useRoutes(router);

    return element;
}
