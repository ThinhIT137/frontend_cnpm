"use client";

import React, { useState, useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    Map,
    MapPin,
    Hotel,
    Plane,
    Loader2,
} from "lucide-react";
import { adminApi } from "@/app/api/adminApi"; // Chỉ cần import adminApi là đủ

// Khớp chuẩn 100% với data Controller của sếp trả về
type ApprovalItem = {
    id: number;
    name: string;
    title: string;
    address?: string; // Hotel, TouristArea, TouristPlace có address
    durationDays?: number; // Tour có duration
    rating_average: number;
    status: string;
    coverImageUrl: string;
};

type TabType = "hotel" | "tour" | "touristArea" | "touristPlace";

export default function AdminApprovalPage() {
    const [activeTab, setActiveTab] = useState<TabType>("hotel");
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<ApprovalItem[]>([]);

    const fetchPendingData = async (tab: TabType) => {
        setLoading(true);
        try {
            let res;

            // Gọi thẳng API xịn sếp vừa tạo
            switch (tab) {
                case "hotel":
                    res = await adminApi.getPendingHotels();
                    break;
                case "tour":
                    res = await adminApi.getPendingTours();
                    break;
                case "touristArea":
                    res = await adminApi.getPendingTouristAreas();
                    break;
                case "touristPlace":
                    res = await adminApi.getPendingTouristPlaces();
                    break;
            }

            // Bóc tách data từ Backend (res.data.items)
            if (res?.success) {
                const items = res.data?.items || [];
                setData(items);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error("Lỗi lấy dữ liệu pending:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingData(activeTab);
    }, [activeTab]);

    const handleApproval = async (
        id: number,
        status: "Approved" | "Rejected",
    ) => {
        if (
            status === "Rejected" &&
            !window.confirm("Bạn có chắc chắn muốn TỪ CHỐI mục này?")
        )
            return;

        try {
            let res;
            switch (activeTab) {
                case "hotel":
                    res = await adminApi.approveHotel(id, status);
                    break;
                case "tour":
                    res = await adminApi.approveTour(id, status);
                    break;
                case "touristArea":
                    res = await adminApi.approveTouristArea(id, status);
                    break;
                case "touristPlace":
                    res = await adminApi.approveTouristPlace(id, status);
                    break;
            }

            if (res?.success) {
                alert(
                    `Đã ${status === "Approved" ? "duyệt" : "từ chối"} thành công!`,
                );
                // Xóa luôn thẻ đó khỏi màn hình cho gọn mắt
                setData((prev) => prev.filter((item) => item.id !== id));
            } else {
                alert(res?.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            console.error("Lỗi duyệt:", error);
            alert("Lỗi hệ thống!");
        }
    };

    const tabs = [
        {
            id: "hotel",
            label: "Khách sạn",
            icon: <Hotel className="w-4 h-4 mr-2" />,
        },
        {
            id: "tour",
            label: "Tours",
            icon: <Plane className="w-4 h-4 mr-2" />,
        },
        {
            id: "touristArea",
            label: "Khu du lịch",
            icon: <Map className="w-4 h-4 mr-2" />,
        },
        {
            id: "touristPlace",
            label: "Địa điểm DL",
            icon: <MapPin className="w-4 h-4 mr-2" />,
        },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Kiểm Duyệt Hệ Thống
            </h1>

            {/* TABS */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm w-fit mb-6 border border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
                            activeTab === tab.id
                                ? "bg-blue-600 text-white shadow"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* BẢNG */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold w-32">
                                    Hình ảnh
                                </th>
                                <th className="p-4 font-semibold">
                                    Tên & Thông tin
                                </th>
                                <th className="p-4 font-semibold text-center w-64">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="p-8 text-center text-gray-500"
                                    >
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="p-8 text-center text-gray-500 font-medium"
                                    >
                                        Không có mục nào đang chờ duyệt.
                                    </td>
                                </tr>
                            ) : (
                                data.map((item) => (
                                    <tr
                                        key={item.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Cột Ảnh */}
                                        <td className="p-4">
                                            <img
                                                src={item.coverImageUrl}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                onError={(e) =>
                                                    (e.currentTarget.src =
                                                        "/Img/ImgNull.jpg")
                                                }
                                            />
                                        </td>
                                        {/* Cột Info */}
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800 text-lg">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-gray-600 mb-1">
                                                {item.title}
                                            </p>
                                            {item.address && (
                                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                                    <MapPin className="w-3 h-3 mr-1" />{" "}
                                                    {item.address}
                                                </p>
                                            )}
                                            {item.durationDays && (
                                                <p className="text-xs text-gray-500 flex items-center mt-1">
                                                    <Plane className="w-3 h-3 mr-1" />{" "}
                                                    {item.durationDays} ngày
                                                </p>
                                            )}
                                        </td>
                                        {/* Cột Action */}
                                        <td className="p-4">
                                            <div className="flex justify-center items-center space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleApproval(
                                                            item.id,
                                                            "Approved",
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-md border border-green-200 font-medium text-sm transition-all"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-1.5" />{" "}
                                                    Duyệt
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleApproval(
                                                            item.id,
                                                            "Rejected",
                                                        )
                                                    }
                                                    className="flex items-center px-4 py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md border border-red-200 font-medium text-sm transition-all"
                                                >
                                                    <XCircle className="w-4 h-4 mr-1.5" />{" "}
                                                    Từ chối
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
