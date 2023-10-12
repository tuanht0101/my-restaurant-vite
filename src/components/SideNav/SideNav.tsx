import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';

type Props = {};

export default function SideNav({}: Props) {
    const navigate = useNavigate();
    const items = [
        {
            title: 'Overview',
            path: '/',
            icon: <FontAwesomeIcon icon={faChartLine} />,
        },
        {
            title: 'Users',
            path: '/users',
        },
    ];

    return (
        <div className="bg-slate-500 w-[200px] flex flex-col h-full">
            {items.map((item) => (
                <div
                    className="flex gap-2 items-center h-full cursor-pointer rounded-lg p-2 pl-6 hover:opacity-[0.5] hover:bg-sky-500"
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
    );
}
