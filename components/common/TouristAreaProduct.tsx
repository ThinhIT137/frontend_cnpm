"use client";

import { TouristAreaDetail } from "@/constants/router";
import { useNextRouter } from "@/libs/hooks/useNextRouter";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./component.scss";

type TouristAreaProductProps = {
    id: number;
    coverImageUrl?: string;
    name: string;
    title: string;
    address: string;
    rating_average: number;
    click_count: number;
    favorite_count: number;
    images?: any[];
    onViewMap: () => void;
};

export const TouristAreaProduct = ({
    id,
    coverImageUrl,
    name,
    title,
    address,
    rating_average,
    click_count,
    favorite_count,
    images = [],
    onViewMap,
}: TouristAreaProductProps) => {
    const { go } = useNextRouter();

    const slideImages =
        images?.length > 0
            ? images.map((img) => img.url)
            : [coverImageUrl || "/Img/ImgNull.jpg"];

    return (
        <div
            onClick={() => go(TouristAreaDetail(id))}
            className="group w-full bg-white rounded-3xl overflow-hidden 
            shadow-md hover:shadow-2xl transition-all duration-300 
            hover:-translate-y-1 cursor-pointer border border-zinc-100 flex flex-col"
        >
            {/* IMAGE SLIDER */}
            <div
                className="relative w-full h-48 md:h-52 overflow-hidden shrink-0"
                onClick={(e) => e.stopPropagation()}
            >
                <Swiper
                    modules={[Navigation, Pagination]}
                    navigation
                    pagination={{ clickable: true, dynamicBullets: true }}
                    className="w-full h-full"
                >
                    {slideImages.map((src, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={src}
                                    alt={`${name} - Ảnh ${index + 1}`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* --- CÁC LỚP OVERLAY BÊN TRÊN (Phải có z-10 và pointer-events-none) --- */}

                {/* Overlay gradient tối dần xuống dưới */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10 pointer-events-none" />

                {/* Rating (Góc trái trên) */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-bold text-zinc-800 shadow z-10 pointer-events-none">
                    <span className="text-yellow-500 mr-1">⭐</span>
                    {rating_average ? rating_average.toFixed(1) : "5.0"}
                </div>

                {/* Name Overlay (Góc trái dưới) */}
                <div className="absolute bottom-6 left-3 right-3 z-10 pointer-events-none">
                    <h3 className="text-white font-bold text-lg line-clamp-1 drop-shadow-md">
                        {name}
                    </h3>
                </div>
            </div>

            {/* CONTENT BÊN DƯỚI */}
            <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                <div className="flex flex-col gap-2">
                    {/* Địa chỉ */}
                    <p className="text-xs text-zinc-500 font-medium line-clamp-1 flex items-center gap-1">
                        <span className="text-red-500 text-sm">📍</span>
                        {address || "Đang cập nhật địa chỉ"}
                    </p>

                    {/* Title mô tả */}
                    <p className="text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                        {title}
                    </p>

                    {/* Dàn Thống kê: Thích & Xem */}
                    <div className="flex items-center gap-4 mt-1 text-xs font-semibold text-zinc-500">
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                            <span className="text-red-500">❤️</span>
                            {favorite_count || 0}
                        </div>
                        <div className="flex items-center gap-1.5 bg-zinc-50 px-2 py-1 rounded-lg border border-zinc-100">
                            <span className="text-blue-500">🔥</span>
                            {click_count || 0} views
                        </div>
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 pt-2 mt-auto border-t border-dashed border-zinc-100">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMap();
                        }}
                        className="flex-1 text-sm py-2.5 rounded-xl bg-zinc-100 text-zinc-700 font-semibold hover:bg-zinc-200 active:scale-95 transition"
                    >
                        🗺️ Bản đồ
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            go(TouristAreaDetail(id));
                        }}
                        className="flex-1 text-sm py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 active:scale-95 transition shadow-md shadow-red-200"
                    >
                        Chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};
