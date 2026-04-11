import React, { useState, useMemo } from "react";

type Departure = {
    id: number;
    startDate: string;
    totalSeats: number;
    availableSeats: number;
    bookedSeats: string[]; // Mảng ghế đã đặt từ Backend (VD: ["1A", "1B"])
    status: string;
};

export function BookingTourForm({
    tourId,
    tourName,
    basePrice,
    departures,
    onClose,
}: {
    tourId: number;
    tourName: string;
    basePrice: number;
    departures: Departure[];
    onClose: () => void;
}) {
    const [bookingType, setBookingType] = useState<
        "Ghép Đoàn" | "Bao Nguyên Chuyến"
    >("Ghép Đoàn");
    const [selectedDepId, setSelectedDepId] = useState<number>(
        departures[0]?.id || 0,
    );
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

    // Form thông tin
    const [contact, setContact] = useState({
        name: "",
        phone: "",
        address: "",
        note: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const currentDep = useMemo(
        () => departures.find((d) => d.id === selectedDepId),
        [selectedDepId, departures],
    );

    // Tạo sơ đồ ghế giả lập (Ví dụ Xe 45 chỗ: 1A->11D)
    const seatMap = useMemo(() => {
        if (!currentDep) return [];
        const rows = Math.ceil(currentDep.totalSeats / 4);
        const map = [];
        for (let r = 1; r <= rows; r++) {
            map.push([`${r}A`, `${r}B`, `${r}C`, `${r}D`]); // 4 ghế 1 hàng
        }
        return map;
    }, [currentDep]);

    const toggleSeat = (seatCode: string, isBooked: boolean) => {
        if (bookingType === "Bao Nguyên Chuyến" || isBooked) return;
        setSelectedSeats((prev) =>
            prev.includes(seatCode)
                ? prev.filter((s) => s !== seatCode)
                : [...prev, seatCode],
        );
    };

    const totalPrice = useMemo(() => {
        if (bookingType === "Bao Nguyên Chuyến") {
            // Mặc định bao chuyến tính tiền full ghế
            return (currentDep?.totalSeats || 0) * basePrice * 0.9; // Giảm giá 10% nếu bao xe
        }
        return selectedSeats.length * basePrice;
    }, [bookingType, selectedSeats, currentDep, basePrice]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentDep) return alert("Chưa có lịch khởi hành!");
        if (bookingType === "Ghép Đoàn" && selectedSeats.length === 0)
            return alert("Vui lòng chọn ít nhất 1 chỗ ngồi!");

        setIsSubmitting(true);
        try {
            // Gom payload gửi Backend Booking
            const payload = {
                bookingType: "Tour",
                contactName: contact.name,
                contactPhone: contact.phone,
                note: `Đón tại: ${contact.address}. Ghi chú: ${contact.note}`,
                totalAmount: totalPrice,
                details:
                    bookingType === "Bao Nguyên Chuyến"
                        ? [
                              {
                                  tourDepartureId: currentDep.id,
                                  isPrivateTour: true,
                                  unitPrice: totalPrice,
                              },
                          ]
                        : selectedSeats.map((seat) => ({
                              tourDepartureId: currentDep.id,
                              seatNumber: seat,
                              isPrivateTour: false,
                              unitPrice: basePrice,
                          })),
            };
            console.log("Đang gửi booking Tour:", payload);
            alert("🎉 Đặt Tour thành công!");
            onClose();
        } catch (error) {
            alert("❌ Có lỗi xảy ra!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-3xl shadow-xl max-w-4xl w-full mx-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
                <div>
                    <h2 className="text-2xl font-black text-sky-900">
                        🚌 Đặt vé Tour / Chuyến đi
                    </h2>
                    <p className="text-sm font-bold text-zinc-500 mt-1">
                        {tourName}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-zinc-100 hover:bg-red-100 text-zinc-500 hover:text-red-500 rounded-full font-bold w-10 h-10 flex items-center justify-center"
                >
                    ✕
                </button>
            </div>

            {/* TAB CHỌN CHẾ ĐỘ */}
            <div className="flex p-1 bg-zinc-100 rounded-xl w-fit">
                {(["Ghép Đoàn", "Bao Nguyên Chuyến"] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setBookingType(type);
                            setSelectedSeats([]);
                        }}
                        className={`px-6 py-2.5 font-bold text-sm rounded-lg transition-all ${bookingType === type ? "bg-white text-sky-700 shadow-sm" : "text-zinc-500 hover:text-zinc-800"}`}
                    >
                        {type === "Ghép Đoàn"
                            ? "🙋‍♂️ Đi ghép (Chọn ghế)"
                            : "🚐 Bao nguyên xe (Private)"}
                    </button>
                ))}
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* CỘT TRÁI: SƠ ĐỒ GHẾ VÀ LỊCH TRÌNH */}
                <div className="flex-[3] flex flex-col gap-4">
                    <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100">
                        <label className="block text-sm font-bold text-sky-900 mb-2">
                            🗓️ Chọn ngày khởi hành:
                        </label>
                        <select
                            value={selectedDepId}
                            onChange={(e) => {
                                setSelectedDepId(Number(e.target.value));
                                setSelectedSeats([]);
                            }}
                            className="w-full text-black p-3 rounded-xl font-medium border-none outline-none focus:ring-2 focus:ring-sky-300"
                        >
                            <option value="">Chọn ngày khởi hành</option>
                            {departures.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {new Date(d.startDate).toLocaleDateString(
                                        "vi-VN",
                                    )}{" "}
                                    - Trống: {d.availableSeats}/{d.totalSeats}{" "}
                                    ghế
                                </option>
                            ))}
                        </select>
                    </div>

                    {bookingType === "Ghép Đoàn" && currentDep && (
                        <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                            <h3 className="font-bold text-zinc-700 text-sm uppercase mb-3">
                                💺 Sơ đồ chỗ ngồi
                            </h3>
                            <div className="flex gap-4 text-xs font-semibold mb-4 justify-center">
                                <span className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-white border-2 border-sky-300 rounded"></div>{" "}
                                    Trống
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-sky-500 rounded"></div>{" "}
                                    Đang chọn
                                </span>
                                <span className="flex items-center gap-1">
                                    <div className="w-4 h-4 bg-zinc-300 rounded"></div>{" "}
                                    Đã đặt
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 items-center bg-white p-4 rounded-xl max-h-[300px] overflow-y-auto">
                                <div className="w-full text-center text-xs font-bold text-zinc-400 mb-2 border-b pb-2">
                                    ĐẦU XE (TÀI XẾ)
                                </div>
                                {seatMap.map((row, rIdx) => (
                                    <div key={rIdx} className="flex gap-6">
                                        <div className="flex gap-2">
                                            {row.slice(0, 2).map((seat) => {
                                                const isBooked =
                                                    currentDep.bookedSeats.includes(
                                                        seat,
                                                    );
                                                const isSelected =
                                                    selectedSeats.includes(
                                                        seat,
                                                    );
                                                return (
                                                    <button
                                                        key={seat}
                                                        onClick={() =>
                                                            toggleSeat(
                                                                seat,
                                                                isBooked,
                                                            )
                                                        }
                                                        className={`w-10 h-10 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${isBooked ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : isSelected ? "bg-sky-500 text-white shadow-md transform scale-110" : "bg-white border-2 border-sky-100 hover:border-sky-400 text-zinc-600"}`}
                                                    >
                                                        {seat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="w-4"></div>{" "}
                                        {/* Đường đi ở giữa xe */}
                                        <div className="flex gap-2">
                                            {row.slice(2, 4).map((seat) => {
                                                const isBooked =
                                                    currentDep.bookedSeats.includes(
                                                        seat,
                                                    );
                                                const isSelected =
                                                    selectedSeats.includes(
                                                        seat,
                                                    );
                                                return (
                                                    <button
                                                        key={seat}
                                                        onClick={() =>
                                                            toggleSeat(
                                                                seat,
                                                                isBooked,
                                                            )
                                                        }
                                                        className={`w-10 h-10 rounded-lg font-bold text-xs flex items-center justify-center transition-all ${isBooked ? "bg-zinc-200 text-zinc-400 cursor-not-allowed" : isSelected ? "bg-sky-500 text-white shadow-md transform scale-110" : "bg-white border-2 border-sky-100 hover:border-sky-400 text-zinc-600"}`}
                                                    >
                                                        {seat}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {bookingType === "Bao Nguyên Chuyến" && (
                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 text-center flex flex-col gap-2 h-full justify-center">
                            <span className="text-4xl">🚐✨</span>
                            <h3 className="font-black text-amber-700 uppercase">
                                Chế độ Private Tour
                            </h3>
                            <p className="text-sm font-medium text-amber-600">
                                Bạn đang đặt toàn bộ {currentDep?.totalSeats}{" "}
                                chỗ ngồi cho chuyến đi này. Lịch trình sẽ được
                                hỗ trợ thiết kế riêng nếu có nhu cầu.
                            </p>
                        </div>
                    )}
                </div>

                {/* CỘT PHẢI: FORM & THANH TOÁN */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-[2] flex flex-col gap-4"
                >
                    <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 flex flex-col gap-3">
                        <h3 className="font-bold text-sky-900 text-sm uppercase">
                            📝 Thông tin liên lạc & Đón trả
                        </h3>
                        <input
                            required
                            value={contact.name}
                            onChange={(e) =>
                                setContact({ ...contact, name: e.target.value })
                            }
                            placeholder="Họ và tên người đặt"
                            className="w-full p-3 rounded-xl border text-black border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium"
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
                            placeholder="Số điện thoại"
                            className="w-full p-3 rounded-xl border text-black border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium"
                        />
                        <input
                            required
                            value={contact.address}
                            onChange={(e) =>
                                setContact({
                                    ...contact,
                                    address: e.target.value,
                                })
                            }
                            placeholder="Địa chỉ muốn xe đón (Khách sạn/Sân bay)"
                            className="w-full p-3 rounded-xl border text-black border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium"
                        />
                        <textarea
                            rows={2}
                            value={contact.note}
                            onChange={(e) =>
                                setContact({ ...contact, note: e.target.value })
                            }
                            placeholder="Yêu cầu đặc biệt..."
                            className="w-full p-3 rounded-xl border text-black border-white focus:ring-2 focus:ring-sky-300 outline-none text-sm font-medium resize-none"
                        />
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex justify-between items-end border-b pb-2">
                            <span className="text-sm font-bold text-zinc-500">
                                {bookingType === "Ghép Đoàn"
                                    ? "Ghế đã chọn:"
                                    : "Quy mô đoàn:"}
                            </span>
                            <span className="font-black text-zinc-800 text-right">
                                {bookingType === "Ghép Đoàn"
                                    ? selectedSeats.length > 0
                                        ? selectedSeats.join(", ")
                                        : "0 ghế"
                                    : `Full xe (${currentDep?.totalSeats} chỗ)`}
                            </span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-zinc-500">
                                Tổng tiền:
                            </span>
                            <div className="flex flex-col items-end">
                                {bookingType === "Bao Nguyên Chuyến" && (
                                    <span className="text-xs text-red-500 line-through font-bold">
                                        {(
                                            (currentDep?.totalSeats || 0) *
                                            basePrice
                                        ).toLocaleString()}{" "}
                                        VNĐ
                                    </span>
                                )}
                                <span className="text-2xl font-black text-sky-600">
                                    {totalPrice.toLocaleString()} VNĐ
                                </span>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                (bookingType === "Ghép Đoàn" &&
                                    selectedSeats.length === 0)
                            }
                            className="w-full mt-4 py-4 bg-sky-600 text-white font-black text-lg rounded-xl hover:bg-sky-700 transition-all disabled:opacity-50"
                        >
                            {isSubmitting
                                ? "⏳ ĐANG XỬ LÝ..."
                                : "XÁC NHẬN ĐẶT TOUR"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
