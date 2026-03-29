"use client";

import { PagedResultProps } from "@/types/PagedResultProps";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { TouristAreaProduct } from "../common/TouristAreaProduct";
import React, { useState } from "react";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";

type ListProps<T> = {
    data: T[];
    totalPages: number;
    type: "touristArea" | "hotel" | "touristPlace" | "tour";
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
                <TouristAreaProduct
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
    };

    const pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <>
            <div className="w-[420px] flex flex-col gap-5 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-300">
                {render()}

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
        </>
    );
};
