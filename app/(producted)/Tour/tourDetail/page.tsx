"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useLoading } from "@/context/LoadingContext";

// Import API và Type (Đổi đường dẫn cho đúng project của ông nha)
import { tourDetailApi } from "@/app/api/tourApi";
import { TourDetailProps } from "@/types/TourProps";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faClock,
    faUsers,
    faBus,
    faStar,
    faHeart,
    faEye,
    faMapMarkerAlt,
    faMoneyBillWave,
    faRoute,
    faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const TourDetail = () => {
    const { setLoading } = useLoading();
    const searchParams = useSearchParams();
    const tourId = Number(searchParams.get("id"));

    const [tourData, setTourData] = useState<TourDetailProps | null>(null);

    const fetchTourDetail = async () => {
        if (!tourId) return;
        try {
            setLoading(true);
            const data = await tourDetailApi(tourId);
            if (data) {
                setTourData(data);
            }
        } catch (error) {
            console.error("Lỗi khi tải chi tiết tour:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTourDetail();
    }, [tourId]);

    // Format tiền VND
    const formatPrice = (price?: number) => {
        if (!price) return "Liên hệ";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    if (!tourData) return null; // Hoặc show một component Empty State tùy ông

    // Mảng ảnh dùng cho Swiper (Nếu ko có ảnh nào thì dùng ảnh cover)
    const slideImages =
        tourData.images?.length > 0
            ? tourData.images.map((img) => img.url)
            : [tourData.coverImageUrl || "/Img/ImgNull.jpg"];

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8">
            <main className="max-w-7xl mx-auto space-y-8">
                {/* ========================================== */}
                {/* PHẦN 1: THÔNG TIN TỔNG QUAN (CHIA 2 CỘT)   */}
                {/* ========================================== */}
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-5 lg:p-8 flex flex-col lg:flex-row gap-8">
                    {/* Cột trái: SLIDER ẢNH */}
                    <div className="w-full lg:w-1/2">
                        <Swiper
                            modules={[Navigation, Pagination, Autoplay]}
                            navigation
                            pagination={{ clickable: true }}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                            loop={slideImages.length > 1}
                            className="w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden shadow-md"
                        >
                            {slideImages.map((src, index) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={src ?? ""}
                                            alt={`Hình ảnh tour ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Cột phải: CHI TIẾT */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        {/* Tags */}
                        <div className="flex gap-2 mb-3">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full">
                                {tourData.tourType || "Tour phổ thông"}
                            </span>
                            <span
                                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${
                                    tourData.status === "Còn chỗ"
                                        ? "text-green-700 bg-green-100"
                                        : "text-red-700 bg-red-100"
                                }`}
                            >
                                {tourData.status || "Đang cập nhật"}
                            </span>
                        </div>

                        {/* Tiêu đề & Mô tả */}
                        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-2">
                            {tourData.name}
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-base mb-6 line-clamp-3">
                            {tourData.description}
                        </p>

                        {/* Giá tiền */}
                        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                            <p className="text-sm text-orange-600 font-semibold mb-1">
                                Giá trọn gói chỉ từ
                            </p>
                            <p className="text-3xl font-black text-orange-600">
                                {formatPrice(tourData.price)}
                            </p>
                        </div>

                        {/* Các thông số nhanh (Grid 2 cột) */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center gap-3 text-zinc-700">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-blue-500">
                                    <FontAwesomeIcon icon={faClock} />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        Thời gian
                                    </p>
                                    <p className="font-semibold">
                                        {tourData.durationDays} ngày
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-700">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-blue-500">
                                    <FontAwesomeIcon icon={faUsers} />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        Số chỗ
                                    </p>
                                    <p className="font-semibold">
                                        {tourData.numberOfPeople} người
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-700">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-blue-500">
                                    <FontAwesomeIcon icon={faBus} />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        Phương tiện
                                    </p>
                                    <p className="font-semibold">
                                        {tourData.vehicle || "Đang cập nhật"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-700">
                                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-blue-500">
                                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                                </div>
                                <div>
                                    <p className="text-xs text-zinc-500 font-medium">
                                        Điểm khởi hành
                                    </p>
                                    <p className="font-semibold">
                                        {tourData.departure?.name ||
                                            "Đang cập nhật"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Thống kê tương tác */}
                        <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <FontAwesomeIcon
                                    icon={faStar}
                                    className="text-yellow-400"
                                />
                                <span>
                                    {tourData.rating_average.toFixed(1)}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className="text-red-500"
                                />
                                <span>
                                    {tourData.favorite_count} lượt thích
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="text-blue-500"
                                />
                                <span>{tourData.click_count} lượt xem</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================== */}
                {/* PHẦN 2: LỊCH TRÌNH CHUYẾN ĐI (TIMELINE)    */}
                {/* ========================================== */}
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-6 lg:p-8">
                    <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
                        <FontAwesomeIcon
                            icon={faRoute}
                            className="text-blue-600"
                        />
                        Lịch trình chi tiết
                    </h2>

                    {tourData.itineraries && tourData.itineraries.length > 0 ? (
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                            {tourData.itineraries.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                >
                                    {/* Icon Timeline (Điểm nối) */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-col z-10">
                                        <span className="text-[10px] font-bold leading-none">
                                            Ngày
                                        </span>
                                        <span className="text-sm font-black leading-none">
                                            {item.dayNumber}
                                        </span>
                                    </div>

                                    {/* Nội dung Card Itinerary */}
                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-zinc-50 p-5 rounded-2xl border border-zinc-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-blue-700 mb-2">
                                            {item.activityName}
                                        </h3>
                                        <p className="text-zinc-600 text-sm whitespace-pre-line mb-3">
                                            {item.description}
                                        </p>

                                        {/* Hiển thị địa điểm tham quan nếu có Map */}
                                        {item.tourist_Place && (
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-sm text-zinc-700 font-medium mt-2">
                                                <FontAwesomeIcon
                                                    icon={faLocationDot}
                                                    className="text-red-500"
                                                />
                                                Tham quan:{" "}
                                                {item.tourist_Place.name}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-zinc-500 italic">
                            Đang cập nhật lịch trình cho tour này.
                        </p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default TourDetail;
