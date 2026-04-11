"use client";

import { touristAreaDetailApi } from "@/app/api/tourist_area_detailApi";
import { useLoading } from "@/context/LoadingContext";
import { PagedResultProps } from "@/types/PagedResultProps";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { TourProps } from "@/types/TourProps";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { List } from "@/components/layouts/List";
import { ListTour } from "@/components/layouts/ListTour";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import Image from "next/image";

// Load MapView động
const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const TouristAreaDetailPage = () => {
    const [isOpen, setIsOpen] = useState(false);
    const searchParams = useSearchParams();
    const { setLoading } = useLoading();

    const [touristArea, setTouristArea] = useState<TouristAreaProps | null>(
        null,
    );
    const [touristPlace, setTouristPlace] = useState<TouristPlaceProps[]>([]);
    const [tour, setTour] = useState<TourProps[]>([]);

    const [typeDetail, setTypeDetail] = useState<"TouristPlace" | "Tour">(
        "TouristPlace",
    );
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    const TouristAreaId = Number(searchParams.get("id"));

    const fetchData = async () => {
        if (!TouristAreaId) return;
        try {
            setLoading(true);
            const res = await touristAreaDetailApi({
                id: TouristAreaId,
                type: typeDetail,
                page: currentPage,
                pageSize: 10,
            });

            // Gán dữ liệu khu du lịch
            setTouristArea(res?.tourist_Area_Detail ?? null);

            // Gán dữ liệu danh sách tùy theo Tab
            if (typeDetail === "TouristPlace") {
                const pagedTouristPlace =
                    res?.pagedResult as unknown as PagedResultProps<TouristPlaceProps>;
                setTouristPlace(pagedTouristPlace?.items ?? []);
                setTotalCount(pagedTouristPlace?.totalCount ?? 0);
                setTotalPages(pagedTouristPlace?.totalPages ?? 0);
            } else {
                const pagedTour =
                    res?.pagedResult as unknown as PagedResultProps<TourProps>;
                setTour(pagedTour?.items ?? []);
                setTotalCount(pagedTour?.totalCount ?? 0);
                setTotalPages(pagedTour?.totalPages ?? 0);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentPage(1);
        setSelectedLocation(null);
    }, [typeDetail]);

    useEffect(() => {
        fetchData();
    }, [currentPage, typeDetail, TouristAreaId]);

    const currentMapLocations =
        typeDetail === "TouristPlace" ? touristPlace : tour;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex justify-center">
            <main className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 py-6 px-3 sm:px-4 md:px-6">
                {/* CỘT TRÁI: DANH SÁCH ĐỊA ĐIỂM / TOUR */}
                <div className="w-full lg:w-[550px] xl:w-[600px] bg-white rounded-3xl shadow-lg p-5 flex flex-col max-h-[85vh] overflow-hidden border border-zinc-100">
                    <div className="mb-4 shrink-0">
                        <h2 className="text-2xl font-bold text-zinc-800 line-clamp-1">
                            📍 {touristArea?.name || "Đang tải..."}
                        </h2>
                    </div>

                    <div className="flex gap-2 mb-4 bg-zinc-100 p-1 rounded-xl shrink-0">
                        <button
                            onClick={() => setTypeDetail("TouristPlace")}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                                typeDetail === "TouristPlace"
                                    ? "bg-white shadow text-blue-600"
                                    : "text-zinc-500 hover:text-zinc-700"
                            }`}
                        >
                            📍 Địa điểm tham quan
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

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300 font-sans">
                        {typeDetail === "TouristPlace" ? (
                            touristPlace.length > 0 ? (
                                <List
                                    data={touristPlace}
                                    totalPages={totalPages}
                                    type="touristPlace"
                                    setSelectedLocation={setSelectedLocation}
                                    currentPage={currentPage}
                                    setCurrentPage={setCurrentPage}
                                />
                            ) : (
                                <div className="text-center py-10 text-zinc-500 text-sm">
                                    Hiện chưa có địa điểm nào.
                                </div>
                            )
                        ) : tour.length > 0 ? (
                            <ListTour
                                data={tour}
                                totalPages={totalPages}
                                setSelectedLocation={setSelectedLocation}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        ) : (
                            <div className="text-center py-10 text-zinc-500 text-sm">
                                Hiện chưa có tour nào.
                            </div>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: CARD THÔNG TIN + MAP */}
                <div className="flex-1 flex flex-col gap-4 h-auto lg:h-[calc(100vh-100px)] lg:sticky lg:top-20">
                    {/* CỤC THÔNG TIN KHU DU LỊCH (NẰM TRÊN MAP) */}
                    {touristArea && (
                        <div className="w-full bg-white rounded-3xl shadow-md border border-zinc-100 p-4 flex gap-4 items-center shrink-0">
                            <div
                                onClick={() => setIsOpen(true)}
                                className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-sm border border-zinc-100 cursor-pointer group bg-zinc-50"
                            >
                                <Image
                                    src={
                                        touristArea.coverImageUrl ||
                                        "/Img/ImgNull.jpg"
                                    }
                                    alt={touristArea.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xl">
                                    🖼️
                                </div>
                            </div>

                            <div className="flex flex-col flex-1 gap-1">
                                <h2 className="text-xl sm:text-2xl font-black text-zinc-900 leading-tight line-clamp-1">
                                    {touristArea.name}
                                </h2>
                                <p className="text-sm text-zinc-500 line-clamp-1 flex items-center gap-1 mt-0.5">
                                    <span className="text-red-400">📍</span>
                                    {touristArea.address ||
                                        "Đang cập nhật địa chỉ..."}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                        <span className="text-yellow-500">
                                            ⭐
                                        </span>
                                        {touristArea.rating_average
                                            ? touristArea.rating_average.toFixed(
                                                  1,
                                              )
                                            : "5.0"}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                                        <span className="text-red-500">❤️</span>
                                        {touristArea.favorite_count || 0}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-800 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                                        <span className="text-orange-500">
                                            🔥
                                        </span>
                                        {touristArea.click_count || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BẢN ĐỒ */}
                    <div className="w-full flex-1 rounded-3xl overflow-hidden shadow-md border border-zinc-200 bg-white relative min-h-[350px]">
                        {touristArea ? (
                            <MapView
                                locations={currentMapLocations}
                                selectedLocation={selectedLocation}
                                LocaltionSetView={[
                                    touristArea.latitude ?? 15.8,
                                    touristArea.longitude ?? 105.8,
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

                {/* MODAL XEM ẢNH */}
                {isOpen && touristArea && (
                    <div
                        className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center backdrop-blur-sm p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <button className="absolute top-4 right-4 text-white text-4xl p-2">
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
                                className="w-full h-[80vh] rounded-lg"
                            >
                                {(touristArea.images?.length
                                    ? touristArea.images
                                    : [
                                          {
                                              url:
                                                  touristArea.coverImageUrl ||
                                                  "/Img/ImgNull.jpg",
                                          },
                                      ]
                                ).map((img: any, index: number) => (
                                    <SwiperSlide key={index}>
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={img.url || img}
                                                alt={`Image ${index + 1}`}
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
            </main>
        </div>
    );
};

export default TouristAreaDetailPage;
