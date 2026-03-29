"use client";

import { useAuthMessage } from "@/context/AuthMessageContext";
import { useEffect } from "react";

export const AuthBanner = () => {
    const { message, setMessage } = useAuthMessage();

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    if (!message) return null;

    const text =
        message === "login"
            ? "Bạn đã đăng nhập"
            : message === "logout"
              ? "Bạn đã đăng xuất"
              : "Bạn đã bị đăng xuất";

    const color =
        message === "login"
            ? "bg-green-500"
            : message === "logout"
              ? "bg-gray-500"
              : "bg-red-500";

    return (
        <div
            className={`absolute top-full right-0 flex items-center gap-3 ${color} text-base font-semibold px-6 py-3 rounded-xl shadow-xl border border-white/20 backdrop-blur-sm z-50 animate-slide-in-right min-w-[260px]`}
        >
            <span className="text-xl">
                {message === "login" ? "✔" : message === "logout" ? "ℹ" : "⚠"}
            </span>
            <span>{text}</span>
        </div>
    );
};
