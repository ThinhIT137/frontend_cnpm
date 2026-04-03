"use client";

import { useNextRouter } from "@/libs/hooks/useNextRouter";
import Image from "next/image";
import { HottelProps } from "@/types/HottelProps";
import { HottelDetail } from "@/constants/router";

// Kế thừa Props và thêm hàm onViewMap
type HottelProductProps = HottelProps & {
    onViewMap: () => void;
};

export const HottelProduct = (props: HottelProductProps) => {
    const { go } = useNextRouter();

    const {
        id,
        coverImageUrl,
        name,
        rating_average,
        address,
        description,
        price,
        favorite_count,
        onViewMap,
    } = props;

    const formattedPrice = price
        ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
          }).format(price)
        : "Đang cập nhật";

    return (
        <div
            className="group w-full bg-white rounded-2xl overflow-hidden 
            shadow-sm hover:shadow-xl transition-all duration-300 
            hover:-translate-y-1 cursor-pointer border border-zinc-200 flex flex-col p-3"
        >
            {/* ================= PHẦN TRÊN: ẢNH TO + THÔNG TIN KHÁCH SẠN ================= */}
            <div className="flex gap-4 items-stretch">
                {/* TRÁI: ẢNH (Kích thước y chang TourProduct cho đồng bộ) */}
                <div className="relative w-[150px] sm:w-[220px] min-h-[160px] shrink-0 rounded-xl overflow-hidden">
                    <Image
                        src={coverImageUrl || "/Img/ImgNull.jpg"}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Rating */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-bold text-yellow-600 shadow">
                        ⭐ {rating_average ?? "4.0"}
                    </div>

                    {/* Lượt thích thả tim overlay dưới đáy ảnh */}
                    <div className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1 bg-black/40 backdrop-blur-sm text-white px-1 py-1 rounded-lg text-[10px] font-medium shadow-md">
                        <span className="text-red-400">❤️</span>{" "}
                        {favorite_count || 0} yêu thích
                    </div>
                </div>

                {/* PHẢI: NỘI DUNG THÔNG TIN */}
                <div className="flex flex-col flex-1 justify-center py-1">
                    {/* Tên Khách sạn */}
                    <h3 className="text-zinc-800 font-bold text-base sm:text-lg line-clamp-2 leading-snug mb-3">
                        {name}
                    </h3>

                    {/* Địa chỉ & Mô tả */}
                    <div className="flex flex-col gap-2 text-xs text-zinc-600">
                        <div className="flex items-start gap-1.5 font-medium">
                            <span className="text-sm shrink-0">📍</span>
                            <span className="line-clamp-2 mt-0.5 leading-relaxed">
                                <span className="text-zinc-800">
                                    {address || "Đang cập nhật địa chỉ"}
                                </span>
                            </span>
                        </div>

                        <div className="flex items-start gap-1.5 mt-1">
                            <span className="text-sm shrink-0">📝</span>
                            <span className="line-clamp-2 mt-0.5 text-zinc-500 leading-relaxed">
                                {description ||
                                    "Chưa có bài giới thiệu cho khách sạn này..."}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= PHẦN DƯỚI: GIÁ TIỀN & NÚT BẤM ================= */}
            <div className="pt-4 mt-3 border-t border-dashed border-zinc-200 flex flex-col gap-3">
                {/* Giá tiền */}
                <div className="flex justify-between items-end px-1">
                    <span className="text-sm text-zinc-500 font-medium pb-1">
                        Giá phòng từ
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-red-500">
                            {formattedPrice}
                        </span>
                        {/* Thêm cái "/ đêm" này vào cho chuẩn bài Booking */}
                        <span className="text-xs text-zinc-500 font-medium pb-1">
                            / đêm
                        </span>
                    </div>
                </div>

                {/* Nút bấm */}
                <div className="flex gap-3 mt-1">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMap();
                        }}
                        className="flex-1 text-sm py-2.5 rounded-xl bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200 active:scale-95 transition"
                    >
                        📍 Xem trên bản đồ
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            go(HottelDetail(id));
                        }}
                        className="flex-1 text-sm py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition shadow-lg shadow-blue-200"
                    >
                        Xem phòng & Giá
                    </button>
                </div>
            </div>
        </div>
    );
};
