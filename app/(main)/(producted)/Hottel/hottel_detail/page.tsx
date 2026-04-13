"use client";

import { useLoading } from "@/context/LoadingContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo } from "react";
import { getHottelDetailApi } from "@/app/api/hottelApi";
import Image from "next/image";
// 🔴 BỎ DÒNG IMPORT useNextRouter Đi
import Link from "next/link"; // 🔴 IMPORT Link CỦA NEXT.JS VÀO ĐÂY
import { Hottel } from "@/constants/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import { BookingHotelForm } from "@/components/common/forms/BookingHotelForm";
import { profileApi } from "@/app/api/profileApi";
import ReviewSection, { UserProps } from "@/components/layouts/ReviewSection";

// IMPORT MODAL REPORT VÀ FONT AWESOME
import ReportModal from "@/components/layouts/ReportModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";

// Load MapView động
const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => (
        <p className="text-zinc-500 text-center py-10">Đang tải bản đồ...</p>
    ),
});

const HottelDetail = () => {
    const searchParams = useSearchParams();
    const hottelId = Number(searchParams.get("id"));
    const { setLoading } = useLoading();
    // 🔴 BỎ CÁI go ĐI

    // ==============================================================
    // 1. TẤT CẢ HOOKS PHẢI NẰM TRÊN CÙNG
    // ==============================================================
    const [isOpen, setIsOpen] = useState(false);
    const [hottelDetail, sethottelDetail] = useState<any>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProps | null>(null);

    // STATE CHO REPORT VÀ FAVORITE
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // USEMEMO KHÓA MẢNG CHO MAPVIEW (Tránh render vô hạn)
    const mapLocationArray = useMemo(() => {
        return hottelDetail ? [hottelDetail] : [];
    }, [hottelDetail]);

    const mapCenter = useMemo(() => {
        return hottelDetail
            ? ([
                  hottelDetail.latitude ?? 15.8,
                  hottelDetail.longitude ?? 105.8,
              ] as [number, number])
            : ([15.8, 105.8] as [number, number]);
    }, [hottelDetail]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("accessToken");
            if (token) {
                setCurrentUser({
                    id: "",
                    name: localStorage.getItem("name") || "Khách",
                    avt: localStorage.getItem("avt") || "/Img/User_Icon.png",
                    role: localStorage.getItem("role") || "user",
                });
            }
        }
    }, []);

    const fetchData = async () => {
        if (!hottelId) return;
        try {
            setLoading(true);
            const res = await getHottelDetailApi({ id: hottelId });
            if (res.success) {
                sethottelDetail(res.data);
                // Gán isFavorite từ API
                setIsLiked(res.data?.isFavorite ?? false);
            }
        } catch (err) {
            console.error("Lỗi lấy chi tiết KS:", err);
            alert("Không tìm thấy khách sạn này hoặc có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [hottelId]);

    const handleToggleLike = async () => {
        if (!currentUser)
            return alert("Vui lòng đăng nhập để thả tim nha sếp!");

        // Optimistic UI
        setIsLiked(!isLiked);
        if (hottelDetail) {
            sethottelDetail((prev: any) =>
                prev
                    ? {
                          ...prev,
                          favorite_count: isLiked
                              ? prev.favorite_count - 1
                              : prev.favorite_count + 1,
                      }
                    : null,
            );
        }

        try {
            const res = await profileApi.toggleFavorite({
                EntityId: hottelId,
                EntityType: "hotel",
            });
            if (res && res.success) {
                console.log("Đã thả tim trên server:", res.isFavorite);
            }
        } catch (error) {
            // Nếu lỗi thì vả lại trạng thái cũ
            setIsLiked(isLiked);
            if (hottelDetail) {
                sethottelDetail((prev: any) =>
                    prev
                        ? {
                              ...prev,
                              favorite_count: isLiked
                                  ? prev.favorite_count + 1
                                  : prev.favorite_count - 1,
                          }
                        : null,
                );
            }
            alert("Lỗi mạng, thả tim thất bại!");
        }
    };

    // ==============================================================
    // 2. LOGIC RENDER (RETURN NULL SAU KHI GỌI XONG HOOKS)
    // ==============================================================
    if (!hottelDetail) return null;

    const galleryImages = hottelDetail.images?.length
        ? hottelDetail.images
        : [{ url: hottelDetail.coverImageUrl || "/Img/ImgNull.jpg" }];

    const formattedPrice = hottelDetail.price
        ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
          }).format(hottelDetail.price)
        : "Đang cập nhật";

    return (
        <div className="min-h-screen bg-zinc-50 pb-12 relative">
            {/* NÚT REPORT GÓC PHẢI MÀN HÌNH */}
            <button
                onClick={() => setIsReportOpen(true)}
                title="Báo cáo nội dung xấu"
                className="absolute top-6 right-6 lg:right-20 z-50 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors border border-zinc-100"
            >
                <FontAwesomeIcon icon={faFlag} />
            </button>

            <main className="max-w-6xl mx-auto px-4 pt-6 flex flex-col gap-6">
                {/* 1. BREADCRUMB & HEADER */}
                <div className="flex flex-col gap-3">
                    <div className="text-sm text-blue-600 font-medium">
                        {/* 🔴 THAY BẰNG THẺ LINK CỦA NEXT.JS NÈ SẾP */}
                        <Link
                            href={Hottel}
                            className="cursor-pointer hover:underline"
                        >
                            Khách sạn
                        </Link>{" "}
                        /{" "}
                        <span className="text-zinc-500">
                            {hottelDetail.name}
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                    {hottelDetail.type === "hottel"
                                        ? "Khách sạn"
                                        : "Nơi lưu trú"}
                                </span>
                                <span className="text-yellow-500 text-sm">
                                    {"⭐".repeat(
                                        Math.round(
                                            hottelDetail.rating_average > 0
                                                ? hottelDetail.rating_average
                                                : 5,
                                        ),
                                    )}
                                </span>
                            </div>
                            <h1 className="text-3xl font-black text-zinc-900 leading-tight">
                                {hottelDetail.name}
                            </h1>
                            <p className="text-zinc-600 mt-2 flex items-start gap-1.5">
                                <span className="mt-0.5">📍</span>
                                <span>{hottelDetail.address}</span>
                            </p>
                        </div>

                        {/* Thống kê nhỏ góc phải CÓ NÚT TIM */}
                        <div className="flex gap-4 items-center bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 shrink-0">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-zinc-800">
                                    {hottelDetail.rating_average > 0
                                        ? hottelDetail.rating_average.toFixed(1)
                                        : "5.0"}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {hottelDetail.rating_count} đánh giá
                                </span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200"></div>

                            {/* NÚT TIM */}
                            <button
                                onClick={handleToggleLike}
                                className="flex flex-col items-center group cursor-pointer transition-transform active:scale-95 outline-none"
                            >
                                <span
                                    className={`text-xl font-bold transition-colors ${isLiked ? "text-red-500 animate-bounce" : "text-zinc-300 group-hover:text-red-400"}`}
                                >
                                    ❤️
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {hottelDetail.favorite_count || 0} lượt
                                    thích
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. GALLERY ẢNH */}
                <div
                    className="w-full h-[300px] md:h-[lịch45 lg:h-[500px] rounded-3xl overflow-hidden relative shadow-md group cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <Image
                        src={hottelDetail.coverImageUrl || "/Img/ImgNull.jpg"}
                        alt={hottelDetail.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-black/80 transition">
                        🖼️ Xem tất cả ảnh
                    </div>
                </div>

                {/* MODAL XEM ẢNH FULL MÀN HÌNH */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-4xl hover:text-gray-400 transition z-[1000] p-2"
                        >
                            &times;
                        </button>
                        <div
                            className="w-full max-w-6xl h-[60vh] md:h-[85vh] relative px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Swiper
                                modules={[Navigation, Pagination, Keyboard]}
                                navigation
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }}
                                keyboard={{ enabled: true }}
                                grabCursor={true}
                                className="w-full h-full rounded-lg"
                            >
                                {galleryImages.map(
                                    (img: any, index: number) => (
                                        <SwiperSlide
                                            key={index}
                                            className="flex items-center justify-center"
                                        >
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                {/* Fix lỗi src là string thay vì object */}
                                                <Image
                                                    src={
                                                        typeof img === "string"
                                                            ? img
                                                            : img.url ||
                                                              "/Img/ImgNull.jpg"
                                                    }
                                                    alt={`Hotel image ${index + 1}`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </SwiperSlide>
                                    ),
                                )}
                            </Swiper>
                        </div>
                    </div>
                )}

                {/* 3. NỘI DUNG CHIA 2 CỘT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                            <h2 className="text-xl font-bold text-zinc-800 mb-4">
                                Mô tả khách sạn
                            </h2>
                            <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
                                {hottelDetail.description ||
                                    "Khách sạn này hiện chưa cập nhật mô tả chi tiết."}
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                            <h2 className="text-xl font-bold text-zinc-800 mb-4">
                                Tiện nghi phổ biến
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-zinc-700 font-medium">
                                <div className="flex items-center gap-2">
                                    📶 <span>Wifi miễn phí</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    🏊‍♂️ <span>Hồ bơi</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    🅿️ <span>Chỗ để xe</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    ❄️ <span>Máy lạnh</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    🍽️ <span>Nhà hàng</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    🛎️ <span>Lễ tân 24/24h</span>
                                </div>
                            </div>
                        </div>

                        {/* Box Bản đồ */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100 flex flex-col h-[400px]">
                            <h2 className="text-xl font-bold text-zinc-800 mb-4">
                                Vị trí trên bản đồ
                            </h2>
                            <div className="flex-1 rounded-2xl overflow-hidden border border-zinc-200 relative">
                                <MapView
                                    locations={mapLocationArray}
                                    LocaltionSetView={mapCenter}
                                    size={15}
                                />
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI (Sticky Box) */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-100 flex flex-col gap-6">
                            <div>
                                <p className="text-zinc-500 text-sm mb-1 font-medium">
                                    Giá phòng mỗi đêm từ
                                </p>
                                <div className="flex items-end gap-1">
                                    <span className="text-3xl font-black text-red-500 leading-none">
                                        {formattedPrice}
                                    </span>
                                </div>
                            </div>
                            <hr className="border-dashed border-zinc-200" />
                            <div className="flex flex-col gap-3 text-sm text-zinc-600">
                                <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                    <span className="font-medium flex items-center gap-2">
                                        👥 <span>Sức chứa</span>
                                    </span>
                                    <span className="font-bold text-zinc-800">
                                        Tối đa{" "}
                                        {hottelDetail.number_of_people || 2}{" "}
                                        khách
                                    </span>
                                </div>
                                <div className="flex justify-between items-center bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                    <span className="font-medium flex items-center gap-2">
                                        🔥 <span>Độ hot</span>
                                    </span>
                                    <span className="font-bold text-red-500">
                                        {hottelDetail.click_count} người đã xem
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsBookingOpen(true)}
                                className="w-full bg-blue-600 text-white font-bold text-lg py-4 rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200"
                            >
                                Chọn phòng ngay
                            </button>
                            <p className="text-xs text-center text-zinc-400">
                                Cam kết giá tốt nhất • Không thu phí đặt chỗ
                            </p>
                        </div>
                    </div>
                </div>

                {/* REVIEW SECTION */}
                <ReviewSection
                    entityId={hottelDetail.id}
                    entityType="hotel"
                    currentUser={currentUser}
                    onReviewSuccess={fetchData}
                />
            </main>

            {/* MODAL REPORT */}
            {hottelDetail && (
                <ReportModal
                    isOpen={isReportOpen}
                    onClose={() => setIsReportOpen(false)}
                    entityId={hottelDetail.id}
                    entityType="hotel"
                />
            )}

            {/* MODAL BOOKING */}
            {isBookingOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl relative"
                    >
                        <BookingHotelForm
                            hotelId={hottelDetail.id}
                            hotelName={hottelDetail.name}
                            rooms={hottelDetail.rooms || []}
                            onClose={() => setIsBookingOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HottelDetail;
