import Image from "next/image";

type TouristAreaProductProps = {
    url: string;
    name: string;
    title: string;
    rating_average: number;
    onViewMap: () => void;
    // onDetail: () => void;
};

export const TouristAreaProduct = ({
    url,
    name,
    title,
    rating_average,
    onViewMap,
    // onDetail,
}: TouristAreaProductProps) => {
    return (
        <>
            <div className="group w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                {/* Image */}
                <div className="relative w-full h-48 overflow-hidden">
                    <Image
                        src={url}
                        alt={name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition"></div>

                    {/* rating */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-semibold text-yellow-500 shadow">
                        ⭐ {rating_average}
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                        {name}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                        {title}
                    </p>

                    {/* Action */}
                    <div className="flex justify-end pt-2">
                        <button
                            onClick={onViewMap}
                            className="text-sm px-4 mr-2 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition"
                        >
                            Xem trên bản đồ
                        </button>
                        <button
                            // onClick={onDetail}
                            className="text-sm px-4 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 active:scale-95 transition"
                        >
                            Xem thêm
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
