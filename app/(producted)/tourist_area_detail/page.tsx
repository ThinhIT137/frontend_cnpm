"use client";

import { touristAreaDetailApi } from "@/app/api/tourist_area_detailApi";
import { useLoading } from "@/context/LoadingContext";
import { PagedResultProps } from "@/types/PagedResultProps";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { TourProps } from "@/types/TourProps";
import { List } from "@/components/layouts/List";

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

    const [typeDetail, setTypeDetail] = useState("TouristPlace");

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
            if (typeDetail === "TouristPlace") {
                const pagedTouristPlace =
                    res?.pagedResult as unknown as PagedResultProps<TouristPlaceProps>;
                setTouristArea(res?.tourist_Area_Detail ?? null);
                setTouristPlace(pagedTouristPlace?.items ?? []);
                setTotalCount(pagedTouristPlace?.totalCount ?? 0);
                setTotalPages(pagedTouristPlace?.totalPages ?? 0);
            } else {
                const pagedTour =
                    res?.pagedResult as unknown as PagedResultProps<TourProps>;
                setTouristArea(res?.tourist_Area_Detail ?? null);
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

    useEffect(() => {
        fetch();
    }, [currentPage]);

    return (
        <>
            {typeDetail === "TouristPlace" && (
                <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 font-sans flex justify-center ">
                    <main className="flex w-full max-w-7xl gap-8 py-10 px-6">
                        {/* LIST bên trái */}
                        <List
                            data={touristPlace}
                            totalPages={totalPages}
                            type="touristPlace"
                            setSelectedLocation={setSelectedLocation}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />

                        {/* MAP bên phải */}
                        <div className="flex-1 sticky top-24 h-[650px]">
                            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border border-zinc-200 bg-white">
                                {touristPlace.length > 0 ? (
                                    <MapView
                                        locations={touristPlace}
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
            )}
            ad
        </>
    );
};

export default touris_are_detail;
