"use client";

import { useLoading } from "@/context/LoadingContext";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { touristPlaceDetailApi } from "@/app/api/touristPlaceDetailApi";
import { ListTour } from "@/components/layouts/ListTour";
import { ListHottel } from "@/components/layouts/ListHottel";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import ReviewSection, { UserProps } from "@/components/layouts/ReviewSection";

// 🔴 IMPORT MODAL REPORT VÀ FONT AWESOME
import ReportModal from "@/components/layouts/ReportModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import { profileApi } from "@/app/api/profileApi";

// Load MapView động
const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const TouristPlaceDetail = () => {
    const searchParams = useSearchParams();
    const placeId = Number(searchParams.get("id"));
    const { setLoading } = useLoading();
    const [isOpen, setIsOpen] = useState(false);

    // State lưu thông tin địa điểm
    const [placeDetail, setPlaceDetail] = useState<any>(null);

    // State lưu danh sách (Khách sạn hoặc Tour tùy tab)
    const [listData, setListData] = useState<any[]>([]);

    // State điều khiển giao diện
    const [typeDetail, setTypeDetail] = useState<"Hotel" | "Tour">("Hotel");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    const [currentUser, setCurrentUser] = useState<UserProps | null>(null);

    // 🔴 STATE CHO REPORT VÀ FAVORITE
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

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
        if (!placeId) return;
        try {
            setLoading(true);
            const res = await touristPlaceDetailApi({
                id: placeId,
                type: typeDetail,
                page: currentPage,
                pageSize: 10,
            });

            if (res.success) {
                // Set thông tin chung của địa điểm
                if (!placeDetail) setPlaceDetail(res.tourist_Place_Detail);

                // 🔴 Lấy isFavorite từ API (Sửa lại tên biến cho đúng chuẩn trả về)
                setIsLiked(res.tourist_Place_Detail?.isFavorite ?? false);

                // Set data cho List
                setListData(res.pagedResult?.items ?? []);
                setTotalPages(res.pagedResult?.totalPages ?? 0);
            }
        } catch (err) {
            setListData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Reset lại page = 1 khi đổi tab
    useEffect(() => {
        setCurrentPage(1);
        setSelectedLocation(null);
    }, [typeDetail]);

    // Gọi API mỗi khi page hoặc type thay đổi
    useEffect(() => {
        fetchData();
    }, [currentPage, typeDetail, placeId]);

    // 🔴 HÀM XỬ LÝ THẢ TIM CHO ĐỊA ĐIỂM (TOURIST PLACE)
    const handleToggleLike = async () => {
        if (!currentUser)
            return alert("Vui lòng đăng nhập để thả tim nha sếp!");

        // Optimistic UI
        setIsLiked(!isLiked);
        if (placeDetail) {
            setPlaceDetail((prev: any) =>
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
                EntityId: placeId, // Đổi từ TouristAreaId thành placeId
                EntityType: "tourist_place", // Đổi thành tourist_place
            });
            if (res && res.success) {
                console.log("Đã thả tim trên server:", res.isFavorite);
            }
        } catch (error) {
            // Nếu lỗi thì vả lại trạng thái cũ
            setIsLiked(isLiked);
            if (placeDetail) {
                setPlaceDetail((prev: any) =>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 pb-12">
            <div className="max-w-7xl mx-auto flex flex-col px-3 sm:px-4 md:px-6">
                <div className="flex flex-col lg:flex-row w-full gap-6 py-6">
                    {/* CỘT TRÁI */}
                    <div className="w-full lg:w-[550px] xl:w-[600px] bg-white rounded-3xl shadow-lg p-5 flex flex-col max-h-[85vh] overflow-hidden border border-zinc-100">
                        {/* Header thông tin địa điểm */}
                        <div className="mb-4 shrink-0">
                            <h1 className="text-2xl font-bold text-zinc-800 line-clamp-1">
                                📍 {placeDetail?.name || "Đang tải..."}
                            </h1>
                            <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
                                {placeDetail?.description}
                            </p>
                        </div>

                        {/* TABS */}
                        <div className="flex gap-2 mb-4 bg-zinc-100 p-1 rounded-xl shrink-0">
                            <button
                                onClick={() => setTypeDetail("Hotel")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                    typeDetail === "Hotel"
                                        ? "bg-white shadow text-blue-600"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                🏨 Khách sạn
                            </button>
                            <button
                                onClick={() => setTypeDetail("Tour")}
                                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                    typeDetail === "Tour"
                                        ? "bg-white shadow text-blue-600"
                                        : "text-zinc-500 hover:text-zinc-700"
                                }`}
                            >
                                🚌 Tour du lịch
                            </button>
                        </div>

                        {/* DANH SÁCH */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300">
                            {listData.length > 0 ? (
                                typeDetail === "Tour" ? (
                                    <ListTour
                                        data={listData}
                                        totalPages={totalPages}
                                        setSelectedLocation={
                                            setSelectedLocation
                                        }
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                ) : (
                                    <ListHottel
                                        data={listData}
                                        totalPages={totalPages}
                                        setSelectedLocation={
                                            setSelectedLocation
                                        }
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                    />
                                )
                            ) : (
                                <div className="text-center py-10 text-zinc-500 text-sm">
                                    Hiện chưa có{" "}
                                    {typeDetail === "Hotel"
                                        ? "khách sạn"
                                        : "tour"}{" "}
                                    nào.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CỘT PHẢI */}
                    <div className="flex-1 flex flex-col gap-4 h-auto lg:h-[calc(100vh-100px)] lg:sticky lg:top-20">
                        {placeDetail && (
                            <div className="w-full bg-white rounded-3xl shadow-md border border-zinc-100 p-5 shrink-0 flex gap-5 items-start relative">
                                {/* 🔴 NÚT REPORT */}
                                <button
                                    onClick={() => setIsReportOpen(true)}
                                    title="Báo cáo nội dung xấu"
                                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-red-500 transition-colors z-10"
                                >
                                    <FontAwesomeIcon icon={faFlag} />
                                </button>

                                {/* Ảnh */}
                                <div
                                    onClick={() => setIsOpen(true)}
                                    className="relative w-36 h-36 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 cursor-pointer group"
                                >
                                    <Image
                                        src={
                                            placeDetail.coverImageUrl ||
                                            "/Img/ImgNull.jpg"
                                        }
                                        alt={placeDetail.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-2xl">
                                        🖼️
                                    </div>
                                </div>

                                {/* Chi tiết */}
                                <div className="flex flex-col flex-1 gap-1.5 pt-1 pr-6">
                                    <h2 className="text-2xl font-black text-zinc-900 leading-tight">
                                        {placeDetail.name}
                                    </h2>
                                    <p className="text-base text-zinc-600 line-clamp-2 leading-relaxed flex items-start gap-1.5 mt-1">
                                        <span className="mt-0.5">📍</span>
                                        <span>
                                            {placeDetail.address ||
                                                "Đang cập nhật địa chỉ..."}
                                        </span>
                                    </p>

                                    {/* 🔴 NÚT TIM, SAO, VIEW */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3">
                                        <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-800 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                                            <span className="text-yellow-500">
                                                ⭐
                                            </span>
                                            {placeDetail.rating_average > 0
                                                ? placeDetail.rating_average.toFixed(
                                                      1,
                                                  )
                                                : "5.0"}
                                        </div>

                                        <button
                                            onClick={handleToggleLike}
                                            className={`flex items-center gap-1.5 text-sm font-bold px-2.5 py-1 rounded-lg border transition-colors active:scale-95 ${
                                                isLiked
                                                    ? "bg-red-500 text-white border-red-600"
                                                    : "bg-red-50 text-zinc-800 border-red-100 hover:bg-red-100"
                                            }`}
                                        >
                                            <span
                                                className={
                                                    isLiked
                                                        ? "text-white animate-bounce"
                                                        : "text-red-500"
                                                }
                                            >
                                                ❤️
                                            </span>
                                            {placeDetail.favorite_count || 0}{" "}
                                            lượt thích
                                        </button>

                                        <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-800 bg-zinc-50 px-2.5 py-1 rounded-lg border border-zinc-100">
                                            <span className="text-blue-500">
                                                🔥
                                            </span>
                                            {placeDetail.click_count || 0} người
                                            xem
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* MAP VIEW */}
                        <div className="w-full flex-1 rounded-3xl overflow-hidden shadow-md border border-zinc-200 bg-white relative min-h-[300px]">
                            {placeDetail ? (
                                <MapView
                                    locations={listData}
                                    selectedLocation={selectedLocation}
                                    LocaltionSetView={[
                                        placeDetail.latitude ?? 15.8,
                                        placeDetail.longitude ?? 105.8,
                                    ]}
                                    size={12}
                                />
                            ) : (
                                <div className="w-full h-full bg-zinc-50 animate-pulse flex items-center justify-center text-zinc-400">
                                    Đang tải bản đồ...
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔴 REVIEW SECTION */}
                {placeDetail && (
                    <div className="w-full mt-4">
                        <ReviewSection
                            entityId={placeDetail.id}
                            entityType="tourist_place"
                            currentUser={currentUser}
                            onReviewSuccess={fetchData}
                        />
                    </div>
                )}
            </div>

            {/* 🔴 MODAL REPORT */}
            {placeDetail && (
                <ReportModal
                    isOpen={isReportOpen}
                    onClose={() => setIsReportOpen(false)}
                    entityId={placeDetail.id}
                    entityType="tourist_place"
                />
            )}

            {/* MODAL XEM ẢNH */}
            {isOpen && placeDetail && (
                <div
                    className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center backdrop-blur-sm transition-opacity p-4"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white text-4xl hover:text-gray-400 transition z-[1000] p-2"
                    >
                        &times;
                    </button>

                    <div
                        className="w-full max-w-6xl h-full flex items-center justify-center"
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
                            className="w-full h-[80vh] rounded-lg"
                        >
                            {(placeDetail.images?.length
                                ? placeDetail.images
                                : [
                                      {
                                          url:
                                              placeDetail.coverImageUrl ||
                                              "/Img/ImgNull.jpg",
                                      },
                                  ]
                            ).map((img: any, index: number) => (
                                <SwiperSlide key={index}>
                                    <div className="relative w-full h-full flex items-center justify-center">
                                        <Image
                                            src={img.url || img}
                                            alt={`Place image ${index + 1}`}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TouristPlaceDetail;
