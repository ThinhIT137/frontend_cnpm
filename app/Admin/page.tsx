"use client";

import { useEffect, useState } from "react";
import { adminApi, SystemStatsProps } from "@/app/api/adminApi";
import { useLoading } from "@/context/LoadingContext";

const AdminDashboard = () => {
    const { setLoading } = useLoading();
    const [stats, setStats] = useState<any>(null); // Tạm để any hoặc bạn nhớ update interface SystemStatsProps nhé

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
                        📊 Tổng quan hệ thống
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Theo dõi các chỉ số hoạt động và tài nguyên của nền
                        tảng.
                    </p>
                </div>

                {/* Grid Cards - Đổi lg:grid-cols-3 thành xl:grid-cols-4 để chứa 8 card đẹp hơn */}
                {stats ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {/* 1. Card: Doanh thu */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                            <div className="p-4 bg-green-100/80 text-green-600 rounded-2xl text-3xl">
                                💰
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Tổng doanh thu
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {formatCurrency(stats.totalRevenue || 0)}
                                </p>
                            </div>
                        </div>

                        {/* 2. Card: Người dùng */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                            <div className="p-4 bg-blue-100/80 text-blue-600 rounded-2xl text-3xl">
                                👥
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Tổng người dùng
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {stats.totalUsers || 0}
                                </p>
                            </div>
                        </div>

                        {/* 3. Card: Đang chờ duyệt */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 hover:shadow-md transition-shadow flex items-center gap-5 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-2 h-full bg-red-500"></div>
                            <div className="p-4 bg-red-100/80 text-red-600 rounded-2xl text-3xl">
                                ⏳
                            </div>
                            <div>
                                <p className="text-sm text-red-500 font-medium mb-1">
                                    Cần Admin duyệt
                                </p>
                                <p className="text-2xl font-extrabold text-red-600">
                                    {stats.pendingApprovals || 0} mục
                                </p>
                            </div>
                        </div>

                        {/* 4. Card: Report (Báo cáo vi phạm) - MỚI */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow flex items-center gap-5 relative overflow-hidden">
                            <div className="absolute right-0 top-0 w-2 h-full bg-amber-500"></div>
                            <div className="p-4 bg-amber-100/80 text-amber-600 rounded-2xl text-3xl">
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
                        </div>

                        {/* 5. Card: Khu du lịch (Vùng) - MỚI */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                            <div className="p-4 bg-teal-100/80 text-teal-600 rounded-2xl text-3xl">
                                🏞️
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Khu du lịch
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {stats.totalTouristAreas || 0}
                                </p>
                            </div>
                        </div>

                        {/* 6. Card: Địa điểm du lịch - MỚI */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                            <div className="p-4 bg-pink-100/80 text-pink-600 rounded-2xl text-3xl">
                                📍
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Địa điểm check-in
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {stats.totalTouristPlaces || 0}
                                </p>
                            </div>
                        </div>

                        {/* 7. Card: Khách sạn */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                            <div className="p-4 bg-indigo-100/80 text-indigo-600 rounded-2xl text-3xl">
                                🏨
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Khách sạn hoạt động
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {stats.totalHotels || 0}
                                </p>
                            </div>
                        </div>

                        {/* 8. Card: Tour */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5">
                            <div className="p-4 bg-orange-100/80 text-orange-600 rounded-2xl text-3xl">
                                🚌
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Chuyến Tour mở bán
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {stats.totalTours || 0}
                                </p>
                            </div>
                        </div>
                        {/* 8. Card: Quảng cáo */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center gap-5 relative overflow-hidden">
                            <div className="p-4 bg-purple-100/80 text-purple-600 rounded-2xl text-3xl">
                                📢
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">
                                    Quảng cáo đang chạy
                                </p>
                                <p className="text-2xl font-extrabold text-gray-800">
                                    {stats.activeAds || 0} banner
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Cập nhật Skeleton mảng 8 phần tử để khớp với số card mới
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
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
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
