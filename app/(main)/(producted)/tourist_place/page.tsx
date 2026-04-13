"use client";

import { useLoading } from "@/context/LoadingContext";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { List } from "@/components/layouts/List";
import { touristPlaceApi } from "@/app/api/touristPlaceApi";

const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const TouristPlace = () => {
    const { setLoading } = useLoading();

    const [touristPlace, setTouristPlace] = useState<TouristPlaceProps[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await touristPlaceApi({
                page: currentPage,
                pageSize: 10,
            });

            setTouristPlace(res?.items ?? []);
            setTotalPages(res?.totalPages ?? 0);
            setTotalCount(res?.totalCount ?? 0);
        } catch (err) {
            console.log("Lỗi tải địa điểm:", err);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex justify-center">
            <main className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 py-6 px-3 sm:px-4 md:px-6">
                {/* LIST */}
                <div className="w-full lg:w-[380px] xl:w-[420px] bg-white rounded-3xl shadow-lg p-4 flex flex-col max-h-[400px] lg:max-h-[calc(100vh-100px)] overflow-hidden">
                    <h2 className="text-xl font-bold mb-4 text-zinc-800 shrink-0">
                        📍 Địa điểm du lịch
                    </h2>

                    {/* Bọc List trong div có scroll để phân trang không bị tràn ra ngoài */}
                    <div className="flex-1 overflow-y-auto pr-2">
                        <List
                            data={touristPlace}
                            totalPages={totalPages}
                            type="touristPlace"
                            setSelectedLocation={setSelectedLocation}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>

                {/* MAP bên phải */}
                <div className="flex-1 h-[300px] sm:h-[400px] lg:h-[calc(100vh-100px)] lg:sticky lg:top-24 z-10">
                    <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-white">
                        {touristPlace.length > 0 ? (
                            <MapView
                                locations={touristPlace}
                                selectedLocation={selectedLocation}
                                // Default Set View: Có thể thông minh hơn bằng cách lấy tọa độ của địa điểm đầu tiên trong mảng nếu chưa click chọn cái nào
                                LocaltionSetView={
                                    selectedLocation ||
                                    (touristPlace[0]?.latitude
                                        ? [
                                              touristPlace[0].latitude,
                                              touristPlace[0].longitude,
                                          ]
                                        : [15.8, 105.8])
                                }
                                size={5.8}
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-500">
                                Đang tải bản đồ hoặc không có dữ liệu...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TouristPlace;
