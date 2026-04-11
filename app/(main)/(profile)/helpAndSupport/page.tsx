"use client";

import { accessToken } from "@/constants/info";
import { Home } from "@/constants/router";
import { useNextRouter } from "@/hooks/useNextRouter";
import React, { useState } from "react";

// Dữ liệu Fake cho FAQ
const faqs = [
    {
        question: "Làm thế nào để đặt phòng khách sạn hoặc Tour?",
        answer: "Bạn chỉ cần tìm kiếm địa điểm mong muốn, chọn phòng/tour phù hợp, điền thông tin khách hàng và tiến hành thanh toán. Xác nhận sẽ được gửi qua email của bạn.",
    },
    {
        question: "Chính sách hoàn/hủy của UTCTrek như thế nào?",
        answer: "Chính sách hoàn hủy phụ thuộc vào từng khách sạn và nhà cung cấp Tour. Bạn có thể xem chi tiết ở phần 'Chính sách' trong trang chi tiết của mỗi dịch vụ trước khi đặt.",
    },
    {
        question: "Tôi có thể thay đổi ngày đi sau khi đã đặt không?",
        answer: "Có thể! Vui lòng liên hệ trực tiếp với bộ phận CSKH của chúng tôi qua Hotline hoặc Email ít nhất 48h trước ngày khởi hành để được hỗ trợ thay đổi (có thể phát sinh phụ phí).",
    },
    {
        question: "UTCTrek hỗ trợ những phương thức thanh toán nào?",
        answer: "Chúng tôi hỗ trợ thanh toán qua Thẻ tín dụng/Ghi nợ (Visa, Mastercard), Ví điện tử (Momo, VNPay) và Chuyển khoản ngân hàng nội địa.",
    },
];

export default function HelpAndSupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { go } = useNextRouter();

    if (!accessToken) go(Home);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleSubmitContact = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Cảm ơn bạn! Lời nhắn của bạn đã được gửi đến UTCTrek. 🌊");
    };

    return (
        <div className="min-h-screen bg-zinc-50 pb-20">
            {/* HERO SECTION */}
            <div className="bg-gradient-to-b from-sky-100 via-blue-50 to-zinc-50 pt-20 pb-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-black text-sky-700 mb-4 tracking-tight">
                        UTCTrek xin chào! 🌊
                    </h1>
                    <p className="text-lg text-zinc-600 mb-8">
                        Bạn cần hỗ trợ điều gì? Hãy để chúng tôi đồng hành cùng
                        chuyến đi của bạn ✈️
                    </p>

                    {/* Ô Search UI */}
                    <div className="relative max-w-2xl mx-auto">
                        <input
                            type="text"
                            placeholder="Nhập vấn đề bạn cần tìm hiểu (VD: Hoàn tiền, Đặt tour...)"
                            className="w-full px-6 py-4 rounded-2xl shadow-md border-0 focus:ring-4 focus:ring-sky-200 outline-none text-zinc-700 transition-shadow"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2 rounded-xl font-medium transition-colors">
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-6">
                {/* CONTACT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {/* Email Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                        <div className="w-14 h-14 bg-sky-100 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">
                            📧
                        </div>
                        <h3 className="font-bold text-zinc-800 text-lg mb-2">
                            Email Hỗ Trợ
                        </h3>
                        <p className="text-zinc-500 text-sm mb-4">
                            Gửi email cho chúng tôi để được giải quyết chi tiết.
                        </p>
                        <a
                            href="mailto:tranthinh130720052@gmail.com"
                            className="text-sky-600 font-semibold hover:text-sky-700 mt-auto"
                        >
                            tranthinh130720052@gmail.com
                        </a>
                    </div>

                    {/* Phone Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">
                            📞
                        </div>
                        <h3 className="font-bold text-zinc-800 text-lg mb-2">
                            Hotline 24/7
                        </h3>
                        <p className="text-zinc-500 text-sm mb-4">
                            Gọi ngay cho chúng tôi nếu bạn cần hỗ trợ khẩn cấp.
                        </p>
                        <a
                            href="tel:0376563985"
                            className="text-sky-600 font-semibold hover:text-sky-700 mt-auto"
                        >
                            0376563985
                        </a>
                    </div>

                    {/* Location Card */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center">
                        <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center text-2xl mb-4 shadow-sm">
                            📍
                        </div>
                        <h3 className="font-bold text-zinc-800 text-lg mb-2">
                            Văn Phòng
                        </h3>
                        <p className="text-zinc-500 text-sm mb-4">
                            Đến trực tiếp để uống trà và trò chuyện cùng
                            UTCTrek.
                        </p>
                        <span className="text-sky-600 font-semibold mt-auto">
                            UTC Campus, Hà Nội
                        </span>
                    </div>
                </div>

                {/* FAQ & CONTACT FORM SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                    {/* LEFT: FAQs Accordion */}
                    <div className="lg:col-span-3">
                        <h2 className="text-2xl font-bold text-zinc-800 mb-6">
                            🤔 Câu hỏi thường gặp
                        </h2>
                        <div className="flex flex-col gap-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className={`bg-white border transition-colors rounded-2xl overflow-hidden shadow-sm ${openFaq === index ? "border-sky-300" : "border-zinc-200"}`}
                                >
                                    <button
                                        onClick={() => toggleFaq(index)}
                                        className="w-full text-left px-6 py-4 flex justify-between items-center focus:outline-none"
                                    >
                                        <span
                                            className={`font-semibold text-lg ${openFaq === index ? "text-sky-700" : "text-zinc-700"}`}
                                        >
                                            {faq.question}
                                        </span>
                                        <span
                                            className={`text-xl transition-transform duration-300 ${openFaq === index ? "rotate-180 text-sky-600" : "text-zinc-400"}`}
                                        >
                                            ▼
                                        </span>
                                    </button>

                                    <div
                                        className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0"}`}
                                    >
                                        <p className="text-zinc-600 leading-relaxed pt-2 border-t border-zinc-100">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Quick Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-100">
                            <h2 className="text-xl font-bold text-zinc-800 mb-2">
                                Gửi tin nhắn cho chúng tôi
                            </h2>
                            <p className="text-sm text-zinc-500 mb-6">
                                Chúng tôi sẽ phản hồi lại bạn sớm nhất có thể.
                            </p>

                            <form
                                onSubmit={handleSubmitContact}
                                className="flex flex-col gap-4"
                            >
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                        Họ và tên
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                        Email / Số điện thoại
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="abc@gmail.com"
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-1">
                                        Lời nhắn
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        placeholder="Xin chào, tôi cần hỗ trợ về..."
                                        className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-200 transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3.5 rounded-xl shadow-md shadow-sky-200 transition-all active:scale-95 flex justify-center items-center gap-2"
                                >
                                    <span>Gửi yêu cầu</span> 🚀
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
