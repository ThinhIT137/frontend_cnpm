import { api } from "./api";

interface TouristPlaceDetailReq {
    id: number;
    type: string; // "Hotel" hoặc "Tour"
    page: number;
    pageSize: number;
}

export const touristPlaceDetailApi = async (data: TouristPlaceDetailReq) => {
    try {
        const res = await api.post("/TouristPlace/detail", {
            id: data.id,
            type: data.type,
            TourismProduct: {
                page: data.page,
                pageSize: data.pageSize,
            },
        });
        console.log(res.data.message);
        console.log("OK");

        console.log(res.data);
        return res.data; // Trả về data vì axios tự parse json rồi
    } catch (error) {
        console.error("Lỗi khi gọi API chi tiết địa điểm:", error);
        throw error;
    }
};
