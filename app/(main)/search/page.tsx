"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { searchApi } from "@/app/api/searchApi";
import { useLoading } from "@/context/LoadingContext";

// Import các Component siêu đẹp của sếp vào đây
import { TourProduct } from "@/components/common/TourProduct";
import { TouristAreaProduct } from "@/components/common/TouristAreaProduct";
import { TouristPlaceProduct } from "@/components/common/TouristPlaceProduct";
import { HottelProduct } from "@/components/common/HottelProduct";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const [results, setResults] = useState<any[]>([]); // Đổi thành any[] để hứng trọn vẹn mọi trường data
    const { loading, setLoading } = useLoading();
    const [totalCount, setTotalCount] = useState(0);

    const typeParam = searchParams.get("type") || "Tour";
    const keywordParam = searchParams.get("keyword") || "";
    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    const fetchSearchResults = async () => {
        setLoading(true);
        try {
            const payload = {
                type: typeParam,
                keyword: keywordParam,
                minPrice: minParam ? Number(minParam) : null,
                maxPrice: maxParam ? Number(maxParam) : null,
                page: 1,
                pageSize: 20,
            };

            const resultData = await searchApi.filterData(payload);

            if (resultData.success) {
                // Nhận Data. Chú ý Backend trả về 'items' hay 'Items' thì map cho chuẩn, ở đây mặc định Axios chuyển thành chữ thường 'items'
                const fetchedItems =
                    resultData.data?.items ||
                    (resultData.data as any)?.Items ||
                    [];
                const fetchedCount =
                    resultData.data?.totalCount ||
                    (resultData.data as any)?.TotalCount ||
                    0;

                setResults(fetchedItems);
                setTotalCount(fetchedCount);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API Search:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSearchResults();
    }, [searchParams]);

    // Render Component linh hoạt theo "type"
    const renderProductCard = (item: any, index: number) => {
        const itemType = item.type?.toLowerCase();

        switch (itemType) {
            case "hotel":
                return (
                    <HottelProduct
                        key={index}
                        {...item}
                        onViewMap={() =>
                            console.log("Mở Map Khách sạn:", item.id)
                        }
                    />
                );
            case "tour":
                return (
                    <TourProduct
                        key={index}
                        {...item}
                        onViewMap={() => console.log("Mở Map Tour:", item.id)}
                    />
                );
            case "tourist_area":
                return (
                    <TouristAreaProduct
                        key={index}
                        {...item}
                        onViewMap={() =>
                            console.log("Mở Map Khu du lịch:", item.id)
                        }
                    />
                );
            case "tourist_place":
                return (
                    <TouristPlaceProduct
                        key={index}
                        {...item}
                        onViewMap={() =>
                            console.log("Mở Map Địa điểm:", item.id)
                        }
                    />
                );
            default:
                return (
                    <div
                        key={index}
                        className="bg-red-50 p-4 rounded-xl text-red-500"
                    >
                        Chưa hỗ trợ hiển thị type: {itemType}
                    </div>
                );
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="max-w-7xl mx-auto px-4 mt-8">
                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Tìm thấy{" "}
                        <span className="text-blue-600">{totalCount}</span> kết
                        quả phù hợp
                    </h2>
                </div>

                {loading ? (
                    // Hiệu ứng Loading
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((skeleton) => (
                            <div
                                key={skeleton}
                                className="bg-white p-4 rounded-3xl shadow-sm animate-pulse h-80 border border-gray-100"
                            >
                                <div className="bg-gray-200 h-44 rounded-2xl mb-4 w-full"></div>
                                <div className="bg-gray-200 h-5 rounded w-3/4 mb-3"></div>
                                <div className="bg-gray-200 h-4 rounded w-1/2 mb-4"></div>
                                <div className="flex gap-2">
                                    <div className="bg-gray-200 h-10 rounded-xl flex-1"></div>
                                    <div className="bg-gray-200 h-10 rounded-xl flex-1"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : results.length > 0 ? (
                    // RENDER THẺ SẢN PHẨM THẬT
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {results.map((item, index) =>
                            renderProductCard(item, index),
                        )}
                    </div>
                ) : (
                    // Không có kết quả
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
                        <div className="text-7xl mb-6">🕵️‍♂️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3">
                            Rất tiếc, không tìm thấy kết quả nào!
                        </h3>
                        <p className="text-gray-500 max-w-md">
                            Chúng tôi không tìm thấy từ khóa{" "}
                            <strong>"{keywordParam}"</strong> trong danh mục{" "}
                            <strong>{typeParam}</strong>. Thử điều chỉnh lại từ
                            khóa hoặc nới lỏng khoảng giá xem sao bác nhé!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
