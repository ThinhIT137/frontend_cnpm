"use client";

import React, { useEffect, useState } from "react";
import { TourProduct } from "../common/TourProduct";
import { TourProps } from "@/types/TourProps";

type ListTourProps = {
    data: TourProps[]; // Chỉ định đích danh TourProps luôn cho sạch
    totalPages: number;
    setSelectedLocation: (loc: [number, number]) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const ListTour = ({
    data,
    totalPages,
    setSelectedLocation,
    currentPage,
    setCurrentPage,
}: ListTourProps) => {
    const [inputPage, setInputPage] = useState(currentPage.toString());

    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const renderList = () => {
        if (!data || data.length <= 0) {
            return (
                <div className="flex flex-col items-center justify-center py-10 bg-white rounded-2xl border border-dashed border-zinc-300 mt-2">
                    <span className="text-3xl mb-2">🚌</span>
                    <span className="text-zinc-500 font-medium text-sm">
                        Không có chuyến tour nào đi qua đây.
                    </span>
                </div>
            );
        }

        return data.map((item) => (
            <TourProduct
                key={item.id}
                {...item}
                onViewMap={() => {
                    if (
                        item.departure?.coords?.[0] &&
                        item.departure?.coords?.[1]
                    ) {
                        setSelectedLocation(item.departure.coords);
                    } else {
                        alert(
                            "Chuyến tour này hiện chưa cập nhật tọa độ khởi hành!",
                        );
                    }
                }}
            />
        ));
    };

    return (
        <div className="flex flex-col gap-4">
            {renderList()}

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-zinc-200">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                            currentPage === 1
                                ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed"
                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}
                    >
                        Trở lại
                    </button>

                    <div className="flex items-center gap-2 text-sm font-medium">
                        <input
                            type="text"
                            value={inputPage}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, "");
                                setInputPage(value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    let value = Number(inputPage);
                                    if (!value || value < 1) value = 1;
                                    if (value > totalPages) value = totalPages;
                                    setCurrentPage(value);
                                }
                            }}
                            className="w-12 text-center border border-zinc-200 rounded-md py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-700 bg-zinc-50"
                        />
                        <span className="text-zinc-400">/ {totalPages}</span>
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${
                            currentPage === totalPages
                                ? "bg-zinc-50 text-zinc-300 border-zinc-100 cursor-not-allowed"
                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                        }`}
                    >
                        Tiếp theo
                    </button>
                </div>
            )}
        </div>
    );
};
