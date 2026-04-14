"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    contributeComments,
    helpAndSupport,
    Home,
    Login,
    placedAndPrivate,
    profile,
} from "@/constants/router";

export type SearchPayload = {
    type: string;
    keyword: string;
    minPrice?: number;
    maxPrice?: number;
};

interface SearchComponentProps {
    onSearch?: (data: SearchPayload) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onSearch }) => {
    const router = useRouter();
    const path = usePathname();

    if (path === Login) return;
    else if (path === Home) return;
    else if (path === contributeComments) return;
    else if (path === helpAndSupport) return;
    else if (path === placedAndPrivate) return;
    else if (path === profile) return;

    const hiddenRoutes = [
        Login,
        "/resetPassword",
        "/register",
        "/forgotPassword",
    ];
    if (hiddenRoutes.includes(path)) {
        // Nếu trang hiện tại nằm trong mảng hiddenRoutes thì không render Header
        return null;
    }

    const [type, setType] = useState("Tour");
    const [keyword, setKeyword] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(50000000);

    const showPriceFilter = type === "Tour" || type === "Hotel";

    const executeSearch = () => {
        const payload: SearchPayload = {
            type,
            keyword,
            ...(showPriceFilter ? { minPrice, maxPrice } : {}),
        };

        if (onSearch) {
            onSearch(payload);
        } else {
            const params = new URLSearchParams();
            params.append("type", type);

            if (keyword.trim()) {
                params.append("keyword", keyword.trim());
            }

            if (showPriceFilter) {
                params.append("min", minPrice.toString());
                params.append("max", maxPrice.toString());
            }

            router.push(`/search?${params.toString()}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            executeSearch();
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price) + " đ";
    };

    return (
        // ĐÃ XÓA: bg-white, border, shadow, rounded-3xl ở thẻ div ngoài cùng
        // Chỉ giữ lại form layout (max-w-6xl) để nó căn giữa màn hình
        <div className="w-full max-w-6xl mx-auto mt-8 mb-8 px-4 sm:px-0">
            {/* Lớp Grid chứa Danh mục, Từ khóa, Nút */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                {/* Danh mục */}
                <div className="md:col-span-3 w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Danh mục
                    </label>
                    <div className="relative">
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            // Thẻ này vẫn giữ bg-white và shadow nhẹ để nó nổi bần bật lên
                            className="w-full appearance-none bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer font-medium shadow-sm transition-all"
                        >
                            <option value="Tour">🚌 Chuyến Tour</option>
                            <option value="Hotel">🏨 Khách sạn</option>
                            <option value="TouristArea">🏞️ Khu du lịch</option>
                            <option value="TouristPlace">📍 Địa điểm</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                            ▼
                        </div>
                    </div>
                </div>

                {/* Từ khóa */}
                <div className="md:col-span-6 w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Từ khóa tìm kiếm
                    </label>
                    <input
                        type="text"
                        placeholder="Bạn muốn đi đâu? (VD: Đà Nẵng, Hạ Long...)"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown}
                        // Thẻ này cũng bg-white và shadow-sm
                        className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                    />
                </div>

                {/* Nút Search */}
                <div className="md:col-span-3 w-full">
                    <button
                        onClick={executeSearch}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-colors duration-200 shadow-md flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">🔍</span> Tìm kiếm
                    </button>
                </div>
            </div>

            {/* Khối Lọc Giá (Nằm rời bên dưới) */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showPriceFilter
                        ? "max-h-40 mt-6 opacity-100"
                        : "max-h-0 opacity-0"
                }`}
            >
                {/* Cái box lọc giá cũng là 1 khối bg-white độc lập nổi lên */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200 w-full shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                        <label className="text-sm font-bold text-gray-700 whitespace-nowrap">
                            Khoảng giá (VNĐ)
                        </label>
                        <div className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-1.5 rounded-lg whitespace-nowrap border border-blue-100">
                            {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                        </div>
                    </div>

                    <div className="flex items-center gap-8 px-2">
                        {/* Thanh Min */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-gray-500 w-16">
                                    Tối thiểu
                                </span>
                                <input
                                    type="range"
                                    min="0"
                                    max="100000000"
                                    step="500000"
                                    value={minPrice}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val <= maxPrice) setMinPrice(val);
                                    }}
                                    className="w-full cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>

                        {/* Thanh Max */}
                        <div className="flex-1">
                            <div className="flex items-center gap-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="100000000"
                                    step="500000"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val >= minPrice) setMaxPrice(val);
                                    }}
                                    className="w-full cursor-pointer accent-blue-600"
                                />
                                <span className="text-xs font-medium text-gray-500 w-12 text-right">
                                    Tối đa
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchComponent;
