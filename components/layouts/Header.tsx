"use client";

import { getUserInfo } from "@/constants/info";
import {
    contributeComments,
    helpAndSupport,
    Home,
    Hottel,
    Login,
    placedAndPrivate,
    profile,
    Tour,
    Tourist_Area,
    Tourist_Place,
} from "@/constants/router";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";
import { logOut } from "@/hooks/authLogin";
import { isAccessTokenValid } from "@/hooks/isAccessTokenValid";
import {
    faBell,
    faCircleQuestion,
    faUser,
} from "@fortawesome/free-regular-svg-icons";
import {
    faBars,
    faComment,
    faGear,
    faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link"; // 🔴 IMPORT THÊM LINK CỦA NEXT
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthBanner } from "../common/BannerComponent";
import path from "path";
import { useNotification } from "@/hooks/useNotification";
import { api } from "@/app/api/api";

const Header = () => {
    const routerList = [
        { name: "Home", r: Home },
        { name: "Khu du lịch", r: Tourist_Area },
        { name: "Địa điểm du lịch", r: Tourist_Place },
        { name: "Khách sạn", r: Hottel },
        { name: "Tour", r: Tour },
    ];

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [dropdownUser, setDropdownUser] = useState(false);
    const [dropdownNotif, setDropdownNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);
    const { setLoading } = useLoading();
    const { isAuth, user } = useAuth();
    const pathName = usePathname();
    const { notifications, setNotifications, unreadCount, setUnreadCount } =
        useNotification(isAuth);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node)
            ) {
                setDropdownNotif(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const checkPath = () => {
        if (pathName == Login) return false;
        else if (pathName == Home) return false;
        else if (pathName == "/resetPassword") return false;
        return true;
    };

    const handleNotifClick = async (notif: any) => {
        setDropdownNotif(false); // Đóng menu

        // Gọi API đánh dấu đã đọc nếu nó chưa đọc
        if (!notif.isRead) {
            try {
                const res = await api.put(`/Notification/${notif.id}/read`);
                if (res.data.success) {
                    setUnreadCount((prev) => Math.max(0, prev - 1));
                    setNotifications((prev) =>
                        prev.map((n) =>
                            n.id === notif.id ? { ...n, isRead: true } : n,
                        ),
                    );
                }
            } catch (error) {
                console.error("Lỗi đánh dấu đã đọc:", error);
            }
        }

        // if (notif.content.includes("đặt chỗ")) {
        //     router.push("/Admin/Peding"); //
        // }
    };

    // const hiddenRoutes = [
    //     Login,
    //     "/resetPassword",
    //     "/register",
    //     "/forgotPassword",
    // ];
    // if (hiddenRoutes.includes(pathName)) {
    //     // Nếu trang hiện tại nằm trong mảng hiddenRoutes thì không render Header
    //     return null;
    // }

    return (
        <>
            <header
                className={`${isScrollingDown ? "-top-20" : "top-0"} ${
                    checkPath()
                        ? "bg-sky-100 sticky"
                        : "backdrop-blur-sm fixed top-0"
                } w-full flex justify-between items-center px-4 sm:px-6 lg:px-10 py-2 sm:py-3 shadow-sm z-50 transition-all duration-300`}
            >
                {/* LOGO */}
                <Link href={Home} className="cursor-pointer">
                    <Image
                        src="/Logo.svg"
                        alt="Logo"
                        width={120}
                        height={60}
                        className="object-contain"
                        priority
                    />
                </Link>

                {/* MENU */}
                <div className="hidden lg:flex items-center gap-8">
                    {routerList.map((item, index) => (
                        <Link
                            href={item.r}
                            key={index}
                            className="relative font-semibold text-gray-700 cursor-pointer group"
                        >
                            {item.name}
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-500 transition-all group-hover:w-full"></span>
                        </Link>
                    ))}
                </div>

                {/* ICON */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Bell */}
                    {/* 🔴 KHU VỰC CHUÔNG THÔNG BÁO */}
                    {isAuth && (
                        <div className="relative" ref={notifRef}>
                            <div
                                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 cursor-pointer transition relative bg-white"
                                onClick={() => {
                                    setDropdownNotif(!dropdownNotif);
                                    setDropdownUser(false); // Đóng menu User nếu đang mở
                                }}
                            >
                                <FontAwesomeIcon
                                    className="text-gray-700 text-lg"
                                    icon={faBell}
                                />
                                {/* HIỂN THỊ CỤC ĐỎ NẾU CÓ UNREAD COUNT > 0 */}
                                {unreadCount > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
                                        {unreadCount > 99 ? "99+" : unreadCount}
                                    </div>
                                )}
                            </div>

                            {/* 🔴 BẢNG XỔ XUỐNG CỦA THÔNG BÁO */}
                            <div
                                className={`absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-100 transition-all duration-200 z-50 origin-top-right ${
                                    dropdownNotif
                                        ? "scale-100 opacity-100"
                                        : "scale-95 opacity-0 invisible"
                                }`}
                            >
                                <div className="p-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50 rounded-t-2xl">
                                    <h3 className="font-bold text-zinc-800">
                                        Thông báo
                                    </h3>
                                    <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-md">
                                        {unreadCount} mới
                                    </span>
                                </div>

                                <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200">
                                    {notifications.length === 0 ? (
                                        <div className="p-8 text-center text-sm text-zinc-400 flex flex-col items-center gap-2">
                                            <span className="text-3xl">📭</span>
                                            <p>Chưa có thông báo nào!</p>
                                        </div>
                                    ) : (
                                        notifications.map((notif, index) => (
                                            <div
                                                key={notif.id || index}
                                                onClick={() =>
                                                    handleNotifClick(notif)
                                                }
                                                className={`p-4 border-b border-zinc-50 hover:bg-zinc-50 cursor-pointer transition-colors flex gap-3 ${
                                                    !notif.isRead
                                                        ? "bg-blue-50/50"
                                                        : "opacity-75"
                                                }`}
                                            >
                                                <div className="shrink-0 pt-1">
                                                    <div
                                                        className={`w-2 h-2 rounded-full mt-1.5 ${!notif.isRead ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-transparent"}`}
                                                    ></div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <h4
                                                        className={`text-sm ${!notif.isRead ? "font-bold text-zinc-900" : "font-semibold text-zinc-700"}`}
                                                    >
                                                        {notif.title}
                                                    </h4>
                                                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                                                        {notif.content}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-blue-500 mt-1">
                                                        {new Date(
                                                            notif.createdAt,
                                                        ).toLocaleString(
                                                            "vi-VN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                            },
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* User */}
                    {isAuth ? (
                        <div className="relative group">
                            {/* Avatar */}
                            <div
                                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border relative cursor-pointer"
                                onClick={() => {
                                    setDropdownUser(!dropdownUser);
                                }}
                            >
                                <Image
                                    src={
                                        getUserInfo()?.avt ||
                                        "/Img/User_Icon.png"
                                    }
                                    alt="Avatar"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Dropdown */}
                            <div
                                className={`absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border ${
                                    dropdownUser ? "" : "opacity-0 invisible"
                                } group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50`}
                            >
                                {/* User Info */}
                                <div className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer rounded-t-xl">
                                    <Link
                                        href={profile}
                                        onClick={() => setDropdownUser(false)}
                                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden relative border border-zinc-200"
                                    >
                                        <Image
                                            src={
                                                getUserInfo()?.avt ||
                                                "/Img/User_Icon.png"
                                            }
                                            alt="Avatar"
                                            fill
                                            className="object-cover"
                                        />
                                    </Link>
                                    <span className="font-semibold text-sm text-gray-700 truncate">
                                        {getUserInfo()?.name}
                                    </span>
                                </div>

                                <div className="border-t border-zinc-100" />

                                {/* Menu */}
                                <div className="p-1">
                                    <Link
                                        href={profile}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => setDropdownUser(false)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            className="text-gray-500 w-4"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Xem trang cá nhân
                                        </span>
                                    </Link>

                                    <Link
                                        href={placedAndPrivate}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => setDropdownUser(false)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faGear}
                                            className="text-gray-500 w-4"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Cài đặt & quyền riêng tư
                                        </span>
                                    </Link>

                                    <Link
                                        href={helpAndSupport}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => setDropdownUser(false)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faCircleQuestion}
                                            className="text-gray-500 w-4"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Trợ giúp & hỗ trợ
                                        </span>
                                    </Link>

                                    <Link
                                        href={contributeComments}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                        onClick={() => setDropdownUser(false)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faComment}
                                            className="text-gray-500 w-4"
                                        />
                                        <span className="text-sm text-gray-700">
                                            Đóng góp ý kiến
                                        </span>
                                    </Link>

                                    <div className="border-t border-zinc-100 my-1" />

                                    <button
                                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 cursor-pointer text-red-500 transition-colors"
                                        onClick={() => {
                                            setDropdownUser(false);
                                            logOut(setLoading);
                                        }}
                                    >
                                        <FontAwesomeIcon
                                            icon={faRightFromBracket}
                                            className="w-4"
                                        />
                                        <span className="text-sm font-medium">
                                            Đăng xuất
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href={Login}
                            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 hover:bg-gray-100 cursor-pointer transition"
                        >
                            <FontAwesomeIcon
                                className="text-gray-700 text-lg"
                                icon={faUser}
                            />
                        </Link>
                    )}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsOpenMenu(!isOpenMenu)}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300 hover:bg-gray-50 transition"
                        >
                            <FontAwesomeIcon
                                className="text-gray-700 text-lg"
                                icon={faBars}
                            />
                        </button>
                    </div>
                    {isOpenMenu && (
                        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md border-t z-50">
                            <div className="flex flex-col">
                                {routerList.map((item, index) => (
                                    <Link
                                        href={item.r}
                                        key={index}
                                        onClick={() => setIsOpenMenu(false)}
                                        className="px-4 py-3 border-b border-gray-50 text-gray-700 font-medium hover:bg-sky-50 transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <AuthBanner />
            </header>
        </>
    );
};

export default Header;
