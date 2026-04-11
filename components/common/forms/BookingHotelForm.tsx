"use client";

import React, { useState, useMemo } from "react";
// Nhớ check lại dòng import api này xem đúng đường dẫn của sếp chưa nha
import { profileApi } from "@/app/api/profileApi";

type Room = {
    id: number;
    roomName: string;
    floor: number;
    roomType: string;
    price: number;
    status: string;
};

// DÙNG NAMED EXPORT (Có chữ export ở đầu)
export function BookingHotelForm({
    hotelId,
    hotelName,
    rooms = [], // Cho array rỗng mặc định lỡ rooms bị undefined
    onClose,
}: {
    hotelId: number;
    hotelName: string;
    rooms: Room[];
    onClose: () => void;
}) {
    const [selectedRooms, setSelectedRooms] = useState<number[]>([]);
    const [contact, setContact] = useState({ name: "", phone: "", note: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Gom nhóm phòng theo từng tầng để hiển thị cho đẹp
    const groupedRooms = useMemo(() => {
        const groups: { [floor: number]: Room[] } = {};
        if (rooms && rooms.length > 0) {
            rooms.forEach((r) => {
                if (!groups[r.floor]) groups[r.floor] = [];
                groups[r.floor].push(r);
            });
        }
        return groups;
    }, [rooms]);

    const toggleRoom = (roomId: number, status: string) => {
        if (status !== "Available") return; // Không cho click phòng đã đặt
        setSelectedRooms((prev) =>
            prev.includes(roomId)
                ? prev.filter((id) => id !== roomId)
                : [...prev, roomId],
        );
    };

    const totalPrice = useMemo(() => {
        return selectedRooms.reduce((sum, roomId) => {
            const room = rooms.find((r) => r.id === roomId);
            return sum + (room?.price || 0);
        }, 0);
    }, [selectedRooms, rooms]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRooms.length === 0)
            return alert("Sếp chưa chọn phòng nào kìa!");

        setIsSubmitting(true);
        try {
            // Chuẩn bị payload khớp với DTO backend (Sếp cần tự viết API createBooking bên Backend sau nha)
            const payload = {
                bookingType: "Hotel",
                contactName: contact.name,
                contactPhone: contact.phone,
                note: contact.note,
                totalAmount: totalPrice,
                details: selectedRooms.map((roomId) => ({
                    hotelRoomId: roomId,
                    unitPrice: rooms.find((r) => r.id === roomId)?.price || 0,
                })),
            };

            console.log("Đang gửi booking Khách Sạn:", payload);
            // await profileApi.createBooking(payload); // Khi nào có API thì mở comment dòng này
            alert("🎉 Đặt phòng thành công!");
            onClose();
        } catch (error) {
            alert("❌ Lỗi đặt phòng!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl max-w-3xl w-full mx-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4 border-zinc-100">
                <div>
                    <h2 className="text-2xl font-black text-sky-900">
                        🏨 Đặt phòng Khách sạn
                    </h2>
                    <p className="text-sm font-bold text-zinc-500 mt-1">
                        {hotelName}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="p-2 bg-zinc-100 hover:bg-red-100 text-zinc-500 hover:text-red-500 rounded-full font-bold w-10 h-10 flex items-center justify-center transition-colors"
                >
                    ✕
                </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* CỘT TRÁI: SƠ ĐỒ PHÒNG THEO TẦNG */}
                <div className="flex-[3] flex flex-col gap-4 bg-zinc-50 p-4 rounded-2xl border border-zinc-200 h-fit max-h-[500px] overflow-y-auto scrollbar-hide">
                    <h3 className="font-bold text-zinc-700 text-sm uppercase">
                        🔑 Chọn phòng theo tầng
                    </h3>
                    <div className="flex gap-4 text-xs text-black font-semibold mb-2">
                        <span className="flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 text-black bg-white border-2 border-sky-300 rounded-sm"></div>{" "}
                            Trống
                        </span>
                        <span className="flex items-center text-black gap-1.5">
                            <div className="w-3.5 h-3.5 text-black bg-sky-500 border-2 border-sky-300 rounded-sm"></div>{" "}
                            Đang chọn
                        </span>
                        <span className="flex items-center text-black gap-1.5">
                            <div className="w-3.5 h-3.5 text-black bg-zinc-300 border-2 border-zinc-300 rounded-sm"></div>{" "}
                            Đã đặt
                        </span>
                    </div>

                    {Object.keys(groupedRooms).length === 0 ? (
                        <p className="text-center text-zinc-400 text-sm py-4 italic">
                            Khách sạn chưa cập nhật danh sách phòng.
                        </p>
                    ) : (
                        Object.keys(groupedRooms)
                            .sort((a, b) => Number(b) - Number(a))
                            .map((floor) => (
                                <div
                                    key={floor}
                                    className="flex flex-col gap-2"
                                >
                                    <span className="text-xs font-bold text-zinc-400">
                                        Tầng {floor}
                                    </span>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {groupedRooms[Number(floor)].map(
                                            (room) => {
                                                const isSelected =
                                                    selectedRooms.includes(
                                                        room.id,
                                                    );
                                                const isAvailable =
                                                    room.status === "Available";
                                                return (
                                                    <button
                                                        key={room.id}
                                                        type="button"
                                                        onClick={() =>
                                                            toggleRoom(
                                                                room.id,
                                                                room.status,
                                                            )
                                                        }
                                                        className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                                                            !isAvailable
                                                                ? "bg-zinc-200 border-zinc-300 cursor-not-allowed opacity-60"
                                                                : isSelected
                                                                  ? "bg-sky-100 border-sky-500 text-sky-700 shadow-md"
                                                                  : "bg-white border-sky-200 hover:border-sky-400 text-zinc-700"
                                                        }`}
                                                    >
                                                        <span className="font-black">
                                                            {room.roomName}
                                                        </span>
                                                        <span className="text-[10px] font-semibold truncate w-full text-center">
                                                            {room.roomType}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-sky-600">
                                                            {(
                                                                room.price /
                                                                1000
                                                            ).toFixed(0)}
                                                            k
                                                        </span>
                                                    </button>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* CỘT PHẢI: THÔNG TIN ĐẶT CHỖ */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-[2] flex flex-col gap-4"
                >
                    <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                        <h3 className="font-bold text-sky-900 text-sm uppercase mb-3">
                            📝 Thông tin liên hệ
                        </h3>
                        <div className="flex flex-col gap-3">
                            <input
                                required
                                value={contact.name}
                                onChange={(e) =>
                                    setContact({
                                        ...contact,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Họ và tên người nhận phòng"
                                className="w-full p-3 rounded-xl text-black border border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium"
                            />
                            <input
                                required
                                value={contact.phone}
                                onChange={(e) =>
                                    setContact({
                                        ...contact,
                                        phone: e.target.value,
                                    })
                                }
                                placeholder="Số điện thoại liên hệ"
                                className="w-full p-3 rounded-xl text-black border border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium"
                            />
                            <textarea
                                rows={3}
                                value={contact.note}
                                onChange={(e) =>
                                    setContact({
                                        ...contact,
                                        note: e.target.value,
                                    })
                                }
                                placeholder="Ghi chú thêm (VD: Cần thêm giường phụ...)"
                                className="w-full p-3 rounded-xl text-black border border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium resize-none"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-end border-b border-zinc-100 pb-2">
                            <span className="text-sm font-bold text-zinc-500">
                                Đã chọn:
                            </span>
                            <span className="font-black text-zinc-800">
                                {selectedRooms.length} phòng
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-zinc-500">
                                Tổng tiền:
                            </span>
                            <span className="text-2xl font-black text-sky-600">
                                {totalPrice.toLocaleString()} VNĐ
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={
                                isSubmitting || selectedRooms.length === 0
                            }
                            className="w-full mt-4 py-4 bg-sky-600 text-white font-black text-lg rounded-xl hover:bg-sky-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting
                                ? "⏳ ĐANG XỬ LÝ..."
                                : "ÁP DỤNG ĐẶT PHÒNG"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
