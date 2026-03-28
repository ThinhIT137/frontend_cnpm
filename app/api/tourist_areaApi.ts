import { ApiResponseProps } from "@/types/interface/ApiResponseProps";
import { api } from "./api";
import { TouristAreaProps } from "@/types/interface/TouristAreaProps";
import { PageRequestProps } from "@/types/PageRequestProps";
import { PagedResultProps } from "@/types/PagedResultProps";

export const tourist_areaApi = async ({ page, pageSize }: PageRequestProps) => {
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
