"use client";
import React, { useState, useEffect } from "react";
import { profileApi } from "@/app/api/profileApi";
import dynamic from "next/dynamic";
import { FormUploadImage } from "./FormUploadImage";
import { getDistanceFromLatLonInKm } from "@/hooks/getDistanceFromLatLonInKm";

const MapPicker = dynamic(() => import("@/components/layouts/MapPicker"), {
    ssr: false,
});

export default function FormInsertMarker({
    onClose,
    initialData,
}: {
    onClose: () => void;
    initialData?: any;
}) {
    const [createdMarkerId, setCreatedMarkerId] = useState<number | null>(null);
    const [areas, setAreas] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [selectedAreaId, setSelectedAreaId] = useState<number | "">("");
    const [focusPos, setFocusPos] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        latitude: 0,
        longitude: 0,
        isPublic: true,
        tourist_Place_Id: 0,
    });

    useEffect(() => {
        // Load danh sách trước để tí nữa dò GPS
        const fetchDropdowns = async () => {
            const resAreas = await profileApi.getAllTouristAreas();
            const resPlaces = await profileApi.getAllTouristPlaces();

            const areasData = resAreas?.data || [];
            const placesData = resPlaces?.data || [];

            setAreas(areasData);
            setPlaces(placesData);

            // NẾU CÓ TRUYỀN TỌA ĐỘ TỪ BÊN NGOÀI VÀO (Lúc Double Click Map)
            if (initialData) {
                let defaultPlaceId = initialData.tourist_Place_Id || 0;
                let defaultAreaId: number | "" = "";

                // 🔴 THỰC HIỆN AUTO-SCAN ĐỊA ĐIỂM NGAY LÚC MỞ FORM
                if (
                    !defaultPlaceId &&
                    initialData.latitude &&
                    initialData.longitude &&
                    placesData.length > 0
                ) {
                    let closestPlace: any = null;
                    let minDistance = 15; // 15km

                    placesData.forEach((p: any) => {
                        if (p.latitude && p.longitude) {
                            const dist = getDistanceFromLatLonInKm(
                                initialData.latitude,
                                initialData.longitude,
                                p.latitude,
                                p.longitude,
                            );
                            if (dist < minDistance) {
                                minDistance = dist;
                                closestPlace = p;
                            }
                        }
                    });

                    // Nếu dò ra thì gán luôn
                    if (closestPlace) {
                        defaultPlaceId = closestPlace.id;
                        defaultAreaId = closestPlace.tourist_Area_Id;
                    }
                }

                // Nếu có data sửa (Edit) thì set Area luôn
                if (initialData.id && defaultPlaceId) {
                    const matchedPlace = placesData.find(
                        (p: any) => p.id === defaultPlaceId,
                    );
                    if (matchedPlace)
                        defaultAreaId = matchedPlace.tourist_Area_Id;
                }

                setSelectedAreaId(defaultAreaId);
                setForm({
                    title: initialData.title || "",
                    description: initialData.description || "",
                    latitude: Number(initialData.latitude) || 0,
                    longitude: Number(initialData.longitude) || 0,
                    isPublic: initialData.isPublic ?? true,
                    tourist_Place_Id: defaultPlaceId,
                });

                if (initialData.id) setCreatedMarkerId(initialData.id);
            }
        };

        fetchDropdowns();
    }, [initialData]);

    const handleAreaChange = (areaId: number) => {
        setSelectedAreaId(areaId);
        setForm((prev) => ({ ...prev, tourist_Place_Id: 0 })); // Đổi Khu vực thì Xóa Địa điểm đã chọn

        const selectedArea = areas.find((a) => a.id === areaId);
        if (selectedArea?.latitude) {
            setFocusPos({
                lat: selectedArea.latitude,
                lng: selectedArea.longitude,
            });
        }
    };

    const handlePlaceChange = (placeId: number) => {
        setForm((prev) => ({ ...prev, tourist_Place_Id: placeId }));
        const selectedPlace = places.find((p) => p.id === placeId);
        if (selectedPlace?.latitude) {
            setFocusPos({
                lat: selectedPlace.latitude,
                lng: selectedPlace.longitude,
            });
        }
    };

    // ========================================================
    // LOGIC AUTO-SELECT KHI DÒ GPS HOẶC CLICK MAP
    // ========================================================
    const handleMapSelect = (lat: number, lng: number) => {
        setForm((prev) => ({ ...prev, latitude: lat, longitude: lng }));

        // Chỉ tự động suy luận nếu KHƯA CHỌN KHU VỰC và KHÔNG CHỌN ĐỊA ĐIỂM
        // if (!selectedAreaId || !form.tourist_Place_Id) {
        let closestPlace: any = null;
        let minDistance = 15; // Giới hạn tìm kiếm trong bán kính 15km

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

        // Nếu quét ra một Địa Điểm (< 15km)
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
        if (
            !initialData &&
            (!form.tourist_Place_Id || form.tourist_Place_Id === 0)
        ) {
            return alert("Sếp chưa chọn 'Địa Điểm' bên cột trái kìa!");
        }
        if (!form.title.trim()) {
            return alert("Chưa nhập Tên vị trí (Marker) kìa sếp!");
        }

        try {
            if (initialData) {
                await profileApi.updateMarker(initialData.id, form);
                alert("Cập nhật Marker thành công!");
                onClose();
            } else {
                const res = await profileApi.createMarker(form);
                if (res.success) {
                    setCreatedMarkerId(res.data?.id || res.data); // Lụm ID để hiện Form Ảnh
                } else {
                    alert("Lỗi từ API: " + res.message);
                }
            }
        } catch (error: any) {
            console.error("LỖI TỪ SERVER:", error.response?.data);
            const errorMsg =
                error.response?.data?.message ||
                "Lỗi kết nối Server, check F12 nha Sếp!";
            alert("❌ Lỗi: " + errorMsg);
        }
    };

    const inputClass =
        "w-full p-3.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 text-base font-medium placeholder-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all";
    const labelClass = "block text-sm font-bold text-zinc-800 mb-1.5";

    return (
        <div className="p-6 md:p-8 bg-white rounded-3xl shadow-2xl max-w-6xl mx-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-zinc-200 scrollbar-hide relative">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                <h2 className="text-2xl font-bold text-zinc-900">
                    {initialData
                        ? "✏️ SỬA VỊ TRÍ ĐÃ GHIM"
                        : "📍 GHIM VỊ TRÍ MỚI"}
                </h2>
                <label className="flex items-center gap-3 p-2 bg-sky-50 rounded-xl cursor-pointer border border-sky-200 hover:bg-sky-100 transition-colors">
                    <input
                        type="checkbox"
                        checked={form.isPublic}
                        onChange={(e) =>
                            setForm({ ...form, isPublic: e.target.checked })
                        }
                        className="w-5 h-5 accent-sky-600 rounded cursor-pointer"
                    />
                    <span className="text-sky-800 font-bold text-sm">
                        Công khai vị trí
                    </span>
                </label>
            </div>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* CỘT TRÁI: NHẬP LIỆU */}
                <div className="flex flex-col gap-5">
                    {!initialData && (
                        <div className="grid grid-cols-2 gap-4 bg-sky-50 p-5 rounded-2xl border border-sky-100">
                            <div>
                                <label className="block text-sm font-bold text-sky-900 mb-1">
                                    1. Khu Du Lịch
                                </label>
                                <select
                                    className="w-full p-3 border text-black border-sky-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-sky-400"
                                    value={selectedAreaId}
                                    onChange={(e) =>
                                        handleAreaChange(Number(e.target.value))
                                    }
                                >
                                    <option value="">-- Khu vực --</option>
                                    {areas.map((a) => (
                                        <option key={a.id} value={a.id}>
                                            {a.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-sky-900 mb-1">
                                    2. Địa Điểm (*)
                                </label>
                                <select
                                    required
                                    disabled={!selectedAreaId}
                                    className="w-full p-3 border  text-black border-sky-200 rounded-xl font-medium outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
                                    value={form.tourist_Place_Id || ""}
                                    onChange={(e) =>
                                        handlePlaceChange(
                                            Number(e.target.value),
                                        )
                                    }
                                >
                                    <option value="">-- Địa điểm --</option>
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
                    )}

                    <div>
                        <label className={labelClass}>
                            Tên/Tiêu đề vị trí (*)
                        </label>
                        <input
                            required
                            className={inputClass}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            placeholder="VD: Góc check-in siêu đẹp hoang sơ..."
                        />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className={labelClass}>
                            Mô tả / Đánh giá chi tiết
                        </label>
                        <textarea
                            rows={6}
                            className={`${inputClass} resize-none flex-1`}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Cảnh ở đây đẹp tuyệt vời, đi vào buổi chiều tà là best..."
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: BẢN ĐỒ */}
                <div className="flex flex-col gap-5">
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 h-[350px] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className={`${labelClass} m-0`}>
                                📍 Chấm vị trí Bản Đồ
                            </label>
                            <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded font-semibold">
                                Click Map / Bật GPS
                            </span>
                        </div>

                        <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200 relative z-0">
                            {/* Component MapPicker Gọi Hàm Select Cập Nhật form.lat/lng VÀ Gọi Luôn Auto Select Dropdown */}
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

                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">
                                    Vĩ độ (Lat)
                                </label>
                                <input
                                    readOnly
                                    className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 font-mono text-xs outline-none text-center"
                                    value={form.latitude}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">
                                    Kinh độ (Lng)
                                </label>
                                <input
                                    readOnly
                                    className="w-full p-2 bg-white border border-zinc-300 rounded-lg text-zinc-900 font-mono text-xs outline-none text-center"
                                    value={form.longitude}
                                />
                            </div>
                        </div>
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
                        disabled={!initialData && createdMarkerId !== null}
                        className={`w-2/3 p-3.5 font-bold text-white rounded-xl transition-colors ${createdMarkerId !== null ? "bg-green-600" : "bg-sky-600 hover:bg-sky-700"}`}
                    >
                        {initialData
                            ? "Lưu Cập Nhật"
                            : createdMarkerId !== null
                              ? "✅ Đã lưu Vị trí (Kéo xuống Up ảnh nhé)"
                              : "Lưu Vị Trí Lên Bản Đồ"}
                    </button>
                </div>
            </form>

            {/* FORM UPLOAD ẢNH (Tự rớt xuống khi có ID) */}
            {createdMarkerId && (
                <div className="mt-8 flex flex-col gap-6 border-t-2 border-dashed border-zinc-200 pt-8">
                    <FormUploadImage
                        entityType="marker"
                        entityId={createdMarkerId}
                        initialImages={initialData?.images || []}
                    />
                </div>
            )}
        </div>
    );
}
