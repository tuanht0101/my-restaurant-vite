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
    const accessToken = localStorage.getItem('access_token');

    return (
        <div className="flex h-full">
            <BrowserRouter>
                {loggedIn && <SideNav />}
                <div className="flex flex-col flex-1">
                    <Header />
                    <div className="flex flex-col flex-1 mt-[6rem]">
                        <div className="flex-auto p-3">
                            <RefreshToken />
                            <Routes />
                        </div>
                        {!loggedIn && <Footer />}
                    </div>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default App;
