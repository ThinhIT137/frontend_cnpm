"use client";
import React, { useState, useEffect } from "react";
import { profileApi } from "@/app/api/profileApi";
import dynamic from "next/dynamic";
import { FormAddRoom } from "./FormAddRoom";
import { FormUploadImage } from "./FormUploadImage";
import { getDistanceFromLatLonInKm } from "@/hooks/getDistanceFromLatLonInKm";

const MapPicker = dynamic(() => import("@/components/layouts/MapPicker"), {
    ssr: false,
});

export default function FormInsertHotel({
    onClose,
    initialData,
}: {
    onClose: () => void;
    initialData?: any;
}) {
    const [createdHotelId, setCreatedHotelId] = useState<number | null>(null);
    const [areas, setAreas] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<number | "">("");
    const [focusPos, setFocusPos] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const [form, setForm] = useState({
        name: "",
        address: "",
        latitude: 0,
        longitude: 0,
        description: "",
        title: "",
        numberOfPeople: 1,
        tourist_Place_Id: 0,
        price: 0,
    });

    useEffect(() => {
        profileApi
            .getAllTouristAreas()
            .then((res) => setAreas(res?.data || []));
        profileApi
            .getAllTouristPlaces()
            .then((res) => setPlaces(res?.data || []));

        if (initialData) {
            setForm({
                ...initialData,
                latitude: Number(initialData.latitude),
                longitude: Number(initialData.longitude),
                price: initialData.price ? Number(initialData.price) : 0,
                tourist_Place_Id: initialData.tourist_Place_Id || 0,
            });
            setCreatedHotelId(initialData.id);
            setSelectedAreaId(initialData.tourist_Area_Id || ""); // Chọn sẵn Area nếu có Sửa
        }
    }, [initialData]);

    useEffect(() => {
        if (!selectedAreaId) {
            setPlaces([]);
            return;
        }
        profileApi.getAllTouristPlaces().then((res) => {
            const filtered = (res?.data || []).filter(
                (p: any) => p.tourist_Area_Id === selectedAreaId,
            );
            setPlaces(filtered);
        });
    }, [selectedAreaId]);

    const handleAreaChange = (areaId: number) => {
        setSelectedAreaId(areaId);
        const area = areas.find((a) => a.id === areaId);
        if (area?.latitude)
            setFocusPos({ lat: area.latitude, lng: area.longitude });
    };

    const handlePlaceChange = (placeId: number) => {
        setForm({ ...form, tourist_Place_Id: placeId });
        const place = places.find((p) => p.id === placeId);
        if (place?.latitude)
            setFocusPos({ lat: place.latitude, lng: place.longitude });
    };

    const handleMapSelect = (lat: number, lng: number) => {
        setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));

        // if (!selectedAreaId || !form.tourist_Place_Id) {
        let closestPlace: any = null; // <--- FIX LỖI TYPESCRIPT Ở ĐÂY NÈ SẾP
        let minDistance = 15;

        places.forEach((p) => {
            if (p.latitude && p.longitude) {
                const dist = getDistanceFromLatLonInKm(
                    lat,
                    lng,
                    p.latitude,
                    p.longitude,
                );
                if (dist < minDistance) {
                    minDistance = dist;
                    closestPlace = p;
                }
            }
        });

        if (closestPlace) {
            setSelectedAreaId(closestPlace.tourist_Area_Id);
            setForm((prev) => ({
                ...prev,
                tourist_Place_Id: closestPlace.id,
            }));
        }
        // }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // KIỂM TRA TRƯỚC KHI GỬI
        if (!form.tourist_Place_Id || form.tourist_Place_Id === 0) {
            return alert("Sếp chưa chọn 'Địa Điểm' bên cột trái kìa!");
        }
        if (!form.name.trim()) {
            return alert("Chưa nhập tên Khách sạn kìa sếp!");
        }

        try {
            console.log("ĐANG GỬI DATA LÊN:", form); // In data ra xem có đúng không

            if (initialData) {
                await profileApi.updateHotel(initialData.id, form);
                alert("Cập nhật thành công!");
                onClose();
            } else {
                const res = await profileApi.createHotel(form);
                if (res.success) {
                    setCreatedHotelId(res.data.id);
                } else {
                    // Nếu API C# trả về success = false
                    alert("Lỗi từ API: " + res.message);
                }
            }
        } catch (error: any) {
            console.error("CHI TIẾT LỖI TỪ SERVER:", error.response?.data);

            // Lấy cái tin nhắn lỗi mà C# ném ra (từ BadRequestException) để đọc cho dễ hiểu
            const errorMsg =
                error.response?.data?.message ||
                "Lỗi kết nối Server, vui lòng check log F12";
            alert("❌ Lỗi: " + errorMsg);
        }
    };

    // Class tái sử dụng cho các ô Input để đồng bộ
    const inputClass =
        "w-full p-3.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 text-base font-medium placeholder-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all";
    const labelClass = "block text-sm font-bold text-zinc-800 mb-1.5";

    return (
        <div className="p-6 md:p-8 bg-white rounded-3xl shadow-2xl max-w-5xl mx-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-zinc-200 scrollbar-hide relative">
            <h2 className="text-2xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">
                {initialData
                    ? "✏️ CẬP NHẬT KHÁCH SẠN"
                    : "🏨 ĐĂNG KÝ KHÁCH SẠN MỚI"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* CỘT TRÁI: ĐIỀN THÔNG TIN */}
                <div className="flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                        <div>
                            <label className={labelClass}>1. Khu Vực</label>
                            <select
                                className={inputClass}
                                value={selectedAreaId}
                                onChange={(e) =>
                                    handleAreaChange(Number(e.target.value))
                                }
                            >
                                <option value="">-- Khu Vực --</option>
                                {areas.map((a) => (
                                    <option key={a.id} value={a.id}>
                                        {a.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>
                                2. Địa Điểm (*)
                            </label>
                            <select
                                required
                                disabled={!selectedAreaId}
                                className={`${inputClass} disabled:opacity-50 disabled:bg-zinc-100`}
                                value={form.tourist_Place_Id || ""}
                                onChange={(e) =>
                                    handlePlaceChange(Number(e.target.value))
                                }
                            >
                                <option value="">-- Địa Điểm --</option>
                                {places
                                    .filter(
                                        (p) =>
                                            p.tourist_Area_Id ===
                                            selectedAreaId,
                                    )
                                    .map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Tên Khách Sạn (*)</label>
                        <input
                            required
                            className={inputClass}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="VD: Mường Thanh Luxury..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Địa chỉ cụ thể</label>
                            <input
                                className={inputClass}
                                value={form.address}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        address: e.target.value,
                                    })
                                }
                                placeholder="Số nhà, tên đường..."
                            />
                        </div>
                        <div>
                            <label className={labelClass}>
                                Giá khởi điểm (VNĐ)
                            </label>
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
                                placeholder="VD: 500000"
                            />
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Mô tả Khách sạn</label>
                        <textarea
                            rows={6}
                            className={`${inputClass} resize-none`}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Giới thiệu về tiện ích, view, dịch vụ..."
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: BẢN ĐỒ */}
                <div className="flex flex-col gap-4">
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 h-full flex flex-col gap-4">
                        <label
                            className={`${labelClass} flex items-center justify-between m-0`}
                        >
                            📍 Vị trí bản đồ
                            <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded font-semibold">
                                Click / GPS để ghim
                            </span>
                        </label>
                        <div className="flex-1">
                            <MapPicker
                                initialPos={
                                    initialData && form.latitude
                                        ? {
                                              lat: form.latitude,
                                              lng: form.longitude,
                                          }
                                        : undefined
                                }
                                focusPos={focusPos}
                                onLocationSelect={handleMapSelect}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">
                                    Vĩ độ (Lat)
                                </label>
                                <input
                                    readOnly
                                    className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 font-mono text-sm outline-none"
                                    value={form.latitude}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">
                                    Kinh độ (Lng)
                                </label>
                                <input
                                    readOnly
                                    className="w-full p-2.5 bg-white border border-zinc-300 rounded-lg text-zinc-900 font-mono text-sm outline-none"
                                    value={form.longitude}
                                />
                            </div>
                        </div>
                    </div>
                </div>

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
                        disabled={!initialData && createdHotelId !== null}
                        className={`w-2/3 p-3.5 font-bold text-white rounded-xl transition-colors ${!initialData && createdHotelId ? "bg-green-600" : "bg-sky-600 hover:bg-sky-700"}`}
                    >
                        {initialData
                            ? "Lưu Cập Nhật"
                            : createdHotelId
                              ? "✅ Khách sạn đã lưu"
                              : "Hoàn Tất Đăng Ký Khách Sạn"}
                    </button>
                </div>
            </form>

            {/* FORM THÊM PHÒNG TỰ ĐỘNG HIỆN RA KHI LƯU XONG KHÁCH SẠN (NẾU LÀ THÊM MỚI) */}
            {createdHotelId && (
                <div className="mt-8 flex flex-col gap-8 border-t-2 border-dashed border-zinc-200 pt-8">
                    <FormUploadImage
                        entityType="hotel"
                        entityId={createdHotelId}
                        initialImages={initialData?.images || []}
                    />
                    <FormAddRoom
                        hotelId={createdHotelId}
                        initialRooms={initialData?.rooms || []}
                    />
                </div>
            )}
        </div>
    );
}
