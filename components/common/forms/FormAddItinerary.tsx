import { profileApi } from "@/app/api/profileApi";
import { useState, useEffect } from "react";

export function FormAddItinerary({
    tourId,
    areaId,
    initialItineraries = [],
}: {
    tourId: number;
    areaId: number;
    initialItineraries?: any[];
}) {
    const [items, setItems] = useState<any[]>([]);
    const [deletedIds, setDeletedIds] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [places, setPlaces] = useState<any[]>([]); // Danh sách địa điểm để chọn

    useEffect(() => {
        // Lấy danh sách địa điểm thuộc Khu du lịch này để nhét vào Select
        profileApi.getAllTouristPlaces().then((res) => {
            const filtered = (res?.data || []).filter(
                (p: any) => p.tourist_Area_Id === areaId,
            );
            setPlaces(filtered);
        });

        if (initialItineraries?.length > 0) {
            setItems(
                initialItineraries.map((r: any) => ({
                    ...r,
                    isNew: false,
                    isModified: false,
                })),
            );
        }
    }, [initialItineraries, areaId]);

    const handleAddRow = () => {
        setItems([
            ...items,
            {
                id: `temp_${Date.now()}`,
                title: "",
                description: "",
                dayNumber: 1,
                tourist_Place_Id: 0,
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
                    deletedIds.map((id) => profileApi.deleteItinerary(id)),
                );

            const toInsert = items.filter((r) => r.isNew);
            const toUpdate = items.filter((r) => !r.isNew && r.isModified);

            if (items.some((r) => !r.title.trim()))
                return alert("❌ Có lịch trình chưa nhập Tiêu đề!");

            if (toInsert.length > 0)
                await Promise.all(
                    toInsert.map((r) => profileApi.addItinerary(tourId, r)),
                );
            if (toUpdate.length > 0)
                await Promise.all(
                    toUpdate.map((r) => profileApi.updateItinerary(r.id, r)),
                );

            alert("✅ LƯU LỊCH TRÌNH THÀNH CÔNG!");
            setDeletedIds([]);
            setItems((prev) =>
                prev.map((r) => ({ ...r, isNew: false, isModified: false })),
            );
        } catch (error) {
            alert("❌ Lỗi lưu lịch trình!");
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass =
        "w-full p-2 bg-white border border-zinc-200 rounded-lg text-sm focus:border-sky-500 outline-none";

    return (
        <div className="bg-sky-50/50 p-4 rounded-3xl border border-sky-100 flex flex-col gap-4">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-sky-800 uppercase tracking-tight">
                    🗺️ Lịch trình (Ngày)
                </h3>
                <button
                    type="button"
                    onClick={handleAddRow}
                    className="px-3 py-1.5 bg-white text-sky-600 font-bold rounded-lg border border-sky-200 shadow-sm text-sm"
                >
                    ➕ Thêm
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-2xl border border-zinc-200 shadow-sm">
                <table className="w-full text-left min-w-[500px]">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-xs text-zinc-500 uppercase">
                        <tr>
                            <th className="p-3 w-16 text-center">Ngày</th>
                            <th className="p-3">Hoạt động (Tiêu đề)</th>
                            <th className="p-3 w-1/3">Địa Điểm ghé qua</th>
                            <th className="p-3 w-10"></th>
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
                                        type="number"
                                        className={`${inputClass} text-center`}
                                        value={r.dayNumber}
                                        onChange={(e) =>
                                            handleInputChange(
                                                r.id,
                                                "dayNumber",
                                                Number(e.target.value),
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <input
                                        className={inputClass}
                                        value={r.title}
                                        placeholder="VD: Khám phá Hang Sơn Đoòng"
                                        onChange={(e) =>
                                            handleInputChange(
                                                r.id,
                                                "title",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </td>
                                <td className="p-2">
                                    <select
                                        className={inputClass}
                                        value={r.tourist_Place_Id || ""}
                                        onChange={(e) =>
                                            handleInputChange(
                                                r.id,
                                                "tourist_Place_Id",
                                                Number(e.target.value),
                                            )
                                        }
                                    >
                                        <option value="">
                                            -- Chọn Địa Điểm --
                                        </option>
                                        {places.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
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
                    className="mt-2 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 w-full disabled:opacity-50"
                >
                    {isSaving ? "⏳ ĐANG LƯU..." : "💾 LƯU LỊCH TRÌNH"}
                </button>
            )}
        </div>
    );
}
