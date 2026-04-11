import { api } from "./api"; // Đảm bảo trỏ đúng tới file config Axios của ông nha

// Interface cho API lấy danh sách
interface GetListHottelReq {
    page: number;
    pageSize: number;
}

// Interface cho API lấy chi tiết 1 khách sạn
interface GetHottelDetailReq {
    id: number;
}

// 1. Hàm gọi API lấy danh sách Khách sạn (Có phân trang + Trending/Lịch sử)
export const getListHottelApi = async (data: GetListHottelReq) => {
    try {
        // Dùng GET và truyền params vì backend đang xài [FromQuery]
        const res = await api.get("/Hotel/list", {
            params: {
                page: data.page,
                pageSize: data.pageSize,
            },
        });
        return res.data; // Trả về cục data có items, totalPages...
    } catch (error) {
        console.error("Lỗi khi lấy danh sách khách sạn:", error);
        throw error;
    }
};

// 2. Hàm gọi API lấy chi tiết Khách sạn (Tự động +1 Click và lưu Lịch sử)
export const getHottelDetailApi = async (data: GetHottelDetailReq) => {
    try {
        const res = await api.get("/Hotel/detail", {
            params: {
                id: data.id,
            },
        });
        return res.data; // Trả về chi tiết 1 khách sạn + danh sách ảnh
    } catch (error) {
        console.error(`Lỗi khi lấy chi tiết khách sạn ID ${data.id}:`, error);
        throw error;
    }
};
