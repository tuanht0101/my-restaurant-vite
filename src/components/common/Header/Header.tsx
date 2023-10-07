import { Link } from '@mui/material';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import Wrapper from '../Popper/Wrapper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

type Props = {};

export default function Header({}: Props) {
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    const accessToken = localStorage.getItem('access_token');

    useEffect(() => {
        if (accessToken) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [accessToken]);

    const handleSignOut = async () => {
        await axios
            .post(
                `${import.meta.env.VITE_API_URL}/auth/logout`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then((response) => {
                localStorage.setItem('access_token', '');
                localStorage.setItem('refresh_token', '');
                navigate('/signin');
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    return (
        <div className="flex justify-between px-[18.75rem] py-[1.81rem] bg-[#0D0D0D] w-full">
            <div className="flex flex-row text-2xl font-bold">
                <p className="text-[#FFF]">Mid</p>
                <p className="text-[#FF9F0D]">taste</p>
            </div>
            <div className="">
                <HeadlessTippy
                    interactive
                    visible={isShowDropdown}
                    render={(attrs) => (
                        <div tabIndex={-1} {...attrs} className="">
                            <Wrapper>
                                {accessToken == null ? (
                                    <div>
                                        <p className="cursor-pointer hover:opacity-[0.7]">
                                            Sign in
                                        </p>
                                        <p className="cursor-pointer hover:opacity-[0.7]">
                                            Sign up
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="cursor-pointer hover:opacity-[0.7]">
                                            Account Infomation
                                        </p>
                                        <p
                                            className="cursor-pointer hover:opacity-[0.7]"
                                            onClick={() => handleSignOut()}
                                        >
                                            Sign out
                                        </p>
                                    </div>
                                )}
                            </Wrapper>
                        </div>
                    )}
                    onClickOutside={() => setIsShowDropdown(false)}
                >
                    <img
                        src="User.svg"
                        className="cursor-pointer hover:opacity-[0.7]"
                        onClick={() => setIsShowDropdown(!isShowDropdown)}
                    ></img>
                </HeadlessTippy>
            </div>
        </div>
    );
}
