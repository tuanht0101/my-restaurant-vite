import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBowlFood,
    faBoxArchive,
    faChartLine,
    faCouch,
    faReceipt,
    faStore,
    faUser,
    faUtensils,
} from '@fortawesome/free-solid-svg-icons';

type Props = {};

export default function SideNav({}: Props) {
    const navigate = useNavigate();

    const role = localStorage.getItem('role');
    let items = [
        {
            title: 'Dashboard',
            path: '/',
            icon: <FontAwesomeIcon icon={faChartLine} />,
        },
        {
            title: 'Manage Tables',
            path: '/tables',
            icon: <FontAwesomeIcon icon={faCouch} />,
        },
        {
            title: 'Manage Categories',
            path: '/categories',
            icon: <FontAwesomeIcon icon={faBoxArchive} />,
        },
        {
            title: 'Manage Products',
            path: '/products',
            icon: <FontAwesomeIcon icon={faUtensils} />,
        },
        {
            title: 'Manage Orders',
            path: '/orders',
            icon: <FontAwesomeIcon icon={faBowlFood} />,
        },
        {
            title: 'Manage Bills',
            path: '/bills',
            icon: <FontAwesomeIcon icon={faReceipt} />,
        },
    ];

    if (role === 'ADMIN') {
        items = [
            ...items,
            {
                title: 'Manage Users',
                path: '/users',
                icon: <FontAwesomeIcon icon={faUser} />,
            },
        ];
    }

    return (
        <div className="bg-slate-500 w-[250px] flex flex-col h-full z-[999]">
            <div className="flex gap-2 text-xl justify-center items-center my-8">
                <FontAwesomeIcon icon={faStore} style={{ color: '#ffffff' }} />
                <p className="font-bold text-white">
                    {role === 'ADMIN' ? 'Admin' : 'Staff'} Dashboard
                </p>
            </div>
            <div className="mt-1">
                {items.map((item) => (
                    <div
                        className="flex gap-2 items-center cursor-pointer rounded-lg p-3 pl-6 hover:opacity-[0.5] hover:bg-sky-500"
                        key={item.title}
                        onClick={() => navigate(item.path)}
                    >
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                (isActive ? 'text-white ' : ' ') +
                                'flex gap-2 items-center no-underline font-semibold'
                            }
                        >
                            {item.icon}
                            <p>{item.title}</p>
                        </NavLink>
                    </div>
                ))}
            </div>
        </div>
    );
}
