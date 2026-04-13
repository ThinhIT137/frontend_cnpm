import { ApiResponseProps } from "@/types/ApiResponseProps";
import { api } from "./api"; // Nhớ trỏ đúng đường dẫn nha sếp

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
    totalMarkers?: number; // Bổ sung nếu có làm api đếm marker
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
    // ==========================================
    // 1. THỐNG KÊ (DASHBOARD)
    // ==========================================
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

    // ==========================================
    // 2. QUẢN LÝ QUẢNG CÁO (ADS)
    // ===============================================
    createAd: async (data: AdRequestProps): Promise<ApiResponseProps> => {
        try {
            const res = await api.post<ApiResponseProps>("/Admin/ads", data);
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Có lỗi xảy ra",
                data: null,
            };
        }
    },
    getActiveAds: async (
        position: string = "Home",
    ): Promise<AdvertisementProps[]> => {
        try {
            const res = await api.get<ApiResponseProps<AdvertisementProps[]>>(
                "/Admin/ads/active",
                { params: { position } },
            );
            return res.data.success ? (res.data.data ?? []) : [];
        } catch (error) {
            console.error("Lỗi lấy danh sách quảng cáo:", error);
            return [];
        }
    },

    // ==========================================
    // 3. QUẢN LÝ REPORT (BÁO CÁO VI PHẠM)
    // ===============================================
    submitReport: async (
        data: ReportRequestProps,
    ): Promise<ApiResponseProps> => {
        try {
            // Sếp đã code SubmitReport trong UserController
            const res = await api.post<ApiResponseProps>("/User/reports", data);
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Gửi báo cáo thất bại",
                data: null,
            };
        }
    },

    getReports: async (): Promise<ReportProps[]> => {
        try {
            // Admin lấy list report trong AdminController
            const res =
                await api.get<ApiResponseProps<ReportProps[]>>(
                    "/Admin/reports",
                );
            return res.data.success ? (res.data.data ?? []) : [];
        } catch (error) {
            console.error("Lỗi lấy danh sách báo cáo:", error);
            return [];
        }
    },

    // ==========================================
    // 4. CÁC HÀM DUYỆT (APPROVE / REJECT) CỦA ADMIN
    // ===============================================
    /**
     * Duyệt / Từ chối Khách sạn
     * @param status "Approved" hoặc "Rejected"
     */
    approveHotel: async (
        id: number,
        status: string,
    ): Promise<ApiResponseProps> => {
        try {
            const res = await api.put<ApiResponseProps>(
                `/Hotel/approve/${id}`,
                { status },
            );
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi duyệt Khách sạn",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },

    /**
     * Duyệt / Từ chối Tour
     */
    approveTour: async (
        id: number,
        status: string,
    ): Promise<ApiResponseProps> => {
        try {
            const res = await api.put<ApiResponseProps>(`/Tour/approve/${id}`, {
                status,
            });
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi duyệt Tour",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },

    /**
     * Duyệt / Từ chối Khu du lịch
     */
    approveTouristArea: async (
        id: number,
        status: string,
    ): Promise<ApiResponseProps> => {
        try {
            const res = await api.put<ApiResponseProps>(
                `/TouristArea/approve/${id}`,
                { status },
            );
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Lỗi duyệt Khu du lịch",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },

    /**
     * Duyệt / Từ chối Địa điểm du lịch
     */
    approveTouristPlace: async (
        id: number,
        status: string,
    ): Promise<ApiResponseProps> => {
        try {
            const res = await api.put<ApiResponseProps>(
                `/TouristPlace/approve/${id}`,
                { status },
            );
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi duyệt Địa điểm",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },

    // ==========================================
    // 5. QUẢN LÝ MARKER (ĐIỂM ĐÁNH DẤU CỦA USER)
    // ===============================================
    /**
     * Lấy toàn bộ Marker trong hệ thống (Cho Admin)
     */
    getAllMarkersForAdmin: async () => {
        try {
            const res = await api.get(`/Marker/admin/all`);
            return res.data;
        } catch (error) {
            console.error("Lỗi lấy tất cả marker:", error);
            return null;
        }
    },

    /**
     * Admin Xóa bất chấp Marker
     */
    adminDeleteMarker: async (id: number): Promise<ApiResponseProps> => {
        try {
            const res = await api.delete(`/Marker/admin/${id}`);
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi xóa Marker",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },

    // ==========================================
    // 6. QUẢN LÝ USER
    // ===============================================
    /**
     * Lấy danh sách toàn bộ User
     */
    getUsers: async (page = 1, pageSize = 10) => {
        try {
            const res = await api.get(
                `/User/list?page=${page}&pageSize=${pageSize}`,
            );
            return res.data;
        } catch (error) {
            console.error("Lỗi lấy danh sách user:", error);
            return null;
        }
    },

    /**
     * Khóa / Mở khóa tài khoản (Toggle Status)
     */
    toggleUserStatus: async (userId: string): Promise<ApiResponseProps> => {
        try {
            const res = await api.put(`/User/toggle-status/${userId}`);
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Lỗi cập nhật trạng thái User",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },

    /**
     * Cấp quyền cho User (Admin, Owner, User...)
     */
    changeUserRole: async (
        userId: string,
        role: string,
    ): Promise<ApiResponseProps> => {
        try {
            const res = await api.put(`/User/change-role/${userId}`, { role });
            return res.data;
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Lỗi phân quyền User",
                data: null, // 🔴 ĐÃ THÊM DATA: NULL
            };
        }
    },
    // ==========================================
    // 7. LẤY DANH SÁCH CHỜ DUYỆT (ADMIN)
    // ==========================================
    getPendingHotels: async () => {
        const res =
            await api.get<
                ApiResponseProps<{
                    items: any[];
                    totalCount: number;
                    totalPages: number;
                    currentPage: number;
                }>
            >(`/Hotel/admin/pending`);
        return res.data;
    },
    getPendingTours: async () => {
        const res =
            await api.get<
                ApiResponseProps<{
                    items: any[];
                    totalCount: number;
                    totalPages: number;
                    currentPage: number;
                }>
            >(`/Tour/admin/pending`);
        return res.data;
    },
    getPendingTouristAreas: async () => {
        const res = await api.get<
            ApiResponseProps<{
                items: any[];
                totalCount: number;
                totalPages: number;
                currentPage: number;
            }>
        >(`/TouristArea/admin/pending`);
        return res.data;
    },
    getPendingTouristPlaces: async () => {
        const res = await api.get<
            ApiResponseProps<{
                items: any[];
                totalCount: number;
                totalPages: number;
                currentPage: number;
            }>
        >(`/TouristPlace/admin/pending`);
        return res.data;
    },
};
