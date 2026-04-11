"use client";

import { useLoading } from "@/context/LoadingContext";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { getListHottelApi } from "@/app/api/hottelApi";
import { ListHottel } from "@/components/layouts/ListHottel";
import { HottelProps } from "@/types/HottelProps";

// Load MapView động
const MapView = dynamic(() => import("@/components/layouts/MapView"), {
    ssr: false,
    loading: () => <p>Đang tải bản đồ...</p>,
});

const Hottel = () => {
    const { setLoading } = useLoading();

    // States lưu trữ dữ liệu
    const [listData, setListData] = useState<HottelProps[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedLocation, setSelectedLocation] = useState<
        [number, number] | null
    >(null);

    // Hàm gọi API lấy danh sách KS (có phân trang)
    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await getListHottelApi({
                page: currentPage,
                pageSize: 10,
            });

            if (res.success) {
                setListData(res.data.items ?? []);
                setTotalPages(res.data.totalPages ?? 0);
            }
        } catch (err) {
            console.error(err);
            setListData([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    // Khi chuyển trang -> Xóa vị trí đang focus trên map và gọi lại API
    useEffect(() => {
        setSelectedLocation(null);
        fetchData();
    }, [currentPage]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex justify-center">
            <main className="flex flex-col lg:flex-row w-full max-w-7xl gap-6 py-6 px-3 sm:px-4 md:px-6">
                {/* CỘT TRÁI: DANH SÁCH KHÁCH SẠN */}
                <div className="w-full lg:w-[550px] xl:w-[600px] bg-white rounded-3xl shadow-lg p-5 flex flex-col max-h-[85vh] border border-zinc-100">
                    {/* Header Trang */}
                    <div className="mb-4 shrink-0 border-b border-zinc-100 pb-4">
                        <h1 className="text-2xl font-bold text-zinc-800 flex items-center gap-2">
                            <span>🏨</span> Khách sạn
                        </h1>
                        <p className="text-sm text-zinc-500 mt-2">
                            Khám phá những điểm dừng chân tuyệt vời nhất, từ khu
                            nghỉ dưỡng sang trọng đến homestay mộc mạc.
                        </p>
                    </div>

                    {/* HIỂN THỊ DANH SÁCH */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300">
                        <ListHottel
                            data={listData}
                            totalPages={totalPages}
                            setSelectedLocation={setSelectedLocation}
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                        />
                    </div>
                </div>

                {/* CỘT PHẢI: BẢN ĐỒ */}
                <div className="flex-1 h-[400px] lg:h-[calc(100vh-100px)] lg:sticky lg:top-20">
                    <div className="w-full h-full rounded-3xl overflow-hidden shadow-xl border border-zinc-200 bg-white relative">
                        {listData.length > 0 ? (
                            <MapView
                                locations={listData} // Quăng list khách sạn vào để hiện marker
                                selectedLocation={selectedLocation}
                                // View mặc định là toàn cảnh Việt Nam, nếu có click vào thẻ thì nó tự focus
                                LocaltionSetView={[15.8, 105.8]}
                                size={5.5}
                            />
                        ) : (
                            <div className="w-full h-full bg-zinc-100 animate-pulse flex items-center justify-center text-zinc-500">
                                Đang tải dữ liệu bản đồ...
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Hottel;
