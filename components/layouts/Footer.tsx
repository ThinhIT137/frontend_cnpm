"use client";

import { usePathname } from "next/navigation";

export const Footer = () => {
    const path = usePathname();

    if (path === "/login" || path === "/resetPassword") {
        return null;
    }

    return (
        <footer className="bg-gradient-to-b from-sky-100 via-blue-50 to-white text-zinc-700">
            <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
                {/* Brand */}
                <div>
                    <h2 className="text-xl font-bold text-sky-600 mb-3">
                        🌊 UTCTrek
                    </h2>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                        Khám phá những địa điểm du lịch tuyệt đẹp. Hành trình
                        của bạn bắt đầu từ đây ✈️
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-600 mb-3">
                        📞 Liên hệ
                    </h3>
                    <ul className="text-sm space-y-2">
                        <li>
                            📧 Email:{" "}
                            <span className="text-zinc-800 font-medium">
                                tranthinh130720052@gmail.com
                            </span>
                        </li>
                        <li>
                            📱 SĐT:{" "}
                            <span className="text-zinc-800 font-medium">
                                0376563985
                            </span>
                        </li>
                    </ul>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-lg font-semibold text-sky-600 mb-3">
                        🔗 Điều hướng
                    </h3>
                    <ul className="text-sm space-y-2">
                        <li className="hover:text-sky-600 cursor-pointer transition">
                            Trang chủ
                        </li>
                        <li className="hover:text-sky-600 cursor-pointer transition">
                            Khu du lịch
                        </li>
                        <li className="hover:text-sky-600 cursor-pointer transition">
                            Khách sạn
                        </li>
                        <li className="hover:text-sky-600 cursor-pointer transition">
                            Liên hệ
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-sky-200 text-center text-sm py-4 text-zinc-500">
                © {new Date().getFullYear()} UTCTrek 🌊 | Made with chill vibes
            </div>
        </footer>
    );
};
