import { ApiResponseProps } from "@/types/ApiResponseProps";
import { api } from "./api";
import { PagedResultProps } from "@/types/PagedResultProps";
import { TourDetailProps, TourProps } from "@/types/TourProps";

export const tourApi = async ({ page = 1, pageSize = 10 }) => {
    const res = await api.get<ApiResponseProps<PagedResultProps<TourProps>>>(
        "/Tour/tour",
        {
            params: {
                page: page,
                pageSize: pageSize,
            },
        },
    );

    console.log(res);

    if (res.data.success) {
        console.log(res.data.message);
        return res.data.data;
    } else {
        console.log(res.data.message);
    }
};

export const tourDetailApi = async (id: number) => {
    const res = await api.get<ApiResponseProps<TourDetailProps>>(
        "/Tour/detail",
        {
            params: {
                id: id,
            },
        },
    );

    if (res.data.success) {
        console.log(res.data.message);
        return res.data.data;
    } else {
        console.log(res.data.message);
    }
};
