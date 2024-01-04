import { Avatar, Box, Link, Typography } from '@mui/material';
import HeadlessTippy from '@tippyjs/react/headless';
import { useEffect, useState } from 'react';
import Wrapper from '../Popper/Wrapper';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars,
    faKey,
    faL,
    faRightFromBracket,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import useAuthStore from '../../../store/authStore';
import { AccountButton } from './AccountButton';
import { UserCircle } from '../../../icons/user-circle';
import useAuthen from '../../../hooks/authenHooks';

type Props = {};

export default function Header({}: Props) {
    const [isShowDropdown, setIsShowDropdown] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [localAccessToken, setLocalAccessToken] = useState<any>('');
    const navigate = useNavigate();
    const loggedIn = useAuthStore((state: any) => state.loggedIn);
    const logOut = useAuthStore((state: any) => state.logOut);
    const [user, setUser] = useState<any>(null);

    const accessToken = localStorage.getItem('access_token');

    const getInfo = async () => {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/auth/whoami`,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return res.data;
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            const currentUser = await getInfo();
            setUser(currentUser);
        };

        fetchUserInfo();
    }, [accessToken]);

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
            logOut();
            setIsShowDropdown(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        }

        localStorage.setItem('access_token', '');
        localStorage.setItem('refresh_token', '');
        localStorage.setItem('role', '');
        navigate('/signin');
    };

    return (
        <div
            className={
                isLoggedIn
                    ? `fixed top-0 right-0 flex justify-between pl-[450px] pr-[150px] py-[1.81rem] bg-[#0D0D0D] w-full z-[100]`
                    : `fixed top-0 right-0 flex justify-between px-[18.75rem] py-[1.81rem] bg-[#0D0D0D] w-full z-[100]`
            }
        >
            <div
                className="flex flex-row text-2xl font-bold text-white cursor-pointer"
                onClick={() => navigate('/')}
            >
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
                                        <Box
                                            sx={{
                                                alignItems: 'center',
                                                p: 2,
                                                display: 'flex',
                                            }}
                                        >
                                            <Avatar
                                                sx={{
                                                    height: 40,
                                                    width: 40,
                                                    backgroundColor: 'white',
                                                }}
                                            >
                                                <img
                                                    src={
                                                        '/static/default-avatar.jpg'
                                                    }
                                                    height={40}
                                                    width={40}
                                                    onError={(
                                                        event: React.SyntheticEvent<HTMLImageElement>
                                                    ) => {
                                                        const target =
                                                            event.target as HTMLImageElement;
                                                        target.src =
                                                            '/static/default-avatar.jpg';
                                                    }}
                                                    alt="User Avatar"
                                                />
                                                {!`/${user?.avatar}` && (
                                                    <UserCircle fontSize="small" />
                                                )}
                                            </Avatar>
                                            <Box
                                                sx={{
                                                    ml: 1,
                                                }}
                                            >
                                                <Typography variant="body1">
                                                    {user?.fullname}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    variant="body2"
                                                >
                                                    {user?.role}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <div
                                            className="flex gap-2 items-center cursor-pointer mb-2 rounded-lg p-2 hover:opacity-[0.5] hover:bg-sky-500"
                                            onClick={() => {
                                                navigate('/account');
                                                setIsShowDropdown(false);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faUser} />
                                            <p className="font-semibold">
                                                Account Information
                                            </p>
                                        </div>
                                        <div
                                            className="flex gap-2 items-center cursor-pointer mb-2 rounded-lg p-2 hover:opacity-[0.5] hover:bg-sky-500"
                                            onClick={() => {
                                                navigate('/change-password');
                                                setIsShowDropdown(false);
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faKey} />
                                            <p className="font-semibold">
                                                Change password
                                            </p>
                                        </div>
                                        <div
                                            className="flex gap-2 items-center cursor-pointer mb-2 rounded-lg p-2 hover:opacity-[0.5] hover:bg-sky-500"
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
                        {/* <AccountButton
                        icon={faBars}
                        style={{ color: '#ebecf0' }}
                        className={`p-2 cursor-pointer hover:opacity-[0.7] rounded-full `}
                        size="xl"
                        onClick={() => setIsShowDropdown(!isShowDropdown)}
                        /> */}
                        <Avatar
                            sx={{
                                height: 40,
                                width: 40,
                            }}
                            className="hover:opcatity-[0.5] cursor-pointer"
                            src={'/static/default-avatar.jpg'}
                            onClick={() => setIsShowDropdown(!isShowDropdown)}
                        >
                            <UserCircle fontSize="small" />
                        </Avatar>
                    </HeadlessTippy>
                </div>
            )}
        </div>
    );
}
