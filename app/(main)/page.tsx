"use client";

import { useLoading } from "@/context/LoadingContext";
import Image from "next/image";
import { homeApi } from "../api/homeApi";
import { useEffect, useState } from "react";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useNextRouter } from "@/hooks/useNextRouter";
import { TouristAreaDetail } from "@/constants/router";
import "../home.scss";

export default function Home() {
    const { setLoading } = useLoading();
    const { go } = useNextRouter();
    const [touristAreaTrending, setTouristAreaTrending] = useState<
        TouristAreaProps[]
    >([]);

    const fetch = async () => {
        try {
            setLoading(true);
            const res = await homeApi();
            setTouristAreaTrending(res?.touristArea ?? []);
            console.log(touristAreaTrending);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <>
            <div className="w-full h-screen overflow-hidden">
                {touristAreaTrending.length > 0 ? (
                    <Swiper
                        key={touristAreaTrending.length}
                        loop={true}
                        navigation={true}
                        observer={true}
                        observeParents={true}
                        pagination={{ dynamicBullets: true }}
                        modules={[Pagination, Navigation]}
                        className="w-full h-full overflow-hidden"
                    >
                        {touristAreaTrending.map((items) => (
                            <SwiperSlide
                                className="w-full h-full"
                                key={items.id}
                            >
                                <div
                                    onClick={() => {
                                        go(TouristAreaDetail(items.id));
                                    }}
                                    className="relative w-full h-screen"
                                >
                                    <Image
                                        src={
                                            items.coverImageUrl ??
                                            "/Img/ImgNull.jpg"
                                        }
                                        alt=""
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-32 left-16 text-white z-10">
                                        <h1 className="text-5xl font-bold mb-2">
                                            {items.name}
                                        </h1>
                                        <p className="text-lg opacity-80">
                                            {items.description}
                                        </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="w-full h-screen bg-gray-200 animate-pulse flex items-center justify-center">
                        Đang tải ảnh...
                    </div>
                )}
            </div>
            <div>asdsd</div>
        </>
    );
}
