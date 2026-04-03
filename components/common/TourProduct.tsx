"use client";

import { useNextRouter } from "@/libs/hooks/useNextRouter";
import Image from "next/image";
import { TourProps } from "@/types/TourProps";
import { TourDetail } from "@/constants/router";

type TourProductProps = TourProps & {
    onViewMap: () => void;
};

export const TourProduct = (props: TourProductProps) => {
    const { go } = useNextRouter();

    const {
        id,
        coverImageUrl,
        name,
        rating_average,
        price,
        durationDays,
        vehicle,
        tourType,
        status,
        departure,
        onViewMap,
    } = props;

    // Format tiền tệ VNĐ
    const formattedPrice = price
        ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
          }).format(price)
        : "Liên hệ";

    // Logic đổi màu badge trạng thái
    const getStatusBadge = (stt?: string) => {
        if (!stt) return { bg: "bg-gray-500", text: "Chưa cập nhật" };
        const lower = stt.toLowerCase();
        if (lower.includes("hết") || lower.includes("đóng"))
            return { bg: "bg-red-500", text: stt };
        if (
            lower.includes("mở") ||
            lower.includes("nhận") ||
            lower.includes("còn")
        )
            return { bg: "bg-emerald-500", text: stt };
        return { bg: "bg-blue-500", text: stt };
    };

    const statusInfo = getStatusBadge(status);

    return (
        <div
            className="group w-full bg-white rounded-2xl overflow-hidden 
            shadow-sm hover:shadow-xl transition-all duration-300 
            hover:-translate-y-1 cursor-pointer border border-zinc-200 flex flex-col p-3"
        >
            {/* ================= PHẦN TRÊN: ẢNH (TRÁI) + THÔNG TIN (PHẢI) ================= */}
            <div className="flex gap-3">
                {/* TRÁI: KHU VỰC ẢNH (Bóp fix cứng chiều rộng để không bị móp) */}
                <div className="relative w-[150px] sm:w-[260px] min-h-[160px] shrink-0 rounded-xl overflow-hidden">
                    {" "}
                    <Image
                        src={coverImageUrl || "/Img/ImgNull.jpg"}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    {/* Rating - Nằm trên góc trái ảnh */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-bold text-yellow-600 shadow">
                        ⭐ {rating_average ?? "4.0"}
                    </div>
                    {/* Trạng thái - Nằm dưới đáy ảnh */}
                    <div
                        className={`absolute bottom-2 left-2 right-2 text-center ${statusInfo.bg} text-white px-1 py-1 rounded-lg text-[10px] font-bold shadow-md`}
                    >
                        {statusInfo.text}
                    </div>
                </div>

                {/* PHẢI: NỘI DUNG THÔNG TIN */}
                <div className="flex flex-col flex-1 py-0.5">
                    {/* Tên Tour */}
                    <h3 className="text-zinc-800 font-bold text-sm sm:text-base line-clamp-2 leading-snug mb-2">
                        {name}
                    </h3>

                    {/* Khởi hành & Các thông số nhỏ (Xếp dọc bằng flex-col) */}
                    <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs text-zinc-600">
                        <div className="flex items-start gap-1.5 font-medium">
                            <span>🛫</span>
                            <span className="line-clamp-1">
                                Khởi hành:{" "}
                                <span className="text-zinc-800">
                                    {departure?.name || "Đang cập nhật"}
                                </span>
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span>⏱️</span>
                            <span>
                                {durationDays
                                    ? `${durationDays} ngày`
                                    : "-- ngày"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span>🚗</span>
                            <span className="line-clamp-1">
                                {vehicle || "Chưa rõ"}
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span>🏷️</span>
                            <span className="line-clamp-1">
                                {tourType || "Tour phổ thông"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================= PHẦN DƯỚI: GIÁ TIỀN & NÚT BẤM ================= */}
            <div className="pt-3 mt-3 border-t border-dashed border-zinc-200 flex flex-col gap-3">
                {/* Giá tiền */}
                <div className="flex justify-between items-end px-1">
                    <span className="text-xs text-zinc-500 font-medium pb-1">
                        Giá từ
                    </span>
                    <span className="text-lg font-black text-red-500">
                        {formattedPrice}
                    </span>
                </div>

                {/* Nút bấm */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewMap();
                        }}
                        className="flex-1 text-sm py-2 rounded-xl bg-zinc-100 text-zinc-700 font-bold hover:bg-zinc-200 active:scale-95 transition"
                    >
                        📍 Bản đồ
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            go(TourDetail(id));
                        }}
                        className="flex-1 text-sm py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 active:scale-95 transition shadow"
                    >
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    );
};
