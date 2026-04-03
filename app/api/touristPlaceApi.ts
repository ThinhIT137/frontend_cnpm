import { ApiResponseProps } from "@/types/ApiResponseProps";
import { api } from "./api";
import { TouristPlaceProps } from "@/types/TouristPlaceProps";
import { PagedResultProps } from "@/types/PagedResultProps";

export const touristPlaceApi = async ({ page = 1, pageSize = 10 }) => {
    const res = await api.get<
        ApiResponseProps<PagedResultProps<TouristPlaceProps>>
    >("/TouristPlace/tourist_place", {
        params: {
            page: page,
            pageSize: pageSize,
        },
    });

    if (res.data.success) {
        console.log(res.data.message);
        return res.data.data;
    }
};
