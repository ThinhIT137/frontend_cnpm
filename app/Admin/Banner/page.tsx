"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Loader2,
    Edit,
    Trash2,
    Calendar,
    Megaphone,
    ToggleLeft,
    ToggleRight,
    PlusCircle,
    Link as LinkIcon,
} from "lucide-react";
import { adminApi } from "@/app/api/adminApi";

export default function AdminBannerPage() {
    const [ads, setAds] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [actionLoading, setActionLoading] = useState<number | null>(null);

    // Filters & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    // Modal Form (Dùng chung cho Thêm & Sửa)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        title: "",
        description: "",
        position: "Home", // Mặc định
        url: "",
        name: "",
        phone: "",
    });

    // 1. Fetch dữ liệu
    const fetchAds = async () => {
        setLoading(true);
        try {
            const res: any = await adminApi.getAllAds(
                currentPage,
                10,
                searchTerm,
            );
            if (res?.success && res.data) {
                setAds(res.data.items || []);
                setTotalPages(res.data.totalPages || 1);
                setTotalCount(res.data.totalCount || 0);
            } else {
                setAds([]);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách banner:", error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce tìm kiếm
    useEffect(() => {
        const delayDebounce = setTimeout(() => fetchAds(), 500);
        return () => clearTimeout(delayDebounce);
    }, [currentPage, searchTerm]);

    // 2. Mở modal Thêm mới
    const handleOpenAdd = () => {
        setFormData({
            id: 0,
            title: "",
            description: "",
            position: "Home",
            url: "",
            name: "",
            phone: "",
        });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    // 3. Mở modal Sửa
    const handleOpenEdit = (ad: any) => {
        setFormData({
            id: ad.id,
            title: ad.title || "",
            description: ad.description || "",
            position: ad.position || "Home",
            url: ad.url || "",
            name: ad.name || "",
            phone: ad.phone || "",
        });
        setIsEditing(true);
        setIsModalOpen(true);
    };

    // 4. Submit Form (Lưu)
    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading(-1); // -1 là đang loading form
        try {
            let res;
            if (isEditing) {
                res = await adminApi.updateAd(formData.id, formData);
            } else {
                res = await adminApi.createAd(formData);
            }

            if (res.success) {
                alert(`✅ ${res.message}`);
                setIsModalOpen(false);
                fetchAds();
            } else {
                alert(`❌ Lỗi: ${res.message}`);
            }
        } catch (error) {
            alert("Đã xảy ra lỗi khi lưu thông tin.");
        } finally {
            setActionLoading(null);
        }
    };

    // 5. Hàm Xóa
    const handleDelete = async (id: number) => {
        if (!confirm(`Sếp có chắc chắn muốn XÓA quảng cáo #${id} không?`))
            return;

        setActionLoading(id);
        try {
            const res = await adminApi.deleteAd(id);
            if (res.success) {
                alert("✅ Xóa thành công!");
                fetchAds();
            } else {
                alert(`❌ Lỗi: ${res.message}`);
            }
        } catch (error) {
            alert("Lỗi hệ thống khi xóa!");
        } finally {
            setActionLoading(null);
        }
    };

    // 6. Hàm Bật/Tắt
    const handleToggleStatus = async (id: number) => {
        setActionLoading(id);
        try {
            const res = await adminApi.toggleAdStatus(id);
            if (res.success) {
                fetchAds(); // Refresh mượt mà
            } else {
                alert(`❌ Lỗi: ${res.message}`);
            }
        } catch (error) {
            alert("Lỗi hệ thống khi đổi trạng thái!");
        } finally {
            setActionLoading(null);
        }
    };

    // Helper format ngày
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header & Filter */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center">
                    <Megaphone className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Quản Lý Quảng Cáo (Banner)
                        </h1>
                        <p className="text-sm text-gray-500">
                            Tổng cộng: {totalCount} banner trên hệ thống
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm đối tác, tiêu đề..."
                            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                    <button
                        onClick={handleOpenAdd}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <PlusCircle className="w-4 h-4" /> Thêm Banner Mới
                    </button>
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
                                    Thông tin Banner
                                </th>
                                <th className="p-4 font-semibold">
                                    Vị trí & Link
                                </th>
                                <th className="p-4 font-semibold">Thời hạn</th>
                                <th className="p-4 font-semibold text-center">
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
                                        colSpan={6}
                                        className="p-10 text-center text-gray-400"
                                    >
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-purple-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : ads.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="p-10 text-center text-gray-500 font-medium"
                                    >
                                        Chưa có banner quảng cáo nào!
                                    </td>
                                </tr>
                            ) : (
                                ads.map((ad) => (
                                    <tr
                                        key={ad.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-4 text-sm font-medium text-gray-900">
                                            #{ad.id}
                                        </td>
                                        <td className="p-4">
                                            <div>
                                                <p className="font-bold text-gray-800 text-base line-clamp-1">
                                                    {ad.title}
                                                </p>
                                                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                    {ad.description}
                                                </p>
                                                <div className="text-xs text-purple-600 font-semibold mt-1 bg-purple-50 inline-block px-2 py-0.5 rounded">
                                                    👤 Đối tác: {ad.name} - 📞{" "}
                                                    {ad.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-sm font-bold text-gray-700">
                                                📍 {ad.position}
                                            </p>
                                            {ad.url && (
                                                <a
                                                    href={ad.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-blue-500 hover:underline flex items-center mt-1 line-clamp-1 max-w-[150px]"
                                                >
                                                    <LinkIcon className="w-3 h-3 mr-1 flex-shrink-0" />{" "}
                                                    Link đích
                                                </a>
                                            )}
                                        </td>
                                        <td className="p-4 text-xs text-gray-600">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center text-green-600">
                                                    <Calendar className="w-3 h-3 mr-1" />{" "}
                                                    Từ:{" "}
                                                    {formatDate(ad.start_date)}
                                                </span>
                                                <span className="flex items-center text-red-500">
                                                    <Calendar className="w-3 h-3 mr-1" />{" "}
                                                    Đến:{" "}
                                                    {formatDate(ad.end_date)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(ad.id)
                                                }
                                                disabled={
                                                    actionLoading === ad.id
                                                }
                                                className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors ${
                                                    ad.isActive
                                                        ? "text-green-600 bg-green-50 hover:bg-green-100"
                                                        : "text-gray-400 bg-gray-100 hover:bg-gray-200"
                                                }`}
                                                title={
                                                    ad.isActive
                                                        ? "Đang bật (Click để tắt)"
                                                        : "Đang tắt (Click để bật)"
                                                }
                                            >
                                                {actionLoading === ad.id ? (
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                ) : ad.isActive ? (
                                                    <ToggleRight className="w-6 h-6" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end items-center gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleOpenEdit(ad)
                                                    }
                                                    disabled={
                                                        actionLoading === ad.id
                                                    }
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded transition-colors"
                                                    title="Sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(ad.id)
                                                    }
                                                    disabled={
                                                        actionLoading === ad.id
                                                    }
                                                    className="p-2 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white rounded transition-colors"
                                                    title="Xóa"
                                                >
                                                    {actionLoading === ad.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
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

            {/* Modal Form Thêm/Sửa Inline */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="bg-purple-600 px-6 py-4 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing
                                    ? "Sửa Quảng Cáo"
                                    : "Thêm Quảng Cáo Mới"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white/80 hover:text-white text-2xl font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmitForm}
                            className="p-6 flex flex-col gap-4"
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Tiêu đề quảng cáo *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="VD: Khuyến mãi Hè 2026..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Mô tả ngắn
                                </label>
                                <textarea
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                                    placeholder="Nhập mô tả..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Đối tác (Tên) *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                                        placeholder="Tên công ty/người đặt..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                                        placeholder="0987..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Vị trí hiển thị *
                                    </label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                position: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500 bg-white"
                                    >
                                        <option value="Home">
                                            Trang chủ (Home)
                                        </option>
                                        <option value="Sidebar">
                                            Thanh bên (Sidebar)
                                        </option>
                                        <option value="Footer">
                                            Chân trang (Footer)
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Đường dẫn Link (URL)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                url: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-purple-500"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end gap-3 border-t border-gray-100 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading === -1}
                                    className="px-5 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    {actionLoading === -1 ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Lưu Quảng Cáo"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
