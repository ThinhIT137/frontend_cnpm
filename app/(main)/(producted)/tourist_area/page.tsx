"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { useSearchParams } from "next/navigation";
import { tourist_areaApi } from "@/app/api/tourist_areaApi";
import { useLoading } from "@/context/LoadingContext";
import { List } from "@/components/layouts/List";

const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const tourist_area = () => {
    const { setLoading } = useLoading();
    const [tourist_area_data, setTourist_area_data] = useState<
        TouristAreaProps[]
    >([]);
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const searchParams = useSearchParams();
    const fetchTourist_Area = async () => {
        try {
            setLoading(true);
            const res = await tourist_areaApi({
                page: currentPage,
                pageSize: 10,
            });
            console.log(res);
            setTourist_area_data(res?.items ?? []);
            setTotalCount(res?.totalCount ?? 0);
            setTotalPages(res?.totalPages ?? 0);
            console.log(res?.items);
        } catch (err) {
            console.log(err);
            setLoading(false);
            alert("Lỗi");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTourist_Area();
    }, [currentPage]);

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex justify-center">
                <main className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 py-6 px-3 sm:px-4 md:px-6">
                    {/* LIST */}
                    <div className="w-full lg:w-[380px] xl:w-[420px] bg-white rounded-3xl shadow-lg p-4 flex flex-col max-h-[400px] lg:max-h-none overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4 text-zinc-800">
                            📍 Khu du lịch
                        </h2>
                        {/* LIST bên trái */}
                        <List
                            data={tourist_area_data}
                            totalPages={totalPages}
                            type="touristArea"
                            setSelectedLocation={setSelectedLocation}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                    {/* MAP bên phải */}
                    <div className="flex-1 h-[300px] sm:h-[400px] lg:h-[650px] lg:sticky lg:top-24 z-10">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-white">
                            {tourist_area_data.length > 0 ? (
                                <MapView
                                    locations={tourist_area_data}
                                    selectedLocation={selectedLocation}
                                    LocaltionSetView={[15.8, 105.8]}
                                    size={5.8}
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
        </>
    );
};

export default tourist_area;
