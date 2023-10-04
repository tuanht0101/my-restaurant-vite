import React from 'react';
import ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Home from './pages/Home/Home.tsx';
import SignIn from './pages/SignIn/SignIn.tsx';
import SignUp from './pages/SignUp/SignUp.tsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.tsx';
import App from './App.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
