import { ApiResponseProps } from "@/types/ApiResponseProps";
import { api } from "./api";

export interface TopBookedProps {
    id: number;
    name: string;
    type: string; // "Hotel" hoặc "Tour"
    totalBookings: number;
    revenue: number;
}

export interface SystemStatsProps {
    totalUsers: number;
    totalHotels: number;
    totalTours: number;
    pendingApprovals: number;
    pendingReports: number;
    totalTouristAreas: number;
    totalTouristPlaces: number;
    activeAds: number;
}

export interface AdRequestProps {
    title: string;
    description: string;
    position: string;
    url: string;
    name: string;
    phone: string;
}

export interface AdvertisementProps extends AdRequestProps {
    id: number;
    isActive: boolean;
    start_date: string;
    end_date: string;
}

export interface ReportRequestProps {
    entityType: string;
    entityId: number;
    reason: string;
    description: string;
}

export interface ReportProps extends ReportRequestProps {
    id: number;
    reportedByUserId: string;
    status: string;
    createdAt: string;
}

export const adminApi = {
    // Lấy thống kê tổng quan (Chỉ Admin)
    getSystemStats: async (): Promise<SystemStatsProps | null> => {
        try {
            const res =
                await api.get<ApiResponseProps<SystemStatsProps>>(
                    "/Admin/statistics",
                );
            if (res.data.success) {
                return res.data.data ?? null;
            }
            return null;
        } catch (error) {
            console.error("Lỗi khi lấy thống kê hệ thống:", error);
            return null;
        }
    },

    // Tạo quảng cáo mới (Chỉ Admin)
    createAd: async (data: AdRequestProps): Promise<ApiResponseProps> => {
        try {
            const res = await api.post<ApiResponseProps>("/Admin/ads", data);
            return res.data; // Trả về cả cục { success, message } để FE dùng alert
        } catch (error: any) {
            console.error("Lỗi khi tạo quảng cáo:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Có lỗi xảy ra",
                data: null,
            };
        }
    },

    // Lấy danh sách quảng cáo đang Active (Public - Không cần Token)
    getActiveAds: async (
        position: string = "Home",
    ): Promise<AdvertisementProps[]> => {
        try {
            const res = await api.get<ApiResponseProps<AdvertisementProps[]>>(
                "/Admin/ads/active",
                {
                    params: { position },
                },
            );
            if (res.data.success) {
                return res.data.data ?? [];
            }
            return [];
        } catch (error) {
            console.error("Lỗi khi lấy danh sách quảng cáo:", error);
            return [];
        }
    },

    // Khách hàng gửi Báo cáo vi phạm (Cần đăng nhập)
    submitReport: async (
        data: ReportRequestProps,
    ): Promise<ApiResponseProps> => {
        try {
            const res = await api.post<ApiResponseProps>(
                "/Admin/reports",
                data,
            );
            return res.data;
        } catch (error: any) {
            console.error("Lỗi khi gửi báo cáo:", error);
            return {
                success: false,
                message:
                    error.response?.data?.message || "Gửi báo cáo thất bại",
                data: null,
            };
        }
    },

    // Lấy danh sách báo cáo (Chỉ Admin)
    getReports: async (): Promise<ReportProps[]> => {
        try {
            const res =
                await api.get<ApiResponseProps<ReportProps[]>>(
                    "/Admin/reports",
                );
            if (res.data.success) {
                return res.data.data ?? [];
            }
            return [];
        } catch (error) {
            console.error("Lỗi khi lấy danh sách báo cáo:", error);
            return [];
        }
    },
};
