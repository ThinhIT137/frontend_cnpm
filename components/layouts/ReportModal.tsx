"use client";

import { profileApi } from "@/app/api/profileApi";
import { useLoading } from "@/context/LoadingContext";
import React, { useState } from "react";
// import { api } from "@/app/api/api"; // Thay bằng file api thực tế của sếp

type ReportModalProps = {
    isOpen: boolean;
    onClose: () => void;
    entityId: number;
    entityType: string; // "hotel", "tour", "tourist_area", "tourist_place", "review"...
};

export default function ReportModal({
    isOpen,
    onClose,
    entityId,
    entityType,
}: ReportModalProps) {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setLoading } = useLoading();

    const reasonsList = [
        "Thông tin sai sự thật / Lừa đảo",
        "Nội dung phản cảm, không phù hợp",
        "Ngôn từ đả kích, xúc phạm",
        "Spam / Quảng cáo rác",
        "Lý do khác",
    ];

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!reason) return alert("Sếp phải chọn 1 lý do chứ!");

        setIsSubmitting(true);
        try {
            // Payload khớp chuẩn với C# Model Report của sếp
            const payload = {
                EntityType: entityType,
                EntityId: entityId,
                Reason: reason,
                Description: description,
            };

            const res = await profileApi.submitReport(payload);

            if (res && res.success) {
                alert("🚩 Đã gửi báo cáo thành công! Cảm ơn sếp đã đóng góp.");
                // Xóa form và đóng modal
                setReason("");
                setDescription("");
                onClose();
            } else {
                alert(res?.message || "❌ Lỗi khi gửi báo cáo!");
            }
            onClose();
        } catch (error) {
            alert("❌ Lỗi khi gửi báo cáo!");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-xl relative animate-fade-in">
                {/* Nút X đóng */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-zinc-100 hover:bg-red-100 text-zinc-500 hover:text-red-500 rounded-full font-bold transition-colors"
                >
                    ✕
                </button>

                <div className="flex items-center gap-3 mb-6 border-b border-zinc-100 pb-4">
                    <span className="text-3xl">🚨</span>
                    <div>
                        <h2 className="text-xl font-black text-zinc-800">
                            Báo cáo vi phạm
                        </h2>
                        <p className="text-xs text-zinc-500">
                            Giúp chúng tôi giữ môi trường trong sạch
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Chọn lý do */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">
                            Lý do báo cáo{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-red-200 outline-none text-sm text-zinc-700"
                        >
                            <option value="" disabled>
                                -- Chọn lý do --
                            </option>
                            {reasonsList.map((r, idx) => (
                                <option key={idx} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Chi tiết (Mô tả) */}
                    <div>
                        <label className="block text-sm font-bold text-zinc-700 mb-2">
                            Mô tả thêm (Tùy chọn)
                        </label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Cung cấp thêm thông tin để Admin dễ xử lý..."
                            className="w-full p-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-red-200 outline-none text-sm text-zinc-700 resize-none"
                        />
                    </div>

                    {/* Nút gửi */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !reason}
                        className="w-full py-3.5 bg-red-500 hover:bg-red-600 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? "⏳ ĐANG GỬI..." : "GỬI BÁO CÁO"}
                    </button>
                </form>
            </div>
        </div>
    );
}
