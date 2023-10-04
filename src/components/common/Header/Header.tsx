import { Link } from '@mui/material';

type Props = {};

export default function Header({}: Props) {
    return (
        <div className="flex justify-between px-[18.75rem] py-[1.81rem] bg-[#0D0D0D] w-full">
            <div className="flex flex-row text-2xl font-bold">
                <p className="text-[#FFF]">Mid</p>
                <p className="text-[#FF9F0D]">taste</p>
            </div>
            {/* <div className="flex flex-row ml-[21.37rem] gap-[2rem] text-white ">
                    <Link
                        href={'/'}
                        className="hover:opacity-70 hover:cursor-pointer "
                    >
                        Home
                    </Link>
                    <Link
                        href={'/menu'}
                        className="hover:opacity-70 hover:cursor-pointer"
                    >
                        Menu
                    </Link>
                    <p className="hover:opacity-70 hover:cursor-pointer">
                        Blog
                    </p>
                    <p className="hover:opacity-70 hover:cursor-pointer">
                        Pages
                    </p>
                    <p className="hover:opacity-70 hover:cursor-pointer">
                        About
                    </p>
                    <p className="hover:opacity-70 hover:cursor-pointer">
                        Shop
                    </p>
                    <p className="hover:opacity-70 hover:cursor-pointer">
                        Contact
                    </p>
                </div> */}
            <div className="">
                {/* <img src="MagnifyingGlass.svg"></img> */}
                <img src="User.svg"></img>
                {/* <img src="Tote.svg"></img> */}
            </div>
        </div>
    );
}
