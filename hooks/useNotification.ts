"use client";
import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { api } from "@/app/api/api"; // Chỏ đúng file Axios của sếp nhé

export const useNotification = (isAuth: boolean) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<any[]>([]);

    // 1. Lấy thông báo cũ từ Database khi vừa load trang
    useEffect(() => {
        if (!isAuth) return;

        const fetchOldNotifications = async () => {
            try {
                const res = await api.get("/Notification");
                if (res.data.success) {
                    setNotifications(res.data.data);
                    setUnreadCount(res.data.unreadCount);
                }
            } catch (error) {
                console.error("Lỗi lấy thông báo:", error);
            }
        };

        fetchOldNotifications();
    }, [isAuth]);

    // 2. Cắm SignalR nghe thông báo mới (Real-time)
    useEffect(() => {
        if (!isAuth) return;

        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7016/hubs/notification", {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        connection
            .start()
            .then(() => {
                console.log("✅ SignalR Connected");

                connection.on("ReceiveNotification", (notif) => {
                    console.log("🔔 New Notification:", notif);

                    // Thêm thông báo mới lên đầu mảng
                    setNotifications((prev) => [notif, ...prev]);
                    // Tăng số đếm chưa đọc lên 1
                    setUnreadCount((prev) => prev + 1);

                    // Phát âm thanh Ting ting
                    new Audio("/sounds/notification.mp3")
                        .play()
                        .catch(() => {});
                });
            })
            .catch((err) => console.error("❌ SignalR Error:", err));

        return () => {
            connection.stop();
        };
    }, [isAuth]);

    return { notifications, unreadCount, setUnreadCount };
};
