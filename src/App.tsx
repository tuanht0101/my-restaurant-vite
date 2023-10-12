import './App.css';
import Routes from './routes';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/common/Header/Header';
import Footer from './components/common/Footer/Footer';
import RefreshToken from './components/common/RefreshToken/RefreshToken';
import SideNav from './components/SideNav/SideNav';
import useAuthStore from './store/authStore';

function App() {
    const loggedIn = useAuthStore((state: any) => state.loggedIn);
    return (
        <div className="flex flex-col h-full my-[6rem]">
            <BrowserRouter>
                <div className="flex flex-col h-full">
                    <Header />
                    <div className="flex flex-row h-full">
                        {loggedIn && <SideNav />}
                        <div className="flex flex-col h-full flex-1">
                            <RefreshToken />
                            <Routes />
                        </div>
                    </div>
                    {!loggedIn && <Footer />}
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
