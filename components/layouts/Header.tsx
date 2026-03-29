"use client";

import { getUserInfo } from "@/constants/info";
import {
    Home,
    Hottel,
    Login,
    Tour,
    Tourist_Area,
    Tourist_Place,
} from "@/constants/router";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { logOut } from "@/libs/hooks/authLogin";
import { isAccessTokenValid } from "@/libs/hooks/isAccessTokenValid";
import { useNextRouter } from "@/libs/hooks/useNextRouter";
import {
    faBell,
    faCircleQuestion,
    faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
    faComment,
    faGear,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthBanner } from "../common/BannerComponent";
import path from "path";

const Header = () => {
    const router = [
        { name: "Home", r: Home },
        { name: "Khu du lịch", r: Tourist_Area },
        { name: "Địa điểm du lịch", r: Tourist_Place },
        { name: "Khách sạn", r: Hottel },
        { name: "Tour", r: Tour },
    ];

    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [dropdownUser, setDropdownUser] = useState(false);
    const { setLoading } = useLoading();
    const { isAuth, user } = useAuth();
    const pathName = usePathname();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY) {
                setIsScrollingDown(false);
            } else {
                setIsScrollingDown(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const checkPath = () => {
        if (pathName == Login) return false;
        else if (pathName == Home) return false;
        return true;
    };

    const { go } = useNextRouter();
    return (
        <>
            <header
                className={`${isScrollingDown ? "top-4" : "top-0"} ${checkPath() ? "bg-sky-100 sticky" : "backdrop-blur-sm fixed top-0"} w-full flex justify-between items-center px-10 py-3 shadow-sm z-100`}
            >
                {/* LOGO */}
                <div
                    onClick={() => {
                        go(Home);
                    }}
                >
                    <Image
                        src="/Logo.svg"
                        alt="Logo"
                        width={120}
                        height={60}
                        className="object-contain"
                    />
                </div>

                {/* MENU */}
                <div className="flex items-center gap-8">
                    {router.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                go(item.r);
                            }}
                            className="relative font-semibold text-gray-700 cursor-pointer group"
                        >
                            {item.name}
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
                        </div>
                    ))}
                </div>

                {/* ICON */}
                <div className="flex items-center gap-3">
                    {/* Bell */}
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 cursor-pointer transition">
                        <FontAwesomeIcon
                            className="text-gray-700 text-lg"
                            icon={faBell}
                        />
                    </div>

                    {/* User */}
                    {isAuth ? (
                        <div className="relative group">
                            {/* Avatar */}
                            <div
                                className="w-10 h-10 rounded-full overflow-hidden border relative cursor-pointer"
                                onClick={() => {
                                    setDropdownUser(!dropdownUser);
                                }}
                            >
                                <Image
                                    src={
                                        getUserInfo()?.avt ||
                                        "/Img/User_Icon.png"
                                    }
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Dropdown */}
                            <div
                                className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border ${dropdownUser ? "" : "opacity-0 invisible"} group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
                            >
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer">
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative">
                                        <Image
                                            src={
                                                getUserInfo()?.avt ||
                                                "/Img/User_Icon.png"
                                            }
                                            alt=""
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-semibold text-sm text-gray-700">
                                        {getUserInfo()?.name}
                                    </span>
                                </div>

                                <div className="border-t" />

                                {/* Menu */}
                                <div className="p-1">
                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-gray-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Xem trang cá nhân
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <FontAwesomeIcon
                                            icon={faGear}
                                            className="text-gray-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Cài đặt & quyền riêng tư
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <FontAwesomeIcon
                                            icon={faCircleQuestion}
                                            className="text-gray-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Trợ giúp & hỗ trợ
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                                        <FontAwesomeIcon
                                            icon={faComment}
                                            className="text-gray-600"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Đóng góp ý kiến
                                        </span>
                                    </div>

                                    <div className="border-t my-1" />

                                    <div
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-100 cursor-pointer text-red-500"
                                        onClick={() => {
                                            logOut(setLoading);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                        />
                                        <span className="text-sm">
                                            Đăng xuất
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => {
                                go(Login);
                            }}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 cursor-pointer transition"
                        >
                            <FontAwesomeIcon
                                className="text-gray-700 text-lg"
                                icon={faUser}
                            />
                        </div>
                    )}
                </div>
                <AuthBanner />
            </header>
        </>
    );
};

export default Header;
