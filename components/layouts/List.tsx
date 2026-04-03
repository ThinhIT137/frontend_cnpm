"use client";

import { PagedResultProps } from "@/types/PagedResultProps";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { TouristAreaProduct } from "../common/TouristAreaProduct";
import React, { useEffect, useState } from "react";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";
import { TouristPlaceProduct } from "../common/TouristPlaceProduct";
import { TourProduct } from "../common/TourProduct";
import { TourProps } from "@/types/TourProps";
import { HottelProduct } from "../common/HottelProduct";
import { HottelProps } from "@/types/HottelProps";

type ListProps<T> = {
    data: T[];
    totalPages: number;
    type: "touristArea" | "hottel" | "touristPlace" | "tour";
    setSelectedLocation: (loc: [number, number]) => void;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
};

export const List = <T,>({
    data,
    totalPages,
    type,
    setSelectedLocation,
    currentPage,
    setCurrentPage,
}: ListProps<T>) => {
    const [inputPage, setInputPage] = useState(currentPage.toString());
    useEffect(() => {
        setInputPage(currentPage.toString());
    }, [currentPage]);

    const render = () => {
        if (type === "touristArea") {
            const items = data as unknown as TouristAreaProps[];

            if (items.length <= 0) {
                return (
                    <>
                        <div>Không có khu du lịch nào </div>
                    </>
                );
            }

            return items.map((item) => (
                <TouristAreaProduct
                    key={item.id}
                    {...item}
                    coverImageUrl={item.coverImageUrl || "/Img/ImgNull.jpg"}
                    onViewMap={() =>
                        setSelectedLocation([item.latitude, item.longitude])
                    }
                />
            ));
        }
        if (type === "touristPlace") {
            const items = data as unknown as TouristPlaceProps[];

            if (items.length <= 0) {
                return (
                    <>
                        <div>Không có địa điểm du lịch nào </div>
                    </>
                );
            }

            return items.map((item) => (
                <TouristPlaceProduct
                    key={item.id}
                    id={item.id}
                    url={item.coverImageUrl || "/Img/ImgNull.jpg"}
                    name={item.name}
                    title={item.description}
                    rating_average={item.rating_average}
                    onViewMap={() =>
                        setSelectedLocation([item.latitude, item.longitude])
                    }
                />
            ));
        }
        if (type === "hottel") {
            const items = data as unknown as HottelProps[];

            if (items.length <= 0) {
                return (
                    <div className="text-zinc-500 text-sm">
                        Không có chuyến tour nào đi qua đây.
                    </div>
                );
            }

            return items.map((item) => (
                <HottelProduct
                    key={item.id}
                    {...item} // Truyền toàn bộ prop của 1 tour vào cho lẹ
                    onViewMap={() => {}}
                />
            ));
        }
    };

    const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <div className="flex flex-col gap-4">
                {render()}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4 mt-6">
                        {/* Prev */}
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={`px-4 py-2 rounded-xl border text-sm transition ${currentPage === 1 ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-white text-blue-500 hover:bg-blue-50"}`}
                        >
                            ⬅️
                        </button>

                        {/* Input Page */}
                        <div className="flex items-center gap-2 text-sm">
                            <input
                                type="text"
                                value={inputPage}
                                onChange={(e) => {
                                    const value = e.target.value.replace(
                                        /\D/g,
                                        "",
                                    );
                                    setInputPage(value);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        let value = Number(inputPage);

                                        if (!value || value < 1) value = 1;
                                        if (value > totalPages)
                                            value = totalPages;

                                        setCurrentPage(value);
                                    }
                                }}
                                className="w-16 text-zinc-600 text-center border rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <span className="text-zinc-600">
                                / {totalPages}
                            </span>
                        </div>

                        {/* Next */}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={`px-4 py-2 rounded-xl border text-sm transition ${currentPage === totalPages ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-white text-blue-500 hover:bg-blue-50"}`}
                        >
                            ➡️
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};
