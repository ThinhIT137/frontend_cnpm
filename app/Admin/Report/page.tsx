"use client";

import React, { useState, useEffect } from "react";
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Eye,
    Loader2,
    ShieldAlert,
} from "lucide-react";
import { adminApi, ReportProps } from "@/app/api/adminApi"; // Nhớ trỏ lại đường dẫn cho chuẩn nhé sếp

export default function AdminReportPage() {
    const [loading, setLoading] = useState<boolean>(true);
    const [reports, setReports] = useState<ReportProps[]>([]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await adminApi.getReports();
            setReports(data || []);
        } catch (error) {
            console.error("Lỗi khi gọi API lấy reports:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    // Hàm render màu cho Trạng thái
    const renderStatusBadge = (status: string) => {
        switch (status) {
            case "Pending":
                return (
                    <span className="flex items-center w-fit px-2.5 py-1 bg-yellow-50 text-yellow-600 border border-yellow-200 rounded-full text-xs font-medium">
                        <Clock className="w-3 h-3 mr-1" /> Chờ xử lý
                    </span>
                );
            case "Resolved":
            case "Approved":
                return (
                    <span className="flex items-center w-fit px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" /> Đã giải quyết
                    </span>
                );
            default:
                return (
                    <span className="flex items-center w-fit px-2.5 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-full text-xs font-medium">
                        {status}
                    </span>
                );
        }
    };

    // Hàm format ngày tháng cho đẹp
    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    // Hàm render Loại Entity (Ví dụ: Hotel, Tour, User...)
    const renderEntityType = (type: string, id: number) => {
        return (
            <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold border border-blue-100">
                {type}{" "}
                <span className="ml-1 text-blue-500 opacity-70">#{id}</span>
            </span>
        );
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex items-center mb-6">
                <ShieldAlert className="w-8 h-8 text-red-600 mr-3" />
                <h1 className="text-2xl font-bold text-gray-800">
                    Quản Lý Báo Cáo Vi Phạm
                </h1>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase tracking-wider">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">
                                    Ngày báo cáo
                                </th>
                                <th className="p-4 font-semibold">
                                    Mục bị báo cáo
                                </th>
                                <th className="p-4 font-semibold w-1/3">
                                    Lý do & Chi tiết
                                </th>
                                <th className="p-4 font-semibold">
                                    Người gửi (ID)
                                </th>
                                <th className="p-4 font-semibold">
                                    Trạng thái
                                </th>
                                <th className="p-4 font-semibold text-center">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-gray-500"
                                    >
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                                        Đang tải danh sách báo cáo...
                                    </td>
                                </tr>
                            ) : reports.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="p-8 text-center text-gray-500 font-medium"
                                    >
                                        Chưa có báo cáo vi phạm nào. Hệ thống
                                        đang bình yên!
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr
                                        key={report.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="p-4 text-sm font-medium text-gray-900">
                                            #{report.id}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatDate(report.createdAt)}
                                        </td>
                                        <td className="p-4">
                                            {renderEntityType(
                                                report.entityType,
                                                report.entityId,
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-gray-800 text-sm flex items-center">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-500 mr-1.5" />
                                                {report.reason}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {report.description ||
                                                    "Không có chi tiết..."}
                                            </p>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500 font-mono">
                                            {report.reportedByUserId?.substring(
                                                0,
                                                8,
                                            )}
                                            ...
                                        </td>
                                        <td className="p-4">
                                            {renderStatusBadge(report.status)}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-center items-center space-x-2">
                                                {/* Nút Xem Chi tiết (Mock UI) */}
                                                <button
                                                    onClick={() =>
                                                        alert(
                                                            `Đang xem chi tiết report ID: ${report.id}`,
                                                        )
                                                    }
                                                    className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>

                                                {/* Nút Đánh dấu đã giải quyết */}
                                                {report.status ===
                                                    "Pending" && (
                                                    <button
                                                        onClick={() =>
                                                            alert(
                                                                `Chức năng Resolve đang chờ sếp làm API Backend cho Report ID: ${report.id}`,
                                                            )
                                                        }
                                                        className="p-2 text-green-600 bg-green-50 hover:bg-green-600 hover:text-white rounded transition-colors"
                                                        title="Đánh dấu đã giải quyết"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                )}
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
