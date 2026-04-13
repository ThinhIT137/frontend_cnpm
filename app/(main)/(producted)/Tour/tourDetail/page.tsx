"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // 🔴 THÊM LINK CỦA NEXTJS
import { useLoading } from "@/context/LoadingContext";
import { Tour } from "@/constants/router"; // 🔴 IMPORT ĐƯỜNG DẪN TRANG DANH SÁCH TOUR

// Import API và Type
import { tourDetailApi } from "@/app/api/tourApi";
import { profileApi } from "@/app/api/profileApi";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { BookingTourForm } from "@/components/common/forms/BookingTourForm";
import ReviewSection, { UserProps } from "@/components/layouts/ReviewSection";
import ReportModal from "@/components/layouts/ReportModal";

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
    faRoute,
    faLocationDot,
    faFlag,
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

    // ==============================================================
    // 1. TẤT CẢ HOOKS PHẢI NẰM TRÊN CÙNG
    // ==============================================================
    const [tourData, setTourData] = useState<any>(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<UserProps | null>(null);

    // STATE CHO REPORT VÀ FAVORITE
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    // TẠO MẢNG LOCATIONS CHO BẢN ĐỒ TỪ ITINERARIES (ĐỂ VẼ NHIỀU ĐIỂM)
    const mapLocations = useMemo(() => {
        if (!tourData || !tourData.itineraries) return [];
        // Lọc ra những ngày có tọa độ
        const validPlaces = tourData.itineraries
            .map((item: any) => item.tourist_Place)
            .filter((place: any) => place && place.latitude && place.longitude);

        // Nếu Tour có điểm xuất phát thì nhét thêm vào đầu mảng
        if (
            tourData.departure?.coords?.[0] &&
            tourData.departure?.coords?.[1]
        ) {
            return [
                {
                    name: tourData.departure.name || "Điểm xuất phát",
                    latitude: tourData.departure.coords[0],
                    longitude: tourData.departure.coords[1],
                },
                ...validPlaces,
            ];
        }
        return validPlaces;
    }, [tourData]);

    const mapCenter = useMemo(() => {
        if (mapLocations.length > 0) {
            return [mapLocations[0].latitude, mapLocations[0].longitude] as [
                number,
                number,
            ];
        }
        return [15.8, 105.8] as [number, number];
    }, [mapLocations]);

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

    const fetchTourDetail = async () => {
        if (!tourId) return;
        try {
            setLoading(true);
            const data = await tourDetailApi(tourId);
            if (data) {
                setTourData(data);
                setIsLiked(data.isFavorite ?? false);
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

    // HÀM XỬ LÝ THẢ TIM
    const handleToggleLike = async () => {
        if (!currentUser)
            return alert("Vui lòng đăng nhập để thả tim nha sếp!");

        setIsLiked(!isLiked);
        if (tourData) {
            setTourData((prev: any) =>
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
                EntityId: tourId,
                EntityType: "tour",
            });
            if (res && res.success) {
                console.log("Đã thả tim trên server:", res.isFavorite);
            }
        } catch (error) {
            setIsLiked(isLiked);
            if (tourData) {
                setTourData((prev: any) =>
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
    if (!tourData) return null;

    const formatPrice = (price?: number) => {
        if (!price) return "Liên hệ";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const slideImages =
        tourData.images?.length > 0
            ? tourData.images.map((img: any) => img.url)
            : [tourData.coverImageUrl || "/Img/ImgNull.jpg"];

    return (
        <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 relative">
            {/* NÚT REPORT NẰM LƠ LỬNG GÓC TRÊN CÙNG BÊN PHẢI */}
            <button
                onClick={() => setIsReportOpen(true)}
                title="Báo cáo nội dung xấu"
                className="absolute top-6 right-6 lg:right-20 z-50 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors border border-zinc-100"
            >
                <FontAwesomeIcon icon={faFlag} />
            </button>

            <main className="max-w-7xl mx-auto space-y-8">
                {/* 🔴 BREADCRUMB Ở TRÊN CÙNG DÙNG THẺ LINK */}
                <div className="text-sm text-blue-600 font-medium flex items-center gap-2">
                    <Link
                        href={Tour}
                        className="hover:underline hover:text-blue-800 transition-colors"
                    >
                        Danh sách Tour
                    </Link>
                    <span className="text-zinc-400">/</span>
                    <span className="text-zinc-600 truncate">
                        {tourData.name}
                    </span>
                </div>

                {/* PHẦN 1: THÔNG TIN TỔNG QUAN */}
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
                            {slideImages.map((src: string, index: number) => (
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

                        {/* BẢN ĐỒ HIỂN THỊ CÁC ĐIỂM ĐI QUA CỦA TOUR */}
                        <div className="w-full h-[300px] mt-6 rounded-2xl overflow-hidden shadow-md border border-zinc-100 relative">
                            <MapView
                                locations={mapLocations}
                                LocaltionSetView={mapCenter}
                                size={9}
                            />
                        </div>
                    </div>

                    {/* Cột phải: CHI TIẾT */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="flex gap-2 mb-3">
                            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 rounded-full">
                                {tourData.tourType || "Tour phổ thông"}
                            </span>
                            <span
                                className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full ${tourData.status === "Còn chỗ" ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"}`}
                            >
                                {tourData.status || "Đang cập nhật"}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-black text-zinc-900 leading-tight mb-2">
                            {tourData.name}
                        </h1>
                        <p className="text-zinc-500 text-sm md:text-base mb-6 line-clamp-3">
                            {tourData.description}
                        </p>

                        <div className="mb-6 p-4 bg-orange-50 border border-orange-100 rounded-2xl">
                            <p className="text-sm text-orange-600 font-semibold mb-1">
                                Giá trọn gói chỉ từ
                            </p>
                            <p className="text-3xl font-black text-orange-600">
                                {formatPrice(tourData.price)}
                            </p>
                        </div>

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
                                    <p className="font-semibold line-clamp-1">
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
                                    {tourData.rating_average > 0
                                        ? tourData.rating_average.toFixed(1)
                                        : "5.0"}
                                </span>
                            </div>

                            {/* NÚT TIM */}
                            <button
                                onClick={handleToggleLike}
                                className={`flex items-center gap-2 text-sm font-semibold transition-transform active:scale-95 outline-none group cursor-pointer ${isLiked ? "text-red-500" : "text-zinc-500"}`}
                            >
                                <FontAwesomeIcon
                                    icon={faHeart}
                                    className={
                                        isLiked
                                            ? "animate-bounce"
                                            : "group-hover:text-red-400 transition-colors"
                                    }
                                />
                                <span>
                                    {tourData.favorite_count || 0} lượt thích
                                </span>
                            </button>

                            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
                                <FontAwesomeIcon
                                    icon={faEye}
                                    className="text-blue-500"
                                />
                                <span>
                                    {tourData.click_count || 0} lượt xem
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsBookingOpen(true)}
                            className="mt-6 w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-200 transition-all active:scale-95"
                        >
                            🎒 ĐẶT TOUR NGAY
                        </button>
                    </div>
                </div>

                {/* PHẦN 2: LỊCH TRÌNH CHUYẾN ĐI (TIMELINE) */}
                <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 p-6 lg:p-8">
                    <h2 className="text-2xl font-black text-zinc-900 mb-6 flex items-center gap-3">
                        <FontAwesomeIcon
                            icon={faRoute}
                            className="text-blue-600"
                        />{" "}
                        Lịch trình chi tiết
                    </h2>

                    {tourData.itineraries && tourData.itineraries.length > 0 ? (
                        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
                            {tourData.itineraries.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="relative flex items-start justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow flex-col z-10">
                                        <span className="text-[10px] font-bold leading-none">
                                            Ngày
                                        </span>
                                        <span className="text-sm font-black leading-none">
                                            {item.dayNumber}
                                        </span>
                                    </div>
                                    <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-zinc-50 p-5 rounded-2xl border border-zinc-100 hover:shadow-md transition-shadow">
                                        <h3 className="text-lg font-bold text-blue-700 mb-2">
                                            {item.activityName}
                                        </h3>
                                        <p className="text-zinc-600 text-sm whitespace-pre-line mb-3">
                                            {item.description}
                                        </p>
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

                {/* REVIEW SECTION */}
                <ReviewSection
                    entityId={tourData.id}
                    entityType="tour"
                    currentUser={currentUser}
                    onReviewSuccess={fetchTourDetail}
                />
            </main>

            {/* MODAL REPORT */}
            {tourData && (
                <ReportModal
                    isOpen={isReportOpen}
                    onClose={() => setIsReportOpen(false)}
                    entityId={tourData.id}
                    entityType="tour"
                />
            )}

            {isBookingOpen && (
                <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-4xl relative"
                    >
                        <BookingTourForm
                            tourId={tourData.id}
                            tourName={tourData.name}
                            basePrice={tourData.price || 0}
                            departures={tourData.schedules || []}
                            onClose={() => setIsBookingOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TourDetail;
