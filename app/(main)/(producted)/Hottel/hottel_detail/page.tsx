"use client";

import { useLoading } from "@/context/LoadingContext";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getHottelDetailApi } from "@/app/api/hottelApi";
import Image from "next/image";
import { useNextRouter } from "@/hooks/useNextRouter";
import { Hottel, TouristPlaceDetail } from "@/constants/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import { BookingHotelForm } from "@/components/common/forms/BookingHotelForm";

// Load MapView động
const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => (
        <p className="text-zinc-500 text-center py-10">Đang tải bản đồ...</p>
    ),
});

const hottelDetail = () => {
    const searchParams = useSearchParams();
    const hottelId = Number(searchParams.get("id"));
    const { setLoading } = useLoading();
    const { go } = useNextRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Dùng 'any' tạm cho lẹ, nếu ông kỹ tính thì tạo Type HottelDetailProps nha
    const [hottelDetail, sethottelDetail] = useState<any>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    const fetchData = async () => {
        if (!hottelId) return;
        try {
            setLoading(true);
            const res = await getHottelDetailApi({ id: hottelId });
            if (res.success) {
                sethottelDetail(res.data);
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
    // onClick={go(TouristPlaceDetail(hottelDetail.touris))
    // Nếu chưa có data thì return rỗng (tránh lỗi chớp màn hình)
    if (!hottelDetail) return null;
    const galleryImages = hottelDetail.images?.length
        ? hottelDetail.images
        : [hottelDetail.coverImageUrl || "/Img/ImgNull.jpg"];

    // Format giá tiền
    const formattedPrice = hottelDetail.price
        ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
          }).format(hottelDetail.price)
        : "Đang cập nhật";

    return (
        <div className="min-h-screen bg-zinc-50 pb-12">
            <main className="max-w-6xl mx-auto px-4 pt-6 flex flex-col gap-6">
                {/* 1. BREADCRUMB & HEADER */}
                <div className="flex flex-col gap-3">
                    <div className="text-sm text-blue-600 font-medium">
                        <span
                            className="cursor-pointer"
                            onClick={() => {
                                go(Hottel);
                            }}
                        >
                            Khách sạn
                        </span>
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
                                            hottelDetail.rating_average || 4,
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

                        {/* Thống kê nhỏ góc phải */}
                        <div className="flex gap-4 items-center bg-white px-4 py-2 rounded-2xl shadow-sm border border-zinc-100 shrink-0">
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-zinc-800">
                                    {hottelDetail.rating_average || "4.0"}
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {hottelDetail.rating_count} đánh giá
                                </span>
                            </div>
                            <div className="w-px h-8 bg-zinc-200"></div>
                            <div className="flex flex-col items-center">
                                <span className="text-xl font-bold text-red-500">
                                    ❤️
                                </span>
                                <span className="text-xs text-zinc-500">
                                    {hottelDetail.favorite_count} lượt thích
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. GALLERY ẢNH (Hiển thị 1 ảnh to, nếu có nhiều ảnh thì chia grid) */}
                <div
                    className="w-full h-[300px] md:h-[400px] lg:h-[500px] rounded-3xl overflow-hidden relative shadow-md group"
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

                    {/* Nút bấm mở Gallery */}
                    <div
                        onClick={() => setIsOpen(true)} // Bấm vào đây để mở Modal
                        className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium cursor-pointer hover:bg-black/80 transition"
                    >
                        🖼️ Xem tất cả ảnh
                    </div>
                </div>

                {/* MODAL XEM ẢNH FULL MÀN HÌNH (LIGHTBOX) */}
                {isOpen && (
                    <div
                        // Nền đen phủ kín màn hình (z-index cực cao để đè lên mọi thứ)
                        className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center backdrop-blur-sm transition-opacity"
                        onClick={() => setIsOpen(false)} // Click vào vùng tối (nền) sẽ đóng
                    >
                        {/* Nút Đóng (X) ở góc phải trên */}
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 md:top-6 md:right-6 text-white text-4xl hover:text-gray-400 transition z-[1000] cursor-pointer p-2"
                        >
                            &times;
                        </button>

                        {/* Wrapper chứa Swiper - Ngăn chặn sự kiện click lan ra ngoài nền đen */}
                        <div
                            className="w-full max-w-6xl h-[60vh] md:h-[85vh] relative px-4"
                            onClick={(e) => e.stopPropagation()} // Quan trọng: Click vào ảnh không bị đóng modal
                        >
                            <Swiper
                                modules={[Navigation, Pagination, Keyboard]}
                                navigation // Nút mũi tên trái phải
                                pagination={{
                                    clickable: true,
                                    dynamicBullets: true,
                                }} // Dấu chấm tròn ở dưới
                                keyboard={{ enabled: true }} // Cho phép dùng phím mũi tên trên bàn phím để sang ảnh
                                grabCursor={true}
                                className="w-full h-full rounded-lg"
                            >
                                {galleryImages.map(
                                    (src: string, index: number) => (
                                        <SwiperSlide
                                            key={index}
                                            className="flex items-center justify-center"
                                        >
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                <Image
                                                    src={src}
                                                    alt={`Hotel image ${index + 1}`}
                                                    fill
                                                    className="object-contain" // Dùng object-contain để ảnh không bị cắt xén khi phóng to
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
                    {/* CỘT TRÁI (Mô tả & Bản đồ) */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* Box Mô tả */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-zinc-100">
                            <h2 className="text-xl font-bold text-zinc-800 mb-4">
                                Mô tả khách sạn
                            </h2>
                            <p className="text-zinc-600 leading-relaxed whitespace-pre-line">
                                {hottelDetail.description ||
                                    "Khách sạn này hiện chưa cập nhật mô tả chi tiết."}
                            </p>
                        </div>

                        {/* Box Tiện ích (Chém gió thêm cho đẹp UI) */}
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
                                    locations={[hottelDetail]} // Quăng đúng 1 cái KS này vào
                                    selectedLocation={[
                                        hottelDetail.latitude,
                                        hottelDetail.longitude,
                                    ]}
                                    LocaltionSetView={[
                                        hottelDetail.latitude,
                                        hottelDetail.longitude,
                                    ]}
                                    size={15} // Phóng to lên xíu vì đây là xem 1 cái
                                />
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI (Sticky Box Chốt Sale) */}
                    <div className="lg:col-span-1 lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl p-6 shadow-xl border border-zinc-100 flex flex-col gap-6">
                            {/* Giá tiền */}
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

                            {/* Thông số mồi khách */}
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

                            {/* Nút bấm */}
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
            </main>
            {isBookingOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl relative"
                    >
                        <BookingHotelForm
                            hotelId={hottelDetail.id}
                            hotelName={hottelDetail.name}
                            rooms={hottelDetail.rooms || []} // Lấy danh sách phòng từ API
                            onClose={() => setIsBookingOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default hottelDetail;
