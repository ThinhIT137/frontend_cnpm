"use client";

import { useLoading } from "@/context/LoadingContext";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { tourApi } from "@/app/api/tourApi";
import { ListTour } from "@/components/layouts/ListTour";

// Load MapView động giống hệt trang Detail
const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => (
        <p className="h-full w-full flex items-center justify-center text-zinc-400">
            Đang tải bản đồ...
        </p>
    ),
});

const Tour = () => {
    const { setLoading } = useLoading();

    // ĐÃ FIX: Sửa lại tên state cho chuẩn nha ông (từ [tour, tour] -> [tours, setTours])
    const [tours, setTours] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    // State lưu tọa độ để map focus tới khi click vào 1 item trong list
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await tourApi({ page: currentPage, pageSize: 10 });
            console.log(res);
            if (res) {
                setTours(res.items || []);
                setTotalCount(res.totalCount || 0);
                setTotalPages(res.totalPages || 0);
            } else {
                // Nếu api báo lỗi (res bị undefined) thì reset mảng
                setTours([]);
                setTotalCount(0);
                setTotalPages(0);
            }
        } catch (err) {
            console.log(err);
            setTours([]); // Lỗi thì reset mảng
        } finally {
            setLoading(false);
        }
    };

    // Gọi API mỗi khi đổi trang
    useEffect(() => {
        fetchData();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex justify-center">
            {/* Wrapper bung rộng y chang TouristPlaceDetail */}
            <main className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 py-6 px-3 sm:px-4 md:px-6">
                {/* ========================================== */}
                {/* CỘT TRÁI: DANH SÁCH TOUR */}
                {/* ========================================== */}
                <div className="w-full lg:w-[550px] xl:w-[600px] bg-white rounded-3xl shadow-lg p-5 flex flex-col max-h-[85vh] overflow-hidden border border-zinc-100">
                    {/* Header đơn giản cho trang danh sách */}
                    <div className="mb-4 shrink-0">
                        <h1 className="text-2xl font-bold text-zinc-800">
                            🚌 Khám phá Tour Du Lịch
                        </h1>
                        <p className="text-sm text-zinc-500 mt-1">
                            Tìm thấy{" "}
                            <span className="font-bold text-blue-600">
                                {totalCount}
                            </span>{" "}
                            chuyến đi tuyệt vời dành cho bạn
                        </p>
                    </div>

                    {/* HIỂN THỊ DANH SÁCH BẰNG LISTTOUR */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300">
                        {tours.length > 0 ? (
                            <ListTour
                                data={tours}
                                totalPages={totalPages}
                                setSelectedLocation={setSelectedLocation}
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                            />
                        ) : (
                            <div className="text-center py-10 text-zinc-500 text-sm">
                                Hiện chưa có tour nào khả dụng.
                            </div>
                        )}
                    </div>
                </div>

                {/* ========================================== */}
                {/* CỘT PHẢI: BẢN ĐỒ MAP VIEW */}
                {/* ========================================== */}
                <div className="flex-1 flex flex-col gap-4 h-[50vh] lg:h-[calc(100vh-100px)] lg:sticky lg:top-20">
                    <div className="w-full flex-1 rounded-3xl overflow-hidden shadow-md border border-zinc-200 bg-white relative min-h-[300px]">
                        <MapView
                            locations={tours}
                            selectedLocation={selectedLocation}
                            // Default focus vào tọa độ VN nếu chưa click chọn tour nào
                            LocaltionSetView={selectedLocation || [15.8, 105.8]}
                            // Nếu đang chọn 1 điểm thì zoom sát vào (13), không thì zoom tổng quan (6)
                            size={selectedLocation ? 13 : 6}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Tour;
