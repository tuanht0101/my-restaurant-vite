import { Link } from '@mui/material';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import Wrapper from '../Popper/Wrapper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faRightFromBracket,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../../store/authStore';

type Props = {};

export default function Header({}: Props) {
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const loggedIn = useAuthStore((state: any) => state.loggedIn);
    const logOut = useAuthStore((state: any) => state.logOut);

    const accessToken = localStorage.getItem('access_token');

    useEffect(() => {
        if (accessToken == null || accessToken === '') {
            setIsLoggedIn(false);
        } else {
            setIsLoggedIn(true);
        }
    }, [accessToken]);

    const handleSignOut = async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            localStorage.setItem('access_token', '');
            localStorage.setItem('refresh_token', '');
            logOut();
            setIsShowDropdown(false);
            navigate('/signin');
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="fixed top-0 left-0 right-0 flex justify-between px-[18.75rem] py-[1.81rem] bg-[#0D0D0D] w-full">
            <div className="flex flex-row text-2xl font-bold text-white">
                <p>Mid</p>
                <p className="text-[#FF9F0D]">taste</p>
            </div>
            {isLoggedIn && (
                <div className="flex items-center">
                    <HeadlessTippy
                        placement="bottom-end"
                        interactive
                        visible={isShowDropdown}
                        render={(attrs) => (
                            <div tabIndex={-1} {...attrs}>
                                <Wrapper>
                                    <div>
                                        <div
                                            className="flex gap-2 items-center cursor-pointer mb-2 rounded-lg p-2 hover:opacity-[0.7] hover:bg-slate-500"
                                            onClick={() => {
                                                // Handle account information click
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            <p className="font-semibold">
                                                Account Information
                                            </p>
                                        </div>
                                        <div
                                            className="flex gap-2 items-center cursor-pointer mb-2 rounded-lg p-2 hover:opacity-[0.7] hover:bg-slate-500"
                                            onClick={handleSignOut}
                                        >
                                            <FontAwesomeIcon
                                                icon={faRightFromBracket}
                                            />
                                            <p className="font-semibold">
                                                Sign out
                                            </p>
                                        </div>
                                    </div>
                                </Wrapper>
                            </div>
                        )}
                        onClickOutside={() => setIsShowDropdown(false)}
                    >
                        <FontAwesomeIcon
                            icon={faBars}
                            style={{ color: '#ebecf0' }}
                            className="p-2 cursor-pointer hover:opacity-[0.7] rounded-full"
                            size="xl"
                            onClick={() => setIsShowDropdown(!isShowDropdown)}
                        />
                    </HeadlessTippy>
                </div>
            )}
        </div>
    );
}
