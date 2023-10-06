import { Link } from '@mui/material';
import HeadlessTippy from '@tippyjs/react/headless';
import { useState } from 'react';
import Wrapper from '../Popper/Wrapper';

type Props = {};

export default function Header({}: Props) {
    const [isShowDropdown, setIsShowDropdown] = useState(false);

    const guessDropdown = ['Sign in', 'Sign up'];
    const registedDropdown = ['Account Information', 'Log out'];

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
                                <div>
                                    <p>Sign in</p>
                                    <p>Sign up</p>
                                </div>
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
