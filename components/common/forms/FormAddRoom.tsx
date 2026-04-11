import { profileApi } from "@/app/api/profileApi";
import { useState, useEffect } from "react";

export function FormAddRoom({
    hotelId,
    initialRooms = [],
}: {
    hotelId: number;
    initialRooms?: any[];
}) {
    // State lưu toàn bộ phòng (cả cũ lẫn mới)
    const [rooms, setRooms] = useState<any[]>([]);
    // State lưu ID những phòng cũ bị bấm xóa
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialRooms && initialRooms.length > 0) {
            // Đánh dấu ảnh cũ không phải là isNew
            setRooms(
                initialRooms.map((r) => ({
                    ...r,
                    isNew: false,
                    isModified: false,
                })),
            );
        }
    }, [initialRooms]);

    // Thêm 1 dòng trống (Input)
    const handleAddNewRow = () => {
        setRooms([
            ...rooms,
            {
                id: `temp_${Date.now()}`, // ID tạm thời để React nhận diện map()
                roomName: "",
                floor: 1,
                roomType: "Standard",
                price: 0,
                isNew: true, // Cờ báo hiệu đây là phòng mới cần gọi API POST
            },
        ]);
    };

    // Xử lý khi gõ vào Input
    const handleInputChange = (id: any, field: string, value: any) => {
        setRooms((prev) =>
            prev.map((r) => {
                if (r.id === id) {
                    return {
                        ...r,
                        [field]: value,
                        isModified: !r.isNew, // Nếu là phòng cũ thì bật cờ isModified để lát gọi API PUT
                    };
                }
                return r;
            }),
        );
    };

    // Bấm xóa phòng
    const handleRemoveRow = (id: any, isNew: boolean) => {
        if (!isNew && typeof id === "number") {
            // Nếu là phòng cũ có trong DB thì nhét vào sổ tử thần chờ Xóa
            setDeletedIds((prev) => [...prev, id]);
        }
        // Xóa khỏi giao diện
        setRooms((prev) => prev.filter((r) => r.id !== id));
    };

    // CHỐT SỔ: XỬ LÝ LƯU / SỬA / XÓA CÙNG LÚC
    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            // 1. CHÉM NHỮNG PHÒNG BỊ XÓA
            if (deletedIds.length > 0) {
                const deletePromises = deletedIds.map((id) =>
                    profileApi.deleteHotelRoom(id),
                );
                await Promise.all(deletePromises);
            }

            // 2. TÁCH RA LÀM 2 NHÓM: THÊM MỚI VÀ CẬP NHẬT
            const roomsToInsert = rooms.filter((r) => r.isNew);
            const roomsToUpdate = rooms.filter((r) => !r.isNew && r.isModified);

            // Kiểm tra Validate (Đừng để tên phòng trống)
            if (rooms.some((r) => !r.roomName.trim())) {
                alert("❌ Có phòng chưa nhập tên kìa sếp ơi!");
                setIsSaving(false);
                return;
            }

            // Gọi API Thêm Mới
            if (roomsToInsert.length > 0) {
                const insertPromises = roomsToInsert.map((r) =>
                    profileApi.addHotelRoom(hotelId, {
                        roomName: r.roomName,
                        floor: r.floor,
                        roomType: r.roomType,
                        price: r.price,
                    }),
                );
                await Promise.all(insertPromises);
            }

            // Gọi API Cập Nhật
            if (roomsToUpdate.length > 0) {
                const updatePromises = roomsToUpdate.map((r) =>
                    profileApi.updateHotelRoom(r.id, {
                        roomName: r.roomName,
                        floor: r.floor,
                        roomType: r.roomType,
                        price: r.price,
                    }),
                );
                await Promise.all(updatePromises);
            }

            alert("✅ LƯU TOÀN BỘ PHÒNG THÀNH CÔNG!");
            setDeletedIds([]); // Reset sổ tử thần

            // Cập nhật lại UI bỏ cờ báo hiệu đi
            setRooms((prev) =>
                prev.map((r) => ({ ...r, isNew: false, isModified: false })),
            );
        } catch (error) {
            console.error(error);
            alert("❌ Lỗi cmnr sếp ơi! F12 coi log nha.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        "w-full p-2.5 bg-white border border-zinc-200 rounded-lg text-zinc-900 font-semibold focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all";

    return (
        <div className="bg-sky-50/80 p-4 sm:p-6 rounded-3xl border-2 border-sky-200 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h3 className="font-black text-sky-900 text-xl uppercase tracking-tight">
                        🛏️ Quản lý Danh sách Phòng
                    </h3>
                    <p className="text-xs text-sky-700 font-medium mt-1">
                        Sửa trực tiếp trên dòng. Xóa/Thêm gom 1 lần LƯU.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleAddNewRow}
                    className="px-5 py-2.5 bg-white text-sky-600 font-bold rounded-xl border border-sky-200 hover:bg-sky-100 transition-all shadow-sm flex items-center gap-2"
                >
                    ➕ Thêm Phòng Mới
                </button>
            </div>

            {/* BẢNG INLINE EDITING */}
            <div className="overflow-x-auto bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                        <tr>
                            <th className="p-4 w-[30%]">Tên Phòng (*)</th>
                            <th className="p-4 w-[15%] text-center">Tầng</th>
                            <th className="p-4 w-[25%]">Hạng Phòng</th>
                            <th className="p-4 w-[20%]">Giá / Đêm</th>
                            <th className="p-4 w-[10%] text-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {rooms.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="p-8 text-center text-zinc-500 font-medium"
                                >
                                    📭 Khách sạn này chưa có phòng nào. Bấm thêm
                                    phòng mới đi sếp!
                                </td>
                            </tr>
                        ) : (
                            rooms.map((r, i) => (
                                <tr
                                    key={r.id}
                                    className={`hover:bg-sky-50/30 transition-colors ${r.isNew ? "bg-yellow-50/30" : ""}`}
                                >
                                    <td className="p-3">
                                        <input
                                            className={`${inputClass} ${r.isNew ? "border-yellow-300" : ""}`}
                                            value={r.roomName}
                                            placeholder="VD: VIP 101"
                                            onChange={(e) =>
                                                handleInputChange(
                                                    r.id,
                                                    "roomName",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="p-3">
                                        <input
                                            type="number"
                                            className={`${inputClass} text-center`}
                                            value={r.floor}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    r.id,
                                                    "floor",
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </td>
                                    <td className="p-3">
                                        <select
                                            className={inputClass}
                                            value={r.roomType}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    r.id,
                                                    "roomType",
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="Standard">
                                                Standard
                                            </option>
                                            <option value="Deluxe">
                                                Deluxe
                                            </option>
                                            <option value="Suite">Suite</option>
                                        </select>
                                    </td>
                                    <td className="p-3 relative">
                                        <input
                                            type="number"
                                            className={`${inputClass} pr-10`}
                                            value={r.price}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    r.id,
                                                    "price",
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-bold">
                                            đ
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleRemoveRow(r.id, r.isNew)
                                            }
                                            className="w-8 h-8 inline-flex items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* NÚT CHỐT SỔ */}
            {(rooms.some((r) => r.isNew || r.isModified) ||
                deletedIds.length > 0) && (
                <div className="flex flex-col items-end gap-2 border-t border-sky-200 pt-4">
                    <p className="text-xs text-zinc-500 font-medium">
                        Bạn có thao tác chưa lưu (Sửa/Thêm:{" "}
                        {rooms.filter((r) => r.isNew || r.isModified).length},
                        Xóa: {deletedIds.length})
                    </p>
                    <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={isSaving}
                        className="px-8 py-3 sm:py-4 bg-sky-600 text-white font-black text-base sm:text-lg rounded-2xl hover:bg-sky-700 active:scale-95 transition-all shadow-lg shadow-sky-200 disabled:opacity-50"
                    >
                        {isSaving ? "⏳ ĐANG LƯU..." : "💾 LƯU TẤT CẢ PHÒNG"}
                    </button>
                </div>
            )}
        </div>
    );
}
