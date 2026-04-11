"use client";
import React, { useState, useEffect } from "react";
import { profileApi } from "@/app/api/profileApi";
import dynamic from "next/dynamic";
import { FormUploadImage } from "./FormUploadImage";
import { FormAddItinerary } from "./FormAddItinerary";
import { FormAddDeparture } from "./FormAddDeparture";

const MapPicker = dynamic(() => import("@/components/layouts/MapPicker"), {
    ssr: false,
});

export default function FormInsertTour({
    onClose,
    initialData,
}: {
    onClose: () => void;
    initialData?: any;
}) {
    const [createdTourId, setCreatedTourId] = useState<number | null>(null);
    const [areas, setAreas] = useState<any[]>([]);
    const [focusPos, setFocusPos] = useState<{
        lat: number;
        lng: number;
    } | null>(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        title: "",
        durationDays: 1,
        numberOfPeople: 1,
        departureLocationName: "",
        departureLatitude: 0,
        departureLongitude: 0,
        vehicle: "Ô tô",
        tourType: "Ghép đoàn",
        tourist_Area_Id: 0,
        price: 0,
    });

    useEffect(() => {
        profileApi
            .getAllTouristAreas()
            .then((res) => setAreas(res?.data || []));

        if (initialData) {
            setForm({
                ...initialData,
                departureLatitude: Number(initialData.departureLatitude),
                departureLongitude: Number(initialData.departureLongitude),
                price: initialData.price ? Number(initialData.price) : 0,
            });
            setCreatedTourId(initialData.id);
        }
    }, [initialData]);

    const handleAreaChange = (areaId: number) => {
        setForm({ ...form, tourist_Area_Id: areaId });
        const area = areas.find((a) => a.id === areaId);
        if (area?.latitude)
            setFocusPos({ lat: area.latitude, lng: area.longitude });
    };

    const handleMapSelect = (lat: number, lng: number) => {
        setForm((prev) => ({
            ...prev,
            departureLatitude: lat,
            departureLongitude: lng,
        }));
    };

    const handleCreateTour = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.tourist_Area_Id)
            return alert("Sếp chưa chọn 'Khu Du Lịch' kìa!");

        try {
            if (initialData) {
                await profileApi.updateTour(initialData.id, form);
                alert("Cập nhật thành công!");
                onClose();
            } else {
                const res = await profileApi.createTour(form);
                if (res.success) {
                    setCreatedTourId(res.data?.id || res.data);
                } else {
                    alert("Lỗi từ API: " + res.message);
                }
            }
        } catch (error: any) {
            alert(
                "❌ Lỗi: " + (error.response?.data?.message || "Kiểm tra log!"),
            );
        }
    };

    // Class chuẩn hóa
    const inputClass =
        "w-full p-3.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 text-base font-medium placeholder-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all";
    const labelClass = "block text-sm font-bold text-zinc-800 mb-1.5";

    return (
        <div className="p-6 md:p-8 bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-zinc-200 scrollbar-hide relative">
            <h2 className="text-2xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">
                {initialData
                    ? "✏️ CẬP NHẬT THÔNG TIN TOUR"
                    : "🚩 ĐĂNG KÝ TOUR MỚI"}
            </h2>

            <form
                onSubmit={handleCreateTour}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* CỘT TRÁI: ĐIỀN THÔNG TIN */}
                <div className="flex flex-col gap-5">
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                        <label className={labelClass}>
                            1. Tour này thuộc Khu Vực nào? (*)
                        </label>
                        <select
                            required
                            className={inputClass}
                            value={form.tourist_Area_Id || ""}
                            onChange={(e) =>
                                handleAreaChange(Number(e.target.value))
                            }
                        >
                            <option value="">
                                -- Vui lòng chọn Khu Vực --
                            </option>
                            {areas.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Tên Tour (*)</label>
                        <input
                            required
                            className={inputClass}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="VD: Khám phá Vịnh Hạ Long 3N2Đ..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Phương tiện</label>
                            <input
                                className={inputClass}
                                value={form.vehicle}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        vehicle: e.target.value,
                                    })
                                }
                                placeholder="VD: Ô tô, Máy bay"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Loại Tour</label>
                            <select
                                className={inputClass}
                                value={form.tourType}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        tourType: e.target.value,
                                    })
                                }
                            >
                                <option value="Ghép đoàn">Ghép đoàn</option>
                                <option value="Riêng tư">Riêng tư</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className={labelClass}>Số ngày</label>
                            <input
                                type="number"
                                min={1}
                                className={inputClass}
                                value={form.durationDays}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        durationDays: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Số người</label>
                            <input
                                type="number"
                                min={1}
                                className={inputClass}
                                value={form.numberOfPeople}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        numberOfPeople: Number(e.target.value),
                                    })
                                }
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Giá (VNĐ)</label>
                            <input
                                type="number"
                                className={inputClass}
                                value={form.price || ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        price: Number(e.target.value),
                                    })
                                }
                                placeholder="500000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Mô tả Ngắn (Title)</label>
                        <input
                            className={inputClass}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            placeholder="Slogan hấp dẫn cho Tour..."
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: BẢN ĐỒ VÀ MÔ TẢ */}
                <div className="flex flex-col gap-5">
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 h-[250px] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className={`${labelClass} m-0`}>
                                📍 Nơi Xuất Phát
                            </label>
                            <input
                                className="w-1/2 p-2 border border-zinc-300 rounded-lg text-sm outline-none focus:border-sky-500"
                                placeholder="VD: Sân bay Nội Bài..."
                                value={form.departureLocationName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        departureLocationName: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200">
                            <MapPicker
                                initialPos={
                                    initialData && form.departureLatitude
                                        ? {
                                              lat: form.departureLatitude,
                                              lng: form.departureLongitude,
                                          }
                                        : undefined
                                }
                                focusPos={focusPos}
                                onLocationSelect={handleMapSelect}
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className={labelClass}>Chi tiết Tour</label>
                        <textarea
                            className={`${inputClass} resize-none flex-1 min-h-[150px]`}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Mô tả chi tiết chuyến đi, quy định, lưu ý..."
                        />
                    </div>
                </div>

                {/* NÚT LƯU */}
                <div className="lg:col-span-2 flex gap-4 pt-4 border-t border-zinc-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-1/3 p-3.5 bg-zinc-100 text-zinc-700 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        disabled={!initialData && createdTourId !== null}
                        className={`w-2/3 p-3.5 font-bold text-white rounded-xl transition-colors ${!initialData && createdTourId ? "bg-green-600" : "bg-sky-600 hover:bg-sky-700"}`}
                    >
                        {initialData
                            ? "Lưu Cập Nhật"
                            : createdTourId
                              ? "✅ Tour đã lưu"
                              : "Hoàn Tất Đăng Ký Tour"}
                    </button>
                </div>
            </form>

            {/* FORM THÊM CHỨC NĂNG CON ĐÃ ĐƯỢC XẾP DỌC */}
            {createdTourId && (
                <div className="mt-8 flex flex-col gap-6 border-t-2 border-dashed border-zinc-200 pt-8">
                    <FormUploadImage
                        entityType="tour"
                        entityId={createdTourId}
                        initialImages={initialData?.images || []}
                    />

                    {/* Sếp xem chỗ này nè, đổi thành flex-col để nó nằm dọc nhau, full width */}
                    <div className="flex flex-col gap-6">
                        <FormAddItinerary
                            tourId={createdTourId}
                            areaId={form.tourist_Area_Id}
                            initialItineraries={
                                initialData?.tour_Itinerarys ||
                                initialData?.itineraries ||
                                []
                            }
                        />

                        <FormAddDeparture
                            tourId={createdTourId}
                            initialDepartures={
                                initialData?.departures ||
                                initialData?.schedules ||
                                []
                            }
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
