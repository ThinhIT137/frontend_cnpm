import { api } from "./api"; // Sửa lại đường dẫn này trỏ tới cái file api.ts bác vừa gửi ở trên nhé

// Định nghĩa Payload gửi lên Backend
export interface SearchFilterRequest {
    type: string;
    keyword?: string;
    minPrice?: number | null;
    maxPrice?: number | null;
    category?: string;
    page?: number;
    pageSize?: number;
}

// Định nghĩa kiểu dữ liệu 1 Item trả về
export interface SearchResultItem {
    id: string | number;
    name: string;
    price: number;
    type: string;
    title?: string;
    ratingAverage?: number;
}

// Định nghĩa form Response từ Backend trả về
export interface SearchFilterResponse {
    success: boolean;
    message: string;
    data: {
        items: SearchResultItem[];
        totalCount: number;
        currentPage: number;
    };
}

export const searchApi = {
    filterData: async (
        payload: SearchFilterRequest,
    ): Promise<SearchFilterResponse> => {
        // Do baseURL của bác đã trỏ sẵn vào NEXT_PUBLIC_API rồi,
        // nên ở đây chỉ cần gọi endpoint /Search/filter thôi
        const response = await api.post("/Search/filter", payload);
        return response.data;
    },
};
