"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Loader2,
    CheckCircle,
    XCircle,
    Edit,
    Trash2,
    Calendar,
    Image as ImageIcon,
    Building2,
    MapPin,
} from "lucide-react";
import { adminApi } from "@/app/api/adminApi";
import FormInsertHotel from "@/components/common/forms/FormInsertHotel";

export default function AdminHotelPage() {
    const [hotels, setHotels] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Modal Sửa
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingData, setEditingData] = useState<any>(null);

    // 1. Fetch dữ liệu
    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res: any = await adminApi.getAllHotels(
                currentPage,
                10,
                searchTerm,
                statusFilter,
            );
            if (res?.success && res.data) {
                setHotels(res.data.items || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalCount(res.data.totalCount || 0);
            } else {
                setHotels([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách khách sạn:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce tìm kiếm
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchHotels();
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [currentPage, searchTerm, statusFilter]);

    // 2. Hàm Xóa
    const handleDelete = async (id: number) => {
        if (
            !confirm(
                `Sếp có chắc chắn muốn XÓA VĨNH VIỄN khách sạn #${id} không?`,
            )
        )
            return;

        setActionLoading(id);
        try {
            const res = await adminApi.deleteHotel(id);
            if (res.success) {
                alert("✅ Xóa thành công!");
                fetchHotels();
            } else {
                alert(`❌ Lỗi: ${res.message}`);
            }
        } catch (error) {
            alert("Lỗi hệ thống khi xóa!");
        } finally {
            setActionLoading(null);
        }
    };

    // 3. Hàm Duyệt / Từ chối
    const handleApprove = async (id: number, status: string) => {
        const actionText = status === "Active" ? "Duyệt" : "Từ chối";
        if (!confirm(`Sếp muốn ${actionText} khách sạn này?`)) return;

        setActionLoading(id);
        try {
            const res = await adminApi.approveHotel(id, status);
            if (res.success) {
                alert(`✅ ${res.message}`);
                fetchHotels();
            } else {
                alert(`❌ Lỗi: ${res.message}`);
            }
        } catch (error) {
            alert("Lỗi hệ thống khi cập nhật trạng thái!");
        } finally {
            setActionLoading(null);
        }
    };

    // Mở Form Sửa
    const handleEdit = (hotel: any) => {
        setEditingData(hotel);
        setIsModalOpen(true);
    };

    // Đóng Form Sửa
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingData(null);
        fetchHotels(); // Load lại data sau khi sửa
    };

    const renderStatusBadge = (status: string) => {
        if (status === "Active" || status === "Approved")
            return (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded border border-green-200">
                    ✅ Đã duyệt
                </span>
            );
        if (status === "Pending")
            return (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded border border-yellow-200">
                    ⏳ Chờ duyệt
                </span>
            );
        if (status === "Rejected")
            return (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded border border-red-200">
                    ❌ Từ chối
                </span>
            );
        return (
            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded border border-gray-200">
                {status}
            </span>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <Building2 className="w-8 h-8 text-indigo-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Quản Lý Khách Sạn
                        </h1>
                        <p className="text-sm text-gray-500">
                            Tổng cộng: {totalCount} khách sạn
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên, địa chỉ..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <select
                        className="px-4 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="Active">✅ Đã duyệt</option>
                        <option value="Pending">⏳ Chờ duyệt</option>
                        <option value="Rejected">❌ Bị từ chối</option>
                    </select>
                </div>
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                                <th className="p-4 font-semibold w-16">ID</th>
                                <th className="p-4 font-semibold">
                                    Thông tin khách sạn
                                </th>
                                <th className="p-4 font-semibold">Ngày tạo</th>
                                <th className="p-4 font-semibold">
                                    Trạng thái
                                </th>
                                <th className="p-4 font-semibold text-right">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-10 text-center text-gray-400"
                                    >
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-indigo-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : hotels.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="p-10 text-center text-gray-500 font-medium"
                                    >
                                        Không tìm thấy khách sạn nào!
                                    </td>
                                </tr>
                            ) : (
                                hotels.map((hotel) => (
                                    <tr
                                        key={hotel.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-4 text-sm font-medium text-gray-900">
                                            #{hotel.id}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200 flex items-center justify-center">
                                                    {hotel.coverImageUrl &&
                                                    hotel.coverImageUrl !==
                                                        "/Img/ImgNull.jpg" ? (
                                                        <img
                                                            src={
                                                                hotel.coverImageUrl
                                                            }
                                                            alt={hotel.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-800 text-base line-clamp-1">
                                                        {hotel.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500 line-clamp-1 flex items-center mt-1">
                                                        <MapPin className="w-3 h-3 mr-1" />{" "}
                                                        {hotel.address}
                                                    </p>
                                                    {hotel.rating_average >
                                                        0 && (
                                                        <p className="text-xs text-yellow-500 mt-1 font-medium">
                                                            ⭐{" "}
                                                            {hotel.rating_average.toFixed(
                                                                1,
                                                            )}{" "}
                                                            đánh giá
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex items-center italic">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                                                {new Date(
                                                    hotel.createdAt,
                                                ).toLocaleDateString("vi-VN")}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {renderStatusBadge(hotel.status)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end items-center gap-2">
                                                {/* Nút Sửa */}
                                                <button
                                                    onClick={() =>
                                                        handleEdit(hotel)
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        hotel.id
                                                    }
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>

                                                {/* Nút Xóa */}
                                                <button
                                                    onClick={() =>
                                                        handleDelete(hotel.id)
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        hotel.id
                                                    }
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded transition-colors"
                                                    title="Xóa"
                                                >
                                                    {actionLoading ===
                                                    hotel.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>

                                                {/* Cụm nút Duyệt/Từ chối cho đơn Pending */}
                                                {hotel.status === "Pending" && (
                                                    <>
                                                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    hotel.id,
                                                                    "Active",
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading ===
                                                                hotel.id
                                                            }
                                                            className="p-2 text-green-600 bg-green-50 hover:bg-green-600 hover:text-white rounded transition-colors"
                                                            title="Duyệt"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleApprove(
                                                                    hotel.id,
                                                                    "Rejected",
                                                                )
                                                            }
                                                            disabled={
                                                                actionLoading ===
                                                                hotel.id
                                                            }
                                                            className="p-2 text-orange-600 bg-orange-50 hover:bg-orange-600 hover:text-white rounded transition-colors"
                                                            title="Từ chối"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Phân trang */}
                    {totalPages > 1 && (
                        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                            <button
                                disabled={currentPage <= 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1.5 text-sm bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                            >
                                Trước
                            </button>
                            <span className="px-4 py-1.5 text-sm font-medium text-gray-700">
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="px-3 py-1.5 text-sm bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Form Sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-7xl bg-transparent rounded-3xl h-full flex flex-col justify-center items-center">
                        <button
                            onClick={handleCloseModal}
                            className="absolute -top-4 -right-4 z-50 w-12 h-12 flex items-center justify-center bg-white hover:bg-red-500 text-zinc-800 hover:text-white rounded-full transition-all shadow-xl font-bold text-xl border-4 border-zinc-200 hover:border-red-600"
                        >
                            ✕
                        </button>
                        <div className="w-full">
                            {/* Gọi FormInsertHotel để sửa data */}
                            <FormInsertHotel
                                onClose={handleCloseModal}
                                initialData={editingData}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
