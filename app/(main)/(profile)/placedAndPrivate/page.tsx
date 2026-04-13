"use client";

import React, { useState, useEffect } from "react";
import { profileApi } from "@/app/api/profileApi";
import { supabase } from "@/libs/supabase";
import { avt, setUpload } from "@/constants/info";
import { useLoading } from "@/context/LoadingContext";
import AccountUpgradeForm from "@/components/common/forms/AccountUpgradeForm"; // 🔴 IMPORT FORM VÀO ĐÂY

export default function PlacedAndPrivatePage() {
    const { setLoading } = useLoading();
    // --- STATE CHO THÔNG TIN CÁ NHÂN ---
    const [name, setName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // --- STATE CHO ĐỔI MẬT KHẨU ---
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isChangingPass, setIsChangingPass] = useState(false);
    const [passMsg, setPassMsg] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // 🔴 STATE LƯU ROLE (Dùng để quyết định có hiện thẻ 3 hay không)
    const [currentRole, setCurrentRole] = useState("user");

    useEffect(() => {
        setLoading(true);
        const savedName = localStorage.getItem("name") || "";
        const savedAvt = localStorage.getItem("avt");
        const savedRole = localStorage.getItem("role")?.toLowerCase() || "user";

        if (savedName) setName(savedName);
        if (savedAvt) setAvatarUrl(savedAvt);
        setCurrentRole(savedRole);

        setLoading(false);
    }, []);

    // ==========================================
    // 1. XỬ LÝ UPLOAD ẢNH VÀ CẬP NHẬT PROFILE
    // ==========================================
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        setProfileMsg(null);

        try {
            setLoading(true);
            let finalAvatarUrl = avatarUrl;

            if (selectedFile) {
                const fileExt = selectedFile.name.split(".").pop();
                const fileName = `avt_${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from("avt_img")
                    .upload(fileName, selectedFile);

                if (uploadError)
                    throw new Error("Lỗi khi tải ảnh lên Supabase.");

                const { data } = supabase.storage
                    .from("avt_img")
                    .getPublicUrl(fileName);
                finalAvatarUrl = data.publicUrl;
            }

            const res = await profileApi.updateProfile({
                name: name.trim() ? name : undefined,
                avt: finalAvatarUrl,
            });

            if (res.success) {
                setProfileMsg({
                    type: "success",
                    text: "Cập nhật hồ sơ thành công!",
                });
                if (res.data?.avt) setAvatarUrl(res.data.avt);
                setSelectedFile(null);
                setUpload(name.trim() ? name : "", finalAvatarUrl);
            } else {
                setProfileMsg({ type: "error", text: res.message });
            }
        } catch (error: any) {
            setProfileMsg({
                type: "error",
                text: error.message || "Đã xảy ra lỗi khi cập nhật.",
            });
        } finally {
            setIsUpdatingProfile(false);
            setLoading(false);
        }
    };

    // ==========================================
    // 2. XỬ LÝ ĐỔI MẬT KHẨU
    // ==========================================
    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setPassMsg({
                type: "error",
                text: "Mật khẩu xác nhận không khớp!",
            });
            return;
        }

        setIsChangingPass(true);
        setPassMsg(null);

        try {
            setLoading(true);
            const res = await profileApi.changePassword({
                oldPassword,
                newPassword,
            });
            if (res.success) {
                setPassMsg({
                    type: "success",
                    text: "Đổi mật khẩu thành công! Hãy đăng nhập lại nếu cần.",
                });
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPassMsg({ type: "error", text: res.message });
            }
        } catch (error: any) {
            setPassMsg({
                type: "error",
                text:
                    error.response?.data?.message ||
                    "Đã xảy ra lỗi khi đổi mật khẩu.",
            });
        } finally {
            setIsChangingPass(false);
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
            {/* THẺ 1: CẬP NHẬT THÔNG TIN */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-100">
                <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h2 className="text-2xl font-bold text-zinc-800">
                        👤 Thông tin cá nhân
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Cập nhật tên hiển thị và ảnh đại diện của bạn.
                    </p>
                </div>

                {profileMsg && (
                    <div
                        className={`p-4 mb-6 rounded-xl text-sm font-medium ${profileMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
                    >
                        {profileMsg.text}
                    </div>
                )}

                <form
                    onSubmit={handleUpdateProfile}
                    className="flex flex-col md:flex-row gap-10"
                >
                    {/* Khu vực đổi Avatar */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-zinc-100">
                            <img
                                src={
                                    previewUrl ||
                                    avatarUrl ||
                                    "/Img/User_Icon.png"
                                }
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                id="avatarUpload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <label
                                htmlFor="avatarUpload"
                                className="cursor-pointer px-4 py-2 bg-sky-50 text-sky-600 font-semibold text-sm rounded-xl hover:bg-sky-100 transition-colors"
                            >
                                Đổi ảnh đại diện
                            </label>
                        </div>
                    </div>

                    {/* Khu vực đổi Tên */}
                    <div className="flex-1 flex flex-col gap-5 justify-center">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                                Tên hiển thị
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên của bạn"
                                className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-zinc-800"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={isUpdatingProfile}
                                className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex gap-2 items-center"
                            >
                                {isUpdatingProfile
                                    ? "Đang lưu..."
                                    : "💾 Lưu thay đổi"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* THẺ 2: ĐỔI MẬT KHẨU */}
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-100">
                <div className="mb-6 border-b border-zinc-100 pb-4">
                    <h2 className="text-2xl font-bold text-zinc-800">
                        🔐 Đổi mật khẩu
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Đảm bảo tài khoản của bạn đang sử dụng mật khẩu an toàn.
                    </p>
                </div>

                {passMsg && (
                    <div
                        className={`p-4 mb-6 rounded-xl text-sm font-medium ${passMsg.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}
                    >
                        {passMsg.text}
                    </div>
                )}

                <form
                    onSubmit={handleChangePassword}
                    className="space-y-5 max-w-lg"
                >
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                            Mật khẩu cũ
                        </label>
                        <input
                            type="password"
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-zinc-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-zinc-800"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-700 mb-1.5">
                            Xác nhận mật khẩu mới
                        </label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all text-zinc-800"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={isChangingPass}
                            className="px-6 py-3 bg-zinc-800 hover:bg-zinc-900 text-white font-semibold rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 flex gap-2 items-center"
                        >
                            {isChangingPass
                                ? "Đang xử lý..."
                                : "🛡️ Đổi mật khẩu"}
                        </button>
                    </div>
                </form>
            </div>

            {/* 🔴 THẺ 3: NÂNG CẤP TÀI KHOẢN (Chỉ hiện nếu chưa phải là owner hoặc admin) */}
            {currentRole !== "admin" && currentRole !== "owner" && (
                <div className="mt-8">
                    <AccountUpgradeForm />
                </div>
            )}
        </div>
    );
}
