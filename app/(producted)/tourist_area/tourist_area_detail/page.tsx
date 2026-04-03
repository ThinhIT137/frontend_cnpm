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
import { ListTour } from "@/components/layouts/ListTour"; // Import thêm ListTour

const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const touris_are_detail = () => {
    const searchParams = useSearchParams();
    const { setLoading } = useLoading();

    const [touristArea, setTouristArea] = useState<TouristAreaProps | null>(
        null,
    );
    const [touristPlace, setTouristPlace] = useState<TouristPlaceProps[]>([]);
    const [tour, setTour] = useState<TourProps[]>([]);

    // Cập nhật typeDetail thành Union type để dễ quản lý tab
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

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await touristAreaDetailApi({
                id: TouristAreaId,
                type: typeDetail,
                page: currentPage,
                pageSize: 10,
            });

            setTouristArea(res?.tourist_Area_Detail ?? null);

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
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // Reset lại page = 1 và bỏ chọn vị trí khi đổi tab
    useEffect(() => {
        setCurrentPage(1);
        setSelectedLocation(null);
    }, [typeDetail]);

    // Gọi API mỗi khi page hoặc tab thay đổi
    useEffect(() => {
        fetch();
    }, [currentPage, typeDetail]);

    // Xác định dữ liệu đang được hiển thị (để truyền vào bản đồ)
    const currentMapLocations =
        typeDetail === "TouristPlace" ? touristPlace : tour;

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex justify-center">
            <main className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 py-6 px-3 sm:px-4 md:px-6">
                {/* LIST BÊN TRÁI: Kéo rộng ra giống bản mẫu để hiển thị ListTour đẹp hơn */}
                <div className="w-full lg:w-[550px] xl:w-[600px] bg-white rounded-3xl shadow-lg p-5 flex flex-col max-h-[85vh] overflow-hidden border border-zinc-100">
                    <div className="mb-4 shrink-0">
                        <h2 className="text-2xl font-bold text-zinc-800">
                            📍 {touristArea?.name || "Khu Du Lịch"}
                        </h2>
                    </div>

                    {/* TABS CHUYỂN ĐỔI ĐỊA ĐIỂM / TOUR */}
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

                    {/* HIỂN THỊ DANH SÁCH SẢN PHẨM */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300">
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

                {/* MAP BÊN PHẢI */}
                <div className="flex-1 h-[300px] sm:h-[400px] lg:h-[calc(100vh-100px)] lg:sticky lg:top-20">
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl border border-zinc-200 bg-white">
                        {currentMapLocations.length > 0 || touristArea ? (
                            <MapView
                                locations={currentMapLocations}
                                selectedLocation={selectedLocation}
                                LocaltionSetView={[
                                    touristArea?.latitude ?? 15.8,
                                    touristArea?.longitude ?? 105.8,
                                ]}
                                size={10}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-500">
                                Đang tải bản đồ...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default touris_are_detail;
