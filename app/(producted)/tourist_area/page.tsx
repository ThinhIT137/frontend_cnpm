"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { TouristAreaProduct } from "@/components/common/TouristAreaProduct";
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
            <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 font-sans flex justify-center ">
                <main className="flex w-full max-w-7xl gap-8 py-10 px-6">
                    {/* LIST bên trái */}
                    <List
                        data={tourist_area_data}
                        totalPages={totalPages}
                        type="touristArea"
                        setSelectedLocation={setSelectedLocation}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                    />

                    {/* MAP bên phải */}
                    <div className="flex-1 sticky top-24 h-[650px]">
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
