import { touristAreaDetailResponseProps } from "@/types/TouristAreaDetalResponseProps";
import { api } from "./api";
import { ApiResponseProps } from "@/types/ApiResponseProps";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";
import { TourProps } from "@/types/TourProps";

type touristArea = {
    id: number;
    type: string | "Tour" | "TouristPlace";
    page: number;
    pageSize: number;
};

export const touristAreaDetailApi = async ({
    id,
    type,
    page,
    pageSize,
}: touristArea) => {
    if (type === "TouristPlace") {
        const res = await api.post<
            ApiResponseProps<touristAreaDetailResponseProps<TouristPlaceProps>>
        >("/TouristArea/DetailTouristAreaUser", {
            id: id,
            type: type,
            TourismProduct: {
                page: page,
                pageSize: pageSize,
            },
        });
        const data = res.data;
        if (data.success) {
            console.log(data.message);
            return data.data;
        } else {
            console.log(res.data.message);
        }
    }

    const res = await api.post<
        ApiResponseProps<touristAreaDetailResponseProps<TourProps>>
    >("/TouristArea/DetailTouristArea", {
        id: id,
        type: type,
        TourismProduct: {
            page: page,
            pageSize: pageSize,
        },
    });
    const data = res.data;
    if (data.success) {
        console.log(data.message);
        return data.data;
    } else {
        console.log(res.data.message);
    }
};
