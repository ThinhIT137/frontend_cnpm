"use client";

import React, { useState, useEffect } from "react";
import { profileApi } from "@/app/api/profileApi"; // Nhớ import đúng file API nha sếp
import { useLoading } from "@/context/LoadingContext";

export default function AccountUpgradeForm() {
    const [currentRole, setCurrentRole] = useState<string>("");
    const [selectedPackage, setSelectedPackage] = useState<string>("");
    const { setLoading } = useLoading();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const role = localStorage.getItem("role")?.toLowerCase() || "user";
            setCurrentRole(role);
        }
    }, []);

    // Đủ 5 loại Role cho sếp tha hồ Test/Demo
    const packages = [
        {
            id: "Hotel",
            title: "Chủ Khách Sạn",
            icon: "🏨",
            description:
                "Đăng ký và quản lý hệ thống phòng khách sạn, resort của riêng bạn.",
        },
        {
            id: "Tour",
            title: "Chủ Tour",
            icon: "🚌",
            description:
                "Tạo và điều hành các chuyến đi, lịch trình du lịch, ghép đoàn.",
        },
        {
            id: "owner",
            title: "Chủ Doanh Nghiệp",
            icon: "💼",
            description:
                "Quản lý toàn diện: Bao gồm cả hệ thống Khách sạn lẫn điều hành Tour.",
        },
    ];

    // XỬ LÝ CHUYỂN ROLE TRỰC TIẾP (BỎ QUA THANH TOÁN)
    const handleConfirmUpgrade = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPackage)
            return alert("Sếp phải chọn 1 quyền để chuyển chứ!");
        if (selectedPackage === currentRole)
            return alert("Sếp đang ở quyền này rồi mà!");

        if (
            !confirm(
                `Xác nhận chuyển tài khoản sang quyền: ${selectedPackage.toUpperCase()}?`,
            )
        )
            return;

        setLoading(true);
        try {
            // 🔴 GỌI API BACKEND ĐỂ UPDATE ROLE VÀO DATABASE
            const res = await profileApi.upgradeRole({ role: selectedPackage });

            if (res && res.success) {
                alert(
                    `🎉 Đã chuyển sang quyền ${selectedPackage.toUpperCase()} thành công!`,
                );

                // Cập nhật lại LocalStorage cho khớp
                localStorage.setItem("role", selectedPackage);
                setCurrentRole(selectedPackage);

                // Tải lại trang để Layout / Menu update theo Role mới
                window.location.reload();
            } else {
                alert("❌ Chuyển quyền thất bại: " + res.message);
            }
        } catch (error) {
            console.error(error);
            alert("❌ Có lỗi hệ thống xảy ra khi chuyển quyền!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-zinc-100 max-w-5xl mx-auto">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-black text-zinc-900 mb-2">
                    🛠️ Chuyển Đổi Quyền (Demo)
                </h2>
                <p className="text-zinc-500">
                    Quyền hiện tại của bạn đang là:{" "}
                    <span className="font-bold text-sky-600 uppercase">
                        {currentRole}
                    </span>
                </p>
            </div>

            <form
                onSubmit={handleConfirmUpgrade}
                className="flex flex-col gap-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {packages.map((pkg) => {
                        const isSelected = selectedPackage === pkg.id;
                        const isCurrent = currentRole === pkg.id;

                        return (
                            <div
                                key={pkg.id}
                                onClick={() =>
                                    !isCurrent && setSelectedPackage(pkg.id)
                                }
                                className={`relative flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all duration-200 ${
                                    isCurrent
                                        ? "border-zinc-200 bg-zinc-100 opacity-60 cursor-not-allowed" // Role đang dùng thì làm mờ
                                        : isSelected
                                          ? "border-sky-500 bg-sky-50 shadow-md transform scale-[1.02] cursor-pointer"
                                          : "border-zinc-200 hover:border-sky-300 hover:bg-zinc-50 cursor-pointer"
                                }`}
                            >
                                {isSelected && (
                                    <div className="absolute top-4 right-4 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        ✓
                                    </div>
                                )}
                                {isCurrent && (
                                    <div className="absolute top-4 right-4 text-xs font-bold text-zinc-500 bg-zinc-200 px-2 py-1 rounded-md">
                                        Đang dùng
                                    </div>
                                )}
                                <div className="text-5xl mb-4">{pkg.icon}</div>
                                <h3
                                    className={`text-xl font-bold mb-2 ${isSelected ? "text-sky-700" : "text-zinc-800"}`}
                                >
                                    {pkg.title}
                                </h3>
                                <p className="text-sm text-zinc-500 leading-relaxed mb-4">
                                    {pkg.description}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <button
                    type="submit"
                    disabled={
                        !selectedPackage || selectedPackage === currentRole
                    }
                    className="mt-6 w-full py-4 bg-zinc-900 text-white text-lg font-bold rounded-2xl hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-zinc-200"
                >
                    {selectedPackage
                        ? `XÁC NHẬN ĐỔI SANG: ${selectedPackage.toUpperCase()}`
                        : "VUI LÒNG CHỌN 1 QUYỀN ĐỂ ĐỔI"}
                </button>
            </form>
        </div>
    );
}
