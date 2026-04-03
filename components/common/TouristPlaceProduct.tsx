"use client";

import { TouristPlaceDetail } from "@/constants/router"; // Cập nhật đúng đường dẫn nhé
import { useNextRouter } from "@/libs/hooks/useNextRouter";
import Image from "next/image";

type TouristPlaceProductProps = {
    id: number;
    url: string;
    name: string;
    title: string;
    rating_average: number;
    onViewMap: () => void;
};

export const TouristPlaceProduct = ({
    id,
    url,
    name,
    title,
    rating_average,
    onViewMap,
}: TouristPlaceProductProps) => {
    const { go } = useNextRouter();

    return (
        <div
            className="group w-full bg-white rounded-3xl overflow-hidden 
            shadow-md hover:shadow-2xl transition-all duration-300 
            hover:-translate-y-1 cursor-pointer border border-zinc-100"
        >
            {/* IMAGE */}
            <div className="relative w-full h-52 overflow-hidden">
                <Image
                    src={url}
                    alt={name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                {/* rating */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-xl text-xs font-semibold text-yellow-500 shadow">
                    ⭐ {rating_average ?? "4.5"}
                </div>

                {/* name overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-base line-clamp-1 drop-shadow">
                        {name}
                    </h3>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col gap-3">
                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                    {title}
                </p>

                {/* ACTION */}
                <div className="flex gap-2 pt-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMap();
                        }}
                        className="flex-1 text-sm py-2 rounded-xl 
                        bg-zinc-100 text-zinc-700 
                        hover:bg-zinc-200 active:scale-95 transition"
                    >
                        📍 Bản đồ
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // GỌI HÀM CHUYỂN TRANG MỚI Ở ĐÂY 👇
                            go(TouristPlaceDetail(id));
                        }}
                        className="flex-1 text-sm py-2 rounded-xl 
                        bg-red-500 text-white 
                        hover:bg-red-600 active:scale-95 transition shadow"
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};
