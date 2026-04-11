import { profileApi } from "@/app/api/profileApi";
import { useState, useEffect } from "react";

export function FormAddDeparture({
    tourId,
    initialDepartures = [],
}: {
    tourId: number;
    initialDepartures?: any[];
}) {
    const [items, setItems] = useState<any[]>([]);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialDepartures?.length > 0) {
            // Lưu ý: data C# trả về ngày tháng có chữ 'T', cần cắt ra để đút vào <input type="datetime-local">
            setItems(
                initialDepartures.map((r: any) => ({
                    ...r,
                    startDate: r.startDate?.substring(0, 16),
                    isNew: false,
                    isModified: false,
                })),
            );
        }
    }, [initialDepartures]);

    const handleAddRow = () => {
        setItems([
            ...items,
            {
                id: `temp_${Date.now()}`,
                startDate: "",
                totalSeats: 45,
                isNew: true,
            },
        ]);
    };

    const handleInputChange = (id: any, field: string, value: any) => {
        setItems((prev) =>
            prev.map((r) =>
                r.id === id
                    ? { ...r, [field]: value, isModified: !r.isNew }
                    : r,
            ),
        );
    };

    const handleRemoveRow = (id: any, isNew: boolean) => {
        if (!isNew && typeof id === "number")
            setDeletedIds((prev) => [...prev, id]);
        setItems((prev) => prev.filter((r) => r.id !== id));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            if (deletedIds.length > 0)
                await Promise.all(
                    deletedIds.map((id) => profileApi.deleteDeparture(id)),
                );

            const toInsert = items.filter((r) => r.isNew);
            const toUpdate = items.filter((r) => !r.isNew && r.isModified);

            if (items.some((r) => !r.startDate))
                return alert("❌ Có chuyến đi chưa chọn Ngày khởi hành!");

            if (toInsert.length > 0)
                await Promise.all(
                    toInsert.map((r) => profileApi.addDeparture(tourId, r)),
                );
            if (toUpdate.length > 0)
                await Promise.all(
                    toUpdate.map((r) => profileApi.updateDeparture(r.id, r)),
                );

            alert("✅ LƯU NGÀY KHỞI HÀNH THÀNH CÔNG!");
            setDeletedIds([]);
            setItems((prev) =>
                prev.map((r) => ({ ...r, isNew: false, isModified: false })),
            );
        } catch (error) {
            alert("❌ Lỗi lưu Ngày khởi hành!");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        "w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm focus:border-amber-500 outline-none";

    return (
        <div className="bg-amber-50/50 p-4 rounded-3xl border border-amber-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-amber-800 uppercase tracking-tight">
                    🛫 Ngày Khởi Hành
                </h3>
                <button
                    type="button"
                    onClick={handleAddRow}
                    className="px-3 py-1.5 bg-white text-amber-600 font-bold rounded-lg border border-amber-200 shadow-sm text-sm"
                >
                    ➕ Thêm
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <table className="w-full text-left min-w-[400px]">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 uppercase">
                        <tr>
                            <th className="p-3 w-[55%]">Ngày giờ khởi hành</th>
                            <th className="p-3 w-[30%] text-center">
                                Tổng số ghế
                            </th>
                            <th className="p-3 w-[15%]"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                        {items.map((r) => (
                            <tr
                                key={r.id}
                                className={r.isNew ? "bg-yellow-50/30" : ""}
                            >
                                <td className="p-2">
                                    <input
                                        type="datetime-local"
                                        className={inputClass}
                                        value={r.startDate}
                                        onChange={(e) =>
                                            handleInputChange(
                                                r.id,
                                                "startDate",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        type="number"
                                        className={`${inputClass} text-center`}
                                        value={r.totalSeats}
                                        onChange={(e) =>
                                            handleInputChange(
                                                r.id,
                                                "totalSeats",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveRow(r.id, r.isNew)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {(items.some((r) => r.isNew || r.isModified) ||
                deletedIds.length > 0) && (
                <button
                    type="button"
                    onClick={handleSaveAll}
                    disabled={isSaving}
                    className="mt-2 py-3 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 w-full disabled:opacity-50"
                >
                    {isSaving ? "⏳ ĐANG LƯU..." : "💾 LƯU CÁC CHUYẾN ĐI"}
                </button>
            )}
        </div>
    );
}
