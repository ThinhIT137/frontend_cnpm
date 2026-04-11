"use client";

import { profileApi } from "@/app/api/profileApi";
import React, { useState } from "react";

const ContributeComments = () => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    // Quản lý trạng thái
    const [isLoading, setIsLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Tránh user bấm spam 2 lần
        if (isLoading) return;

        if (!subject.trim() || !message.trim()) {
            setStatusMsg({
                type: "error",
                text: "Vui lòng nhập đầy đủ Chủ đề và Nội dung nhé!",
            });
            return;
        }

        setIsLoading(true);
        setStatusMsg(null);

        try {
            const res = await profileApi.submitFeedback({ subject, message });

            if (res.success) {
                setStatusMsg({ type: "success", text: res.message });
                // Reset form sau khi gửi thành công
                setSubject("");
                setMessage("");
            } else {
                setStatusMsg({ type: "error", text: res.message });
            }
        } catch (error: any) {
            // Bắt lỗi từ server (ví dụ 401 Unauthorized, 400 BadRequest)
            const errorMsg =
                error.response?.data?.message ||
                "Lỗi kết nối máy chủ. Vui lòng thử lại sau!";
            setStatusMsg({ type: "error", text: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-3xl shadow-sm border border-zinc-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-sky-700 mb-2">
                    💡 Góp ý & Phản hồi
                </h2>
                <p className="text-zinc-500 text-sm">
                    Mọi ý kiến đóng góp của bạn đều giúp UTCTrek phát triển tốt
                    hơn. Đừng ngại chia sẻ nhé!
                </p>
            </div>

            {/* Vùng hiển thị thông báo Lỗi / Thành công */}
            {statusMsg && (
                <div
                    className={`p-4 mb-6 rounded-xl text-sm font-medium ${
                        statusMsg.type === "success"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                    }`}
                >
                    {statusMsg.type === "success" ? "🎉 " : "⚠️ "}
                    {statusMsg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Input Chủ đề */}
                <div>
                    <label
                        htmlFor="subject"
                        className="block text-sm font-semibold text-zinc-700 mb-1.5"
                    >
                        Chủ đề <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Ví dụ: Báo lỗi thanh toán, Góp ý giao diện..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all text-zinc-800 placeholder:text-zinc-400"
                        disabled={isLoading}
                    />
                </div>

                {/* Textarea Nội dung */}
                <div>
                    <label
                        htmlFor="message"
                        className="block text-sm font-semibold text-zinc-700 mb-1.5"
                    >
                        Nội dung chi tiết{" "}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hãy mô tả chi tiết vấn đề hoặc ý tưởng của bạn..."
                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-all text-zinc-800 placeholder:text-zinc-400 resize-none"
                        disabled={isLoading}
                    ></textarea>
                </div>

                {/* Nút Submit */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-8 py-3 rounded-xl font-semibold text-white transition-all flex items-center gap-2
                            ${
                                isLoading
                                    ? "bg-sky-400 cursor-not-allowed"
                                    : "bg-sky-600 hover:bg-sky-700 active:scale-95 shadow-md shadow-sky-200"
                            }`}
                    >
                        {isLoading ? (
                            <>
                                {/* Icon xoay tròn (Spinner) khi đang loading */}
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Đang gửi...
                            </>
                        ) : (
                            <>
                                <span>Gửi phản hồi</span> 🚀
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ContributeComments;
