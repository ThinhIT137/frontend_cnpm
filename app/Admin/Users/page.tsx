"use client";

import React, { useState, useEffect } from "react";
import {
    Users,
    ShieldCheck,
    Lock,
    Unlock,
    UserCog,
    Search,
    Loader2,
    Mail,
    Calendar,
} from "lucide-react";
import { adminApi } from "@/app/api/adminApi";

// Định nghĩa chuẩn Type User dựa trên Backend của sếp
type UserItem = {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
};

export default function AdminUserPage() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // 1. Load danh sách User
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await adminApi.getUsers(1, 100); // Lấy tạm 100 người demo cho sướng sếp ạ
            if (res?.success) {
                setUsers(res.data?.items || []);
            }
        } catch (error) {
            console.error("Lỗi lấy danh sách user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // 2. Chức năng Khóa/Mở khóa tài khoản
    const handleToggleStatus = async (userId: string) => {
        setUpdatingId(userId);
        try {
            const res = await adminApi.toggleUserStatus(userId);
            if (res.success) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === userId ? { ...u, isActive: !u.isActive } : u,
                    ),
                );
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert("Lỗi cập nhật trạng thái!");
        } finally {
            setUpdatingId(null);
        }
    };

    // 3. Chức năng Đổi Role
    const handleChangeRole = async (userId: string, newRole: string) => {
        if (
            !window.confirm(
                `Bạn có chắc muốn chuyển người này sang Role: ${newRole}?`,
            )
        )
            return;

        setUpdatingId(userId);
        try {
            const res = await adminApi.changeUserRole(userId, newRole);
            if (res.success) {
                setUsers((prev) =>
                    prev.map((u) =>
                        u.id === userId ? { ...u, role: newRole } : u,
                    ),
                );
                alert("Phân quyền thành công!");
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert("Lỗi phân quyền!");
        } finally {
            setUpdatingId(null);
        }
    };

    // Filter tìm kiếm theo tên hoặc email
    const filteredUsers = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-800">
                        Quản Lý Người Dùng
                    </h1>
                </div>

                {/* Thanh tìm kiếm */}
                <div className="relative w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm tên hoặc email..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm uppercase">
                            <th className="p-4 font-semibold">Người dùng</th>
                            <th className="p-4 font-semibold">Quyền hạn</th>
                            <th className="p-4 font-semibold">Ngày tham gia</th>
                            <th className="p-4 font-semibold">Trạng thái</th>
                            <th className="p-4 font-semibold text-center">
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
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                    Đang tải dữ liệu người dùng...
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold mr-3 uppercase">
                                                {user.name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <Mail className="w-3 h-3 mr-1" />{" "}
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <select
                                            className="text-sm border border-gray-200 rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            value={user.role}
                                            disabled={updatingId === user.id}
                                            onChange={(e) =>
                                                handleChangeRole(
                                                    user.id,
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="User">User</option>
                                            <option value="Owner">Owner</option>
                                            <option value="Hotel">Hotel</option>
                                            <option value="Tour">Tour</option>
                                            <option value="Admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center italic">
                                            <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-50" />
                                            {new Date(
                                                user.createdAt,
                                            ).toLocaleDateString("vi-VN")}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        {user.isActive ? (
                                            <span className="px-2.5 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full border border-green-100">
                                                Hoạt động
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full border border-red-100">
                                                Đã khóa
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() =>
                                                    handleToggleStatus(user.id)
                                                }
                                                disabled={
                                                    updatingId === user.id
                                                }
                                                className={`flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                                    user.isActive
                                                        ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200"
                                                        : "bg-green-50 text-green-600 hover:bg-green-600 hover:text-white border border-green-200"
                                                }`}
                                            >
                                                {updatingId === user.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : user.isActive ? (
                                                    <>
                                                        <Lock className="w-4 h-4 mr-1.5" />{" "}
                                                        Khóa
                                                    </>
                                                ) : (
                                                    <>
                                                        <Unlock className="w-4 h-4 mr-1.5" />{" "}
                                                        Mở khóa
                                                    </>
                                                )}
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
    );
}
