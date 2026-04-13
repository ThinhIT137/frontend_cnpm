"use client";

import { TouristPlaceDetail } from "@/constants/router"; // Cập nhật đúng đường dẫn nhé
import { useNextRouter } from "@/hooks/useNextRouter";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./component.scss";

type TouristPlaceProductProps = {
    id: number;
    url?: string;
    name: string;
    title: string;
    address?: string; // Bổ sung address cho Place
    rating_average: number;
    click_count?: number;
    favorite_count?: number;
    images?: any[];
    onViewMap: () => void;
};

export const TouristPlaceProduct = ({
    id,
    url,
    name,
    title,
    address,
    rating_average,
    click_count = 0,
    favorite_count = 0,
    images = [],
    onViewMap,
}: TouristPlaceProductProps) => {
    const { go } = useNextRouter();

    // Xử lý mảng ảnh cho Swiper
    const slideImages =
        images?.length > 0
            ? images.map((img) => img.url)
            : [url || "/Img/ImgNull.jpg"];

    return (
        <div
            onClick={() => go(TouristPlaceDetail(id))}
            className="group w-full bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer border border-gray-100 flex flex-col"
        >
            {/* --- IMAGE SLIDER --- */}
            <div
                className="relative w-full aspect-[4/3] overflow-hidden shrink-0 bg-gray-100"
                onClick={(e) => e.stopPropagation()} // Chặn click để không bị nhảy trang khi bấm nút Next/Prev của Slider
            >
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true, dynamicBullets: true }}
                    className="w-full h-full tourist-swiper"
                >
                    {slideImages.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={src}
                                    alt={`${name} - Ảnh ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* --- OVERLAYS --- */}
                {/* Lớp phủ đen nhẹ khi hover toàn thẻ */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10 pointer-events-none" />

                {/* Rating (Góc phải trên) */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-sm z-20 pointer-events-none">
                    <span className="text-yellow-400 text-sm leading-none">
                        ⭐
                    </span>
                    <span className="text-xs font-bold text-gray-800 leading-none mt-0.5">
                        {rating_average
                            ? Number(rating_average).toFixed(1)
                            : "5.0"}
                    </span>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2">
                    {/* Tên */}
                    <h3 className="text-gray-900 font-bold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {name}
                    </h3>

                    {/* Địa chỉ */}
                    <p className="text-xs text-gray-500 font-medium line-clamp-1 flex items-center gap-1">
                        <span className="text-red-400 text-sm">📍</span>
                        {address || "Đang cập nhật địa chỉ"}
                    </p>

                    {/* Title / Mô tả */}
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {title}
                    </p>

                    {/* Dàn Thống kê: Thích & Xem */}
                    {(favorite_count > 0 || click_count > 0) && (
                        <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-gray-500">
                            {favorite_count > 0 && (
                                <div className="flex items-center gap-1.5 bg-red-50/50 text-red-600 px-2.5 py-1 rounded-lg border border-red-100">
                                    <span>❤️</span> {favorite_count}
                                </div>
                            )}
                            {click_count > 0 && (
                                <div className="flex items-center gap-1.5 bg-blue-50/50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100">
                                    <span>🔥</span> {click_count} views
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- ACTIONS --- */}
                <div className="flex gap-2 pt-3 mt-auto border-t border-dashed border-gray-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMap();
                        }}
                        className="flex-1 text-sm py-2.5 rounded-xl bg-gray-50 text-gray-700 font-semibold hover:bg-gray-200 active:scale-95 transition border border-gray-100"
                    >
                        🗺️ Bản đồ
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            go(TouristPlaceDetail(id));
                        }}
                        className="flex-1 text-sm py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:scale-95 transition shadow-md shadow-blue-200"
                    >
                        Khám phá
                    </button>
                </div>
            </div>
        </div>
    );
};
