"use client";

import { useLoading } from "@/context/LoadingContext";
import Image from "next/image";
import { homeApi } from "../api/homeApi";
import { useEffect, useState } from "react";

// Import Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Hooks & Constants
import { useNextRouter } from "@/hooks/useNextRouter";
import { TouristAreaDetail } from "@/constants/router";

// --- IMPORT FONTAWESOME ICONS ---
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMapLocationDot,
    faRoute,
    faHotel,
    faStar,
    faShieldHalved,
    faHeadset,
} from "@fortawesome/free-solid-svg-icons";

import "../home.scss";

export default function Home() {
    const { setLoading } = useLoading();
    const { go } = useNextRouter();

    // 1. State hứng dữ liệu
    const [touristAreas, setTouristAreas] = useState<any[]>([]); // Banner
    const [touristPlaces, setTouristPlaces] = useState<any[]>([]); // Slider 1
    const [tours, setTours] = useState<any[]>([]); // Slider 2
    const [hotels, setHotels] = useState<any[]>([]); // Slider 3

    const fetchHomeData = async () => {
        try {
            setLoading(true);
            const res: any = await homeApi();

            // Lấy data từ response
            const responseData = res?.data?.data || res?.data || res;

            setTouristAreas(responseData?.touristArea ?? []);
            setTouristPlaces(responseData?.touristPlace ?? []);
            setTours(responseData?.tour ?? []);
            setHotels(responseData?.hotel ?? []);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu trang chủ:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeData();
    }, []);

    // 2. Cấu hình Responsive cho Swiper
    const carouselBreakpoints = {
        320: { slidesPerView: 1.2, spaceBetween: 16 }, // Mobile
        768: { slidesPerView: 2.5, spaceBetween: 20 }, // Tablet
        1024: { slidesPerView: 3.5, spaceBetween: 24 }, // Laptop
        1280: { slidesPerView: 4, spaceBetween: 30 }, // Desktop
    };

    // 3. Data cho phần Giới thiệu web (Features)
    const webFeatures = [
        {
            id: 1,
            icon: faMapLocationDot,
            title: "Bản đồ thông minh",
            description:
                "Dễ dàng tìm kiếm, định vị và khám phá các địa điểm du lịch lân cận trên bản đồ tương tác.",
            color: "text-blue-600",
            bg: "bg-blue-50",
            hover: "group-hover:bg-blue-600 group-hover:text-white",
        },
        {
            id: 2,
            icon: faRoute,
            title: "Hành trình đa dạng",
            description:
                "Hàng trăm tour du lịch hấp dẫn được thiết kế chi tiết, phù hợp với mọi nhu cầu khám phá.",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            hover: "group-hover:bg-emerald-600 group-hover:text-white",
        },
        {
            id: 3,
            icon: faHotel,
            title: "Lưu trú đẳng cấp",
            description:
                "Hệ thống phòng nghỉ tiện nghi, giá cả minh bạch và dễ dàng đặt trước chỉ với vài thao tác.",
            color: "text-orange-600",
            bg: "bg-orange-50",
            hover: "group-hover:bg-orange-600 group-hover:text-white",
        },
        {
            id: 4,
            icon: faStar,
            title: "Đánh giá chân thực",
            description:
                "Cộng đồng chia sẻ trải nghiệm thực tế, giúp bạn luôn có những quyết định đúng đắn nhất.",
            color: "text-purple-600",
            bg: "bg-purple-50",
            hover: "group-hover:bg-purple-600 group-hover:text-white",
        },
    ];

    // Màn hình loading (Skeleton)
    if (
        touristAreas.length === 0 &&
        tours.length === 0 &&
        hotels.length === 0 &&
        touristPlaces.length === 0
    ) {
        return (
            <div className="w-full h-screen bg-gray-100 animate-pulse flex items-center justify-center text-gray-500">
                Đang tải dữ liệu trang chủ...
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col pb-20 bg-gray-50">
            {/* ================= HERO BANNER (Khu du lịch) ================= */}
            <div className="w-full h-screen overflow-hidden bg-black">
                {touristAreas.length > 0 && (
                    <Swiper
                        loop={true}
                        navigation={true}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        pagination={{ clickable: true, dynamicBullets: true }}
                        modules={[Pagination, Navigation, Autoplay]}
                        className="w-full h-full"
                    >
                        {touristAreas.slice(0, 5).map((item) => (
                            <SwiperSlide
                                className="w-full h-full"
                                key={`banner-${item.id}`}
                            >
                                <div
                                    onClick={() =>
                                        go(TouristAreaDetail(item.id))
                                    }
                                    className="relative w-full h-full cursor-pointer group"
                                >
                                    <Image
                                        src={
                                            item.coverImageUrl ??
                                            "/Img/ImgNull.jpg"
                                        }
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        priority
                                    />
                                    {/* Overlay gradient lót dưới chữ */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                    <div className="absolute bottom-32 left-8 md:left-16 text-white z-10 max-w-3xl pr-4">
                                        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
                                            {item.name}
                                        </h1>
                                        <p className="text-base md:text-xl opacity-90 line-clamp-3 shadow-sm font-light">
                                            {item.description}
                                        </p>
                                        <button className="mt-6 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors shadow-lg">
                                            Khám phá ngay
                                        </button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-16 flex flex-col gap-16">
                {/* ================= SECTION GIỚI THIỆU WEB (Vẽ đẹp) ================= */}
                <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn{" "}
                            <span className="text-blue-600">UTCTrek</span>?
                        </h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Chúng tôi mang đến nền tảng toàn diện giúp bạn dễ
                            dàng lên kế hoạch và tận hưởng trọn vẹn từng khoảnh
                            khắc của chuyến đi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {webFeatures.map((feature) => (
                            <div
                                key={feature.id}
                                className="flex flex-col items-center text-center group cursor-pointer"
                            >
                                {/* Icon box với hiệu ứng hover đổi màu */}
                                <div
                                    className={`w-20 h-20 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 transition-all duration-300 ${feature.hover} shadow-sm group-hover:shadow-md transform group-hover:-translate-y-1`}
                                >
                                    <FontAwesomeIcon
                                        icon={feature.icon}
                                        className="text-3xl"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 1. SLIDER ĐỊA ĐIỂM DU LỊCH (Tourist Places) */}
                {touristPlaces.length > 0 && (
                    <section>
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Địa Điểm Nổi Bật 📸
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Những góc check-in và khám phá không thể bỏ
                                    lỡ
                                </p>
                            </div>
                        </div>
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            breakpoints={carouselBreakpoints}
                            className="pb-4"
                        >
                            {touristPlaces.map((item) => (
                                <SwiperSlide
                                    key={`place-${item.id}`}
                                    className="h-auto pb-4"
                                >
                                    {/* --- TỰ TẠO THẺ ẢNH ĐỊA ĐIỂM --- */}
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <Image
                                            src={
                                                item.coverImageUrl ??
                                                "/Img/ImgNull.jpg"
                                            }
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 flex flex-col gap-2">
                                            <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm opacity-90">
                                                <FontAwesomeIcon
                                                    icon={faMapLocationDot}
                                                    className="text-blue-400"
                                                />
                                                <span className="line-clamp-1">
                                                    {item.address}
                                                </span>
                                            </div>
                                            {item.rating_average && (
                                                <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm font-medium">
                                                    <span>
                                                        ⭐{" "}
                                                        {item.rating_average.toFixed(
                                                            1,
                                                        )}
                                                    </span>
                                                    <span className="text-white opacity-70 font-normal ml-1">
                                                        ({item.favorite_count}{" "}
                                                        thích)
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* --- HẾT PHẦN TỰ TẠO THẺ --- */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                )}

                {/* 2. SLIDER TOUR DU LỊCH (Tours) */}
                {tours.length > 0 && (
                    <section>
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Tour Khám Phá Nổi Bật 🎒
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Trải nghiệm hành trình được lên lịch trình
                                    hoàn hảo
                                </p>
                            </div>
                        </div>
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            breakpoints={carouselBreakpoints}
                            className="pb-4"
                        >
                            {tours.map((item) => (
                                <SwiperSlide
                                    key={`tour-${item.id}`}
                                    className="h-auto pb-4"
                                >
                                    {/* --- TỰ TẠO THẺ ẢNH TOUR --- */}
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <Image
                                            src={
                                                item.coverImageUrl ??
                                                "/Img/ImgNull.jpg"
                                            }
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        {/* Giá tour nổi ở góc trên */}
                                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-bold z-10 shadow-md">
                                            {item.price
                                                ? `${item.price.toLocaleString("vi-VN")} đ`
                                                : "Liên hệ"}
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 flex flex-col gap-2">
                                            <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex flex-wrap items-center gap-3 text-sm opacity-90">
                                                <span className="flex items-center gap-1">
                                                    <FontAwesomeIcon
                                                        icon={faRoute}
                                                        className="text-blue-400"
                                                    />
                                                    {item.durationDays} ngày
                                                </span>
                                                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                                <span className="line-clamp-1">
                                                    {item.vehicle}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* --- HẾT PHẦN TỰ TẠO THẺ --- */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                )}

                {/* 3. SLIDER KHÁCH SẠN (Hotels) */}
                {hotels.length > 0 && (
                    <section>
                        <div className="mb-6 flex justify-between items-end">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900">
                                    Khách Sạn Yêu Thích 🏨
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Chỗ nghỉ ngơi đẳng cấp nhất dành cho bạn
                                </p>
                            </div>
                        </div>
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            breakpoints={carouselBreakpoints}
                            className="pb-4"
                        >
                            {hotels.map((item) => (
                                <SwiperSlide
                                    key={`hotel-${item.id}`}
                                    className="h-auto pb-4"
                                >
                                    {/* --- TỰ TẠO THẺ ẢNH KHÁCH SẠN --- */}
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                        <Image
                                            src={
                                                item.coverImageUrl ??
                                                "/Img/ImgNull.jpg"
                                            }
                                            alt={item.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                                        {/* Tag nổi bật */}
                                        <div className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-lg text-xs font-bold z-10 uppercase tracking-wide">
                                            Được đề xuất
                                        </div>

                                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10 flex flex-col gap-2">
                                            <h3 className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                                                {item.name}
                                            </h3>
                                            <div className="flex items-center gap-2 text-sm opacity-90">
                                                <FontAwesomeIcon
                                                    icon={faHotel}
                                                    className="text-blue-400"
                                                />
                                                <span className="line-clamp-1">
                                                    {item.address}
                                                </span>
                                            </div>
                                            {item.rating_average && (
                                                <div className="flex items-center gap-1 mt-1 text-yellow-400 text-sm font-medium">
                                                    <span>
                                                        ⭐{" "}
                                                        {item.rating_average.toFixed(
                                                            1,
                                                        )}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* --- HẾT PHẦN TỰ TẠO THẺ --- */}
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </section>
                )}
            </div>
        </div>
    );
}
