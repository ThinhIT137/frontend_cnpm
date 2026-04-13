import { ApiResponseProps } from "@/types/ApiResponseProps";
import { api } from "./api";
import { TouristAreaProps } from "@/types/TouristAreaProps";
import { PageRequestProps } from "@/types/PageRequestProps";
import { PagedResultProps } from "@/types/PagedResultProps";

export const tourist_areaApi = async ({ page, pageSize }: PageRequestProps) => {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
    if (token) {
        console.log("tourist_area_user");

        const res = await api.get<
            ApiResponseProps<PagedResultProps<TouristAreaProps>>
        >("/TouristArea/tourist_area_user", {
            params: {
                page,
                pageSize,
            },
        });
        if (res.data.success) {
            console.log(res.data.message);
            return res.data.data;
        }
        return;
    }

    console.log("tourist_area");

    const res = await api.get<
        ApiResponseProps<PagedResultProps<TouristAreaProps>>
    >("/TouristArea/tourist_area", {
        params: {
            page,
            pageSize,
        },
    });
    if (res.data.success) {
        console.log(res.data.message);
        return res.data.data;
    }
};
