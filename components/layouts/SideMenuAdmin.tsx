"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Lưu ý: Mình giữ nguyên đường dẫn 'contants' theo ý bạn,
// nhưng nếu có thể hãy đổi tên folder thành 'constants' cho chuẩn tiếng Anh nhé :))
import {
    AdminMoney,
    AdminUser,
    AdminPeding,
    AdminReport,
    AdminTouristArea,
    AdminTouristPlace,
    AdminHotel,
    AdminTour,
    AdminBanner,
} from "@/constants/router";

const SideMenuAdmin = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Mảng cấu hình các menu item
    const menuItems = [
        { title: "Tổng quan", path: "/Admin", icon: "📊" }, // Thêm trang chủ Admin
        { title: "Duyệt dịch vụ", path: AdminPeding, icon: "⏳" },
        { title: "Báo cáo vi phạm", path: AdminReport, icon: "🚩" },
        { title: "Người dùng", path: AdminUser, icon: "👥" },
        { title: "Khu du lịch", path: AdminTouristArea, icon: "🏞️" },
        { title: "Địa điểm du lịch", path: AdminTouristPlace, icon: "📍" },
        { title: "Khách sạn", path: AdminHotel, icon: "🏨" },
        { title: "Chuyến Tour", path: AdminTour, icon: "🚌" },
        { title: "Quảng cáo (Banner)", path: AdminBanner, icon: "📢" },
    ];

    // Đóng menu khi click ra ngoài (chỉ dùng cho Mobile)
    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Nút Hamburger cho Mobile (Chỉ hiện trên màn hình nhỏ) */}
            <button
                onClick={toggleMenu}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-100 text-gray-600 focus:outline-none"
            >
                {isOpen ? "✖" : "☰"}
            </button>

            {/* Lớp nền mờ (Backdrop) khi mở menu trên Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity"
                    onClick={closeMenu}
                />
            )}

            {/* Sidebar Chính */}
            <aside
                className={`fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 shadow-sm z-40 transform transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`}
            >
                {/* Logo / Header của Sidebar */}
                <div className="p-6 border-b border-gray-50 flex items-center justify-center">
                    <h2 className="text-2xl font-black text-blue-600 tracking-wider">
                        🚀 ADMIN
                    </h2>
                </div>

                {/* Danh sách Menu */}
                <div className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
                    <ul className="space-y-1.5">
                        {menuItems.map((item, index) => {
                            // Kiểm tra xem menu này có đang được chọn không
                            const isActive = pathname === item.path;

                            return (
                                <li key={index}>
                                    <Link
                                        href={item.path}
                                        onClick={closeMenu} // Click xong thì đóng menu trên mobile
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                            isActive
                                                ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium"
                                        }`}
                                    >
                                        <span className="text-xl">
                                            {item.icon}
                                        </span>
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Footer của Sidebar (Tuỳ chọn: Nút đăng xuất) */}
                <div className="p-4 border-t border-gray-50">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 font-bold rounded-xl hover:bg-red-50 transition-colors">
                        <span className="text-xl">🚪</span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default SideMenuAdmin;
