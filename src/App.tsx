import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';

function App() {
    return (
        <>
            <Header />
            <BrowserRouter>
                <Routes />
            </BrowserRouter>
            <Footer />
        </>
    );
}

export default App;
