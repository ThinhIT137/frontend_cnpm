"use client";
import React, { useState, useEffect } from "react";
import { profileApi } from "@/app/api/profileApi";
import dynamic from "next/dynamic";
import { FormUploadImage } from "./FormUploadImage";

const MapPicker = dynamic(() => import("@/components/layouts/MapPicker"), {
    ssr: false,
});

export default function FormInsertTouristArea({
    onClose,
    initialData,
}: {
    onClose: () => void;
    initialData?: any;
}) {
    const [createdAreaId, setCreatedAreaId] = useState<number | null>(null);
    const [focusPos, setFocusPos] = useState<{
        lat: number;
        lng: number;
    } | null>(null);

    const [form, setForm] = useState({
        name: "",
        title: "",
        address: "",
        description: "",
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        if (initialData) {
            setForm({
                ...initialData,
                latitude: Number(initialData.latitude) || 0,
                longitude: Number(initialData.longitude) || 0,
            });
            setCreatedAreaId(initialData.id);
        }
    }, [initialData]);

    const handleMapSelect = (lat: number, lng: number) => {
        setForm((prev) => ({
            ...prev,
            latitude: lat,
            longitude: lng,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (initialData) {
                await profileApi.updateTouristArea(initialData.id, form);
                alert("Cập nhật thành công!");
                onClose(); // Sửa thì đóng luôn
            } else {
                const res = await profileApi.createTouristArea(form);
                if (res.success) {
                    setCreatedAreaId(res.data?.id || res.data); // Hứng ID từ backend
                    // KHÔNG GỌI onClose() Ở ĐÂY ĐỂ NGƯỜI DÙNG CÒN KÉO XUỐNG UP ẢNH
                } else {
                    alert("Lỗi từ API: " + res.message);
                }
            }
        } catch (error: any) {
            alert(
                "❌ Lỗi xử lý: " +
                    (error.response?.data?.message || "Kiểm tra F12"),
            );
        }
    };

    // Class chuẩn hóa để UI đồng bộ sang xịn mịn
    const inputClass =
        "w-full p-3.5 bg-white border border-zinc-300 rounded-xl text-zinc-900 text-base font-medium placeholder-zinc-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all";
    const labelClass = "block text-sm font-bold text-zinc-800 mb-1.5";

    return (
        <div className="p-6 md:p-8 bg-white rounded-3xl shadow-2xl max-w-6xl mx-auto flex flex-col gap-6 max-h-[90vh] overflow-y-auto border border-zinc-200 scrollbar-hide relative">
            <h2 className="text-2xl font-bold text-zinc-900 border-b border-zinc-100 pb-4">
                {initialData
                    ? "✏️ CẬP NHẬT KHU DU LỊCH"
                    : "🏞️ ĐĂNG KÝ KHU DU LỊCH MỚI"}
            </h2>

            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {/* CỘT TRÁI: ĐIỀN THÔNG TIN */}
                <div className="flex flex-col gap-5">
                    <div>
                        <label className={labelClass}>
                            Tên Khu Du Lịch (*)
                        </label>
                        <input
                            required
                            className={inputClass}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder="VD: Quần thể Danh thắng Tràng An..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            Tiêu đề Ngắn (Slogan)
                        </label>
                        <input
                            className={inputClass}
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            placeholder="VD: Kỳ quan thiên nhiên thế giới..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Địa chỉ cụ thể</label>
                        <input
                            className={inputClass}
                            value={form.address}
                            onChange={(e) =>
                                setForm({ ...form, address: e.target.value })
                            }
                            placeholder="Thôn, xã, huyện, tỉnh..."
                        />
                    </div>

                    <div className="flex-1 flex flex-col">
                        <label className={labelClass}>Mô tả chi tiết</label>
                        <textarea
                            required
                            rows={8}
                            className={`${inputClass} resize-none flex-1`}
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Giới thiệu về vẻ đẹp, lịch sử, văn hóa..."
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: BẢN ĐỒ MAP */}
                <div className="flex flex-col gap-5">
                    <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 h-[350px] flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <label className={`${labelClass} m-0`}>
                                📍 Tọa độ Bản Đồ
                            </label>
                            <span className="text-xs text-sky-600 bg-sky-100 px-2 py-1 rounded font-semibold">
                                Click để ghim
                            </span>
                        </div>
                        <div className="flex-1 rounded-xl overflow-hidden border border-zinc-200">
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
                        disabled={!initialData && createdAreaId !== null}
                        className={`w-2/3 p-3.5 font-bold text-white rounded-xl transition-colors ${createdAreaId !== null ? "bg-green-600" : "bg-sky-600 hover:bg-sky-700"}`}
                    >
                        {initialData
                            ? "Lưu Cập Nhật"
                            : createdAreaId !== null
                              ? "✅ Đã lưu Khu du lịch"
                              : "Hoàn Tất Đăng Ký"}
                    </button>
                </div>
            </form>

            {/* FORM UPLOAD ẢNH (Tự rớt xuống khi có ID) */}
            {createdAreaId && (
                <div className="mt-8 flex flex-col gap-6 border-t-2 border-dashed border-zinc-200 pt-8">
                    <FormUploadImage
                        entityType="tourist_area"
                        entityId={createdAreaId}
                        initialImages={initialData?.images || []}
                    />
                </div>
            )}
        </div>
    );
}
