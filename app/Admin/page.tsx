"use client";

import { useEffect, useState } from "react";
import { adminApi, SystemStatsProps } from "@/app/api/adminApi";
import { useLoading } from "@/context/LoadingContext";
import Link from "next/link"; // Dùng Link để chuyển trang
import { useNextRouter } from "@/hooks/useNextRouter"; // Hoặc dùng hook router của sếp

const AdminDashboard = () => {
    const { setLoading } = useLoading();
    const { go } = useNextRouter();
    const [stats, setStats] = useState<any>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await adminApi.getSystemStats();
            setStats(data);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi tải dữ liệu thống kê!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3">
                        📊 Bảng Điều Khiển Admin
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Quản lý toàn diện hệ thống, kiểm duyệt nội dung và theo
                        dõi các chỉ số hoạt động.
                    </p>
                </div>

                {stats ? (
                    <div className="flex flex-col gap-8">
                        {/* NHÓM 1: CẦN XỬ LÝ & KIỂM DUYỆT (Đẩy lên đầu để Admin chú ý) */}
                        <div>
                            <h2 className="text-lg font-bold text-zinc-700 mb-4 border-l-4 border-red-500 pl-3">
                                Cần Xử Lý & Kiểm Duyệt
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                {/* Card: Đang chờ duyệt (Click để tới trang Duyệt SP) */}
                                <Link
                                    href="/admin/approvals"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="absolute right-0 top-0 w-2 h-full bg-red-500 transition-all group-hover:w-3"></div>
                                    <div className="p-4 bg-red-100/80 text-red-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        ⏳
                                    </div>
                                    <div>
                                        <p className="text-sm text-red-500 font-medium mb-1">
                                            Chờ xét duyệt (Hotel/Tour)
                                        </p>
                                        <p className="text-2xl font-extrabold text-red-600">
                                            {stats.pendingApprovals || 0} mục
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Report (Báo cáo vi phạm) */}
                                <Link
                                    href="/admin/reports"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="absolute right-0 top-0 w-2 h-full bg-amber-500 transition-all group-hover:w-3"></div>
                                    <div className="p-4 bg-amber-100/80 text-amber-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        🚩
                                    </div>
                                    <div>
                                        <p className="text-sm text-amber-600 font-medium mb-1">
                                            Báo cáo vi phạm
                                        </p>
                                        <p className="text-2xl font-extrabold text-amber-600">
                                            {stats.pendingReports || 0} vụ
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Feedbacks (Phản hồi) - BỔ SUNG THÊM */}
                                <Link
                                    href="/admin/feedbacks"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-sky-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 relative overflow-hidden group cursor-pointer"
                                >
                                    <div className="absolute right-0 top-0 w-2 h-full bg-sky-500 transition-all group-hover:w-3"></div>
                                    <div className="p-4 bg-sky-100/80 text-sky-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        💬
                                    </div>
                                    <div>
                                        <p className="text-sm text-sky-600 font-medium mb-1">
                                            Feedback từ User
                                        </p>
                                        <p className="text-2xl font-extrabold text-sky-600">
                                            {stats.feedBack || 0} thư mới
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* NHÓM 2: THỐNG KÊ DOANH THU & NGƯỜI DÙNG */}
                        <div>
                            <h2 className="text-lg font-bold text-zinc-700 mb-4 border-l-4 border-green-500 pl-3">
                                Hoạt Động Hệ Thống
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                                {/* Card: Doanh thu */}
                                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                                    <div className="p-4 bg-green-100/80 text-green-600 rounded-2xl text-3xl">
                                        💰
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1">
                                            Tổng doanh thu
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {formatCurrency(
                                                stats.totalRevenue || 0,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {/* Card: Người dùng */}
                                <Link
                                    href="/admin/users"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-blue-100/80 text-blue-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        👥
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-blue-600 transition-colors">
                                            Tài khoản (User/Owner)
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.totalUsers || 0}
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Quảng cáo */}
                                <Link
                                    href="/admin/ads"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-purple-100/80 text-purple-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        📢
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-purple-600 transition-colors">
                                            Quảng cáo đang chạy
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.activeAds || 0} banner
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* NHÓM 3: QUẢN LÝ DỮ LIỆU SẢN PHẨM */}
                        <div>
                            <h2 className="text-lg font-bold text-zinc-700 mb-4 border-l-4 border-blue-500 pl-3">
                                Quản Lý Dữ Liệu
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {/* Card: Khu du lịch */}
                                <Link
                                    href="/admin/tourist-areas"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-teal-100/80 text-teal-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        🏞️
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-teal-600 transition-colors">
                                            Khu du lịch
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.totalTouristAreas || 0}
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Địa điểm du lịch */}
                                <Link
                                    href="/admin/tourist-places"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-pink-100/80 text-pink-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        📍
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-pink-600 transition-colors">
                                            Địa điểm check-in
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.totalTouristPlaces || 0}
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Khách sạn */}
                                <Link
                                    href="/admin/hotels"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-indigo-100/80 text-indigo-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        🏨
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-indigo-600 transition-colors">
                                            Khách sạn & Nơi lưu trú
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.totalHotels || 0}
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Tour */}
                                <Link
                                    href="/admin/tours"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-orange-100/80 text-orange-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        🚌
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-orange-600 transition-colors">
                                            Chuyến Tour mở bán
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.totalTours || 0}
                                        </p>
                                    </div>
                                </Link>

                                {/* Card: Marker (Vị trí đánh dấu) */}
                                {/* <Link
                                    href="/admin/markers"
                                    className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 flex items-center gap-5 group cursor-pointer"
                                >
                                    <div className="p-4 bg-sky-100/80 text-sky-600 rounded-2xl text-3xl transition-transform group-hover:scale-110">
                                        📌
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium mb-1 group-hover:text-sky-600 transition-colors">
                                            Vị trí đánh dấu (Marker)
                                        </p>
                                        <p className="text-2xl font-extrabold text-gray-800">
                                            {stats.totalMarkers || 0}
                                        </p>
                                    </div>
                                </Link> */}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Skeleton Loaders
                    <div className="flex flex-col gap-8 animate-pulse">
                        <div>
                            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2].map((item) => (
                                    <div
                                        key={item}
                                        className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5"
                                    >
                                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((item) => (
                                    <div
                                        key={item}
                                        className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-5"
                                    >
                                        <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                                            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
