"use client";

import React, { useState, useEffect } from "react";
import PlacedAndPrivatePage from "@/app/(main)/(profile)/placedAndPrivate/page";
import { useLoading } from "@/context/LoadingContext";
import { profileApi } from "@/app/api/profileApi";
import FormInsertTouristArea from "@/components/common/forms/FormInsertTouristArea";
import FormInsertTouristPlace from "@/components/common/forms/FormInsertTouristPlace";
import FormInsertMarker from "@/components/common/forms/FormInsertMarker";
import FormInsertTour from "@/components/common/forms/FormInsertTour";
import FormInsertHotel from "@/components/common/forms/FormInsertHotel";

export default function ProfileDashboard() {
    const { setLoading } = useLoading();
    const [isMounted, setIsMounted] = useState(false);

    const [activeTab, setActiveTab] = useState("profile");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<any>(null);

    // 🔴 THÊM STATE TÌM KIẾM VÀ LỌC
    const [keyword, setKeyword] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const [tableData, setTableData] = useState<any[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const [userInfo, setUserInfo] = useState({
        name: "",
        avt: "/Img/User_Icon.png",
        email: "",
        role: "user",
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUserInfo({
                name: localStorage.getItem("name") || "Khách vô danh",
                avt: localStorage.getItem("avt") || "/Img/User_Icon.png",
                email: localStorage.getItem("email") || "Chưa có email",
                role: localStorage.getItem("role")?.toLowerCase() || "user",
            });
        }
        setIsMounted(true);
    }, []);

    // 🔴 SỬA HÀM FETCH ĐỂ NHẬN KEYWORD VÀ STATUS
    const fetchTableData = async (
        tab: string,
        page: number = 1,
        searchKw: string = "",
        searchStatus: string = "",
    ) => {
        if (tab === "profile") return;
        setLoading(true);
        try {
            let res;
            switch (tab) {
                case "tourist_area":
                    res = await profileApi.getMyTouristAreas(
                        page,
                        10,
                        searchKw,
                        searchStatus,
                    );
                    break;
                case "tourist_place":
                    res = await profileApi.getMyTouristPlaces(
                        page,
                        10,
                        searchKw,
                        searchStatus,
                    );
                    break;
                case "hotel":
                    res = await profileApi.getMyHotels(
                        page,
                        10,
                        searchKw,
                        searchStatus,
                    );
                    break;
                case "tour":
                    res = await profileApi.getMyTours(
                        page,
                        10,
                        searchKw,
                        searchStatus,
                    );
                    break;
                case "review":
                    res = await profileApi.getMyReviews(page, 10);
                    break;
                case "marker":
                    res = await profileApi.getMyMarkers();
                    setTableData(res.data || []);
                    setTotalCount(res.data?.length || 0);
                    setTotalPages(1);
                    setLoading(false);
                    return;
            }

            if (res && res.success) {
                setTableData(res.data.items || []);
                setTotalCount(res.data.totalCount || 0);
                setTotalPages(res.data.totalPages || 1);
                setCurrentPage(res.data.currentPage || 1);
            }
        } catch (error) {
            setTableData([]);
        } finally {
            setLoading(false);
        }
    };

    // 🔴 EFFECT TÌM KIẾM DEBOUNCE (CHỐNG SPAM API)
    useEffect(() => {
        if (isMounted && activeTab !== "profile") {
            const delayDebounceFn = setTimeout(() => {
                fetchTableData(activeTab, currentPage, keyword, filterStatus);
            }, 500); // 0.5s sau khi ngưng gõ mới gọi API

            return () => clearTimeout(delayDebounceFn);
        }
    }, [keyword, filterStatus, currentPage, activeTab, isMounted]);

    // Khi đổi Tab thì XÓA trắng ô Search
    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
        setKeyword("");
        setFilterStatus("");
        setCurrentPage(1);
    };

    const translateRole = (role: string) => {
        /* Giữ nguyên */
        switch (role) {
            case "admin":
                return "Quản trị viên";
            case "hotel":
                return "Chủ khách sạn";
            case "tour":
                return "Chủ Tour";
            case "owner":
                return "Chủ doanh nghiệp";
            default:
                return "Người dùng thường";
        }
    };

    const getMenuItems = (role: string) => {
        /* Giữ nguyên */
        let menu = [
            { id: "profile", label: "👤 Thông tin cá nhân" },
            { id: "marker", label: "📍 Địa điểm đã đánh dấu" },
            { id: "review", label: "⭐ Quản lý đánh giá" },
        ];
        if (["user", "admin", "owner", "tour", "hotel"].includes(role)) {
            menu.push({ id: "tourist_area", label: "🏞️ Quản lý Khu du lịch" });
            menu.push({ id: "tourist_place", label: "🗺️ Quản lý Địa điểm" });
        }
        if (["hotel", "owner", "admin"].includes(role))
            menu.push({ id: "hotel", label: "🏨 Quản lý Khách sạn" });
        if (["tour", "owner", "admin"].includes(role))
            menu.push({ id: "tour", label: "🚌 Quản lý Tour" });
        return menu;
    };

    const handleOpenAdd = () => {
        setEditingData(null);
        setIsModalOpen(true);
    };
    const handleOpenEdit = (itemData: any) => {
        setEditingData(itemData);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        fetchTableData(activeTab, currentPage, keyword, filterStatus);
    };

    const handleDelete = async (id: number) => {
        /* Giữ nguyên */
        if (!confirm("Sếp có chắc muốn bay màu em nó không?")) return;
        try {
            if (activeTab === "marker") await profileApi.deleteMarker(id);
            else if (activeTab === "tourist_area")
                await profileApi.deleteTouristArea(id);
            else if (activeTab === "tourist_place")
                await profileApi.deleteTouristPlace(id);
            else if (activeTab === "hotel") await profileApi.deleteHotel(id);
            else if (activeTab === "tour") await profileApi.deleteTour(id);
            alert("🗑️ Bay màu thành công!");
            fetchTableData(activeTab, currentPage, keyword, filterStatus);
        } catch (err: any) {
            alert("❌ Lỗi xóa!");
        }
    };

    const currentMenu = getMenuItems(userInfo.role);

    const renderTableManager = (
        title: string,
        showFilterStatus: boolean = true,
    ) => {
        return (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-zinc-100 min-h-[600px] flex flex-col">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 border-b border-zinc-100 pb-4 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-800">
                            {title}
                        </h2>
                        <p className="text-sm text-zinc-500 mt-1">
                            Hệ thống quản lý dữ liệu.
                        </p>
                    </div>
                    {activeTab !== "review" && (
                        <button
                            onClick={handleOpenAdd}
                            className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
                        >
                            <span>+</span> Thêm mới
                        </button>
                    )}
                </div>

                {/* 🔴 GẮN STATE CHO INPUT VÀ SELECT NÈ */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="🔍 Nhập từ khóa tìm kiếm (Tên, tiêu đề)..."
                            className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-sm text-zinc-700"
                        />
                    </div>
                    {showFilterStatus && (
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-sm text-zinc-700 min-w-[180px] cursor-pointer"
                        >
                            <option value="">Trạng thái: Tất cả</option>
                            <option value="Active">✅ Đã duyệt</option>
                            <option value="Pending">⏳ Chờ duyệt</option>
                            <option value="Rejected">❌ Bị từ chối</option>
                        </select>
                    )}
                </div>

                {/* BẢNG DỮ LIỆU - GIỮ NGUYÊN CODE CŨ CỦA SẾP */}
                <div className="overflow-x-auto rounded-xl border border-zinc-200 flex-1">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead className="bg-zinc-50 sticky top-0 z-10">
                            <tr className="text-zinc-600 text-sm border-b border-zinc-200">
                                <th className="p-4 font-semibold w-16 text-center">
                                    ID
                                </th>
                                <th className="p-4 font-semibold">
                                    Tên hiển thị
                                </th>
                                {showFilterStatus && (
                                    <th className="p-4 font-semibold">
                                        Trạng thái
                                    </th>
                                )}
                                <th className="p-4 font-semibold text-right">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="p-8 text-center text-zinc-500"
                                    >
                                        📭 Chưa có dữ liệu nào!
                                    </td>
                                </tr>
                            ) : (
                                tableData.map((row: any, index: number) => (
                                    <tr
                                        key={row.id || index}
                                        className="border-b border-zinc-100 hover:bg-zinc-50/80 transition-colors"
                                    >
                                        <td className="p-4 text-sm text-zinc-500 text-center">
                                            #{row.id}
                                        </td>
                                        <td className="p-4 font-medium text-zinc-800">
                                            {row.name ||
                                                row.title ||
                                                "Chưa có tên"}
                                            {row.price && (
                                                <div className="text-xs text-sky-600 font-semibold">
                                                    {row.price.toLocaleString()}{" "}
                                                    VNĐ
                                                </div>
                                            )}
                                        </td>
                                        {showFilterStatus && (
                                            <td className="p-4">
                                                {row.status === "Approved" ||
                                                row.status === "Active" ||
                                                row.status === "ACTIVE" ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg border border-green-200">
                                                        Đã duyệt
                                                    </span>
                                                ) : row.status === "Pending" ? (
                                                    <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
                                                        Chờ duyệt
                                                    </span>
                                                ) : row.status ===
                                                  "Rejected" ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-lg border border-red-200">
                                                        Bị từ chối
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg border border-zinc-200">
                                                        {row.status || "N/A"}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        <td className="p-4 flex gap-2 justify-end">
                                            {activeTab !== "review" && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            handleOpenEdit(row)
                                                        }
                                                        className="px-4 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-sm font-semibold rounded-lg transition-colors"
                                                    >
                                                        ✏️ Sửa
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(row.id)
                                                        }
                                                        className="px-4 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold rounded-lg transition-colors"
                                                    >
                                                        🗑️ Xóa
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* PHÂN TRANG */}
                    <div className="p-4 text-center text-sm text-zinc-500 flex justify-between items-center border-t border-zinc-100">
                        <span>
                            Tổng số:{" "}
                            <strong className="text-zinc-800">
                                {totalCount}
                            </strong>{" "}
                            mục
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1 bg-zinc-100 rounded-md disabled:opacity-50"
                            >
                                ◀ Trước
                            </button>
                            <span className="px-2 py-1">
                                Trang {currentPage} / {totalPages || 1}
                            </span>
                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="px-3 py-1 bg-zinc-100 rounded-md disabled:opacity-50"
                            >
                                Sau ▶
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (!isMounted) return null;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* MENU TRÁI */}
                <div className="lg:col-span-3 flex flex-col gap-4 h-fit sticky top-24">
                    {/* ... (Giữ nguyên thẻ user) ... */}
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-zinc-100">
                            <img
                                src={userInfo.avt}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = "/Img/User_Icon.png";
                                }}
                            />
                        </div>
                        <h3 className="font-bold text-zinc-800 text-lg truncate w-full px-2">
                            {userInfo.name}
                        </h3>
                        <p className="text-sm text-zinc-500 truncate w-full px-2 mb-3">
                            {userInfo.email}
                        </p>
                        <div className="px-4 py-1.5 bg-sky-50 border border-sky-100 text-sky-700 rounded-full text-xs font-bold uppercase tracking-wider">
                            {translateRole(userInfo.role)}
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-zinc-100 flex flex-col gap-1">
                        <div className="px-2 pb-3 mb-2 border-b border-zinc-100">
                            <h4 className="font-bold text-zinc-800 text-sm uppercase tracking-wider">
                                Bảng điều khiển
                            </h4>
                        </div>
                        {currentMenu.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={`text-left px-4 py-3 rounded-xl font-medium text-sm transition-all ${activeTab === item.id ? "bg-sky-50 text-sky-700 shadow-sm border border-sky-100" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 border border-transparent"}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* NỘI DUNG PHẢI */}
                <div className="lg:col-span-9">
                    {activeTab === "profile" && <PlacedAndPrivatePage />}
                    {activeTab === "marker" &&
                        renderTableManager("📍 Địa Điểm Đã Đánh Dấu", false)}
                    {activeTab === "review" &&
                        renderTableManager("⭐ Quản Lý Đánh Giá", false)}
                    {activeTab === "tourist_area" &&
                        renderTableManager("🏞️ Quản Lý Khu Du Lịch")}
                    {activeTab === "tourist_place" &&
                        renderTableManager("🗺️ Quản Lý Địa Điểm Dịch Vụ")}
                    {activeTab === "hotel" &&
                        renderTableManager("🏨 Quản Lý Khách Sạn")}
                    {activeTab === "tour" &&
                        renderTableManager("🚌 Quản Lý Chuyến Đi (Tour)")}
                </div>
            </div>

            {/* MODAL POPUP THÊM/SỬA */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 lg:p-10">
                    <div className="relative w-full max-w-7xl bg-transparent rounded-3xl h-full flex flex-col justify-center items-center">
                        <button
                            onClick={handleCloseModal}
                            className="absolute -top-4 -right-4 z-50 w-12 h-12 flex items-center justify-center bg-white hover:bg-red-500 text-zinc-800 hover:text-white rounded-full transition-all shadow-xl font-bold text-xl border-4 border-zinc-200 hover:border-red-600"
                        >
                            ✕
                        </button>
                        <div className="w-full">
                            {activeTab === "tourist_area" && (
                                <FormInsertTouristArea
                                    onClose={handleCloseModal}
                                    initialData={editingData}
                                />
                            )}
                            {activeTab === "tourist_place" && (
                                <FormInsertTouristPlace
                                    onClose={handleCloseModal}
                                    initialData={editingData}
                                />
                            )}
                            {activeTab === "marker" && (
                                <FormInsertMarker
                                    onClose={handleCloseModal}
                                    initialData={editingData}
                                />
                            )}
                            {activeTab === "tour" && (
                                <FormInsertTour
                                    onClose={handleCloseModal}
                                    initialData={editingData}
                                />
                            )}
                            {activeTab === "hotel" && (
                                <FormInsertHotel
                                    onClose={handleCloseModal}
                                    initialData={editingData}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
