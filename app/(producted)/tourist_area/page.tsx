"use client";

import { Loading } from "@/components/common/LoadingComponent";
import Header from "@/components/layouts/Header";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { TouristAreaProps } from "@/types/interface/TouristAreaProps";
import { TouristAreaProduct } from "@/components/common/TouristAreaProduct";
import { useSearchParams } from "next/navigation";
import { tourist_areaApi } from "@/app/api/tourist_areaApi";

const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const tourist_area = () => {
    const [loading, setLoading] = useState(false);
    const [tourist_area_data, setTourist_area_data] = useState<
        TouristAreaProps[]
    >([]);
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    // const searchParams = new URLSearchParams(window.location.search);
    const searchParams = useSearchParams();
    const fetchTourist_Area = async () => {
        try {
            setLoading(true);
            const res = await tourist_areaApi({
                page: currentPage,
                pageSize: 10,
            });
            console.log(res);
            setTotalCount(res?.totalCount ?? 0);
            setTotalPages(res?.totalPages ?? 0);
            setTourist_area_data(res?.items ?? []);
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

    const renderTourist_Area = () => {
        if (tourist_area_data == null) {
            alert("null");
        }

        return tourist_area_data.map((item) => (
            <TouristAreaProduct
                key={item.id}
                url={item.coverImageUrl || "/Img/ImgNull.jpg"}
                name={item.name}
                title={item.description}
                rating_average={item.rating_average}
                onViewMap={() =>
                    setSelectedLocation([item.latitude, item.longitude])
                }
            />
        ));
    };

    const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 font-sans flex justify-center">
                <main className="flex w-full max-w-7xl gap-8 py-10 px-6">
                    {/* LIST bên trái */}
                    <div className="w-[420px] flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300">
                        {renderTourist_Area()}

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 gap-2">
                                {pageButtons.map((pageNum) => (
                                    <button
                                        key={pageNum}
                                        className={`px-3 py-1 border rounded ${currentPage === pageNum ? "bg-red-500 text-white" : "bg-white text-red-500"}`}
                                        onClick={() => setCurrentPage(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* MAP bên phải */}
                    <div className="flex-1 sticky top-24 h-[650px]">
                        <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-white">
                            {tourist_area_data.length > 0 ? (
                                <MapView
                                    locations={tourist_area_data}
                                    selectedLocation={selectedLocation}
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
            {loading && <Loading />}
        </>
    );
};

export default tourist_area;
