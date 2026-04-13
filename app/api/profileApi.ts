import { api } from "./api"; // Import cái axios instance của bác vào đây

// Định nghĩa kiểu dữ liệu gửi lên
export type FeedbackRequest = {
    subject: string;
    message: string;
};

// Định nghĩa kiểu dữ liệu trả về (cấu trúc chuẩn theo API của bác)
export type FeedbackResponse = {
    success: boolean;
    message: string;
};

export type UpdateProfileRequest = {
    name?: string;
    avt?: string;
};

export type UpdateProfileResponse = {
    success: boolean;
    message: string;
    data?: {
        name: string;
        avt: string;
    };
};

// --- TYPES CHO PASSWORD ---
export type ChangePasswordRequest = {
    oldPassword?: string;
    newPassword?: string;
};

export type BaseResponse = {
    success: boolean;
    message: string;
};

export const profileApi = {
    /**
     * Gửi ý kiến đóng góp (Feedback)
     */
    submitFeedback: async (
        payload: FeedbackRequest,
    ): Promise<FeedbackResponse> => {
        // Lưu ý: Đổi "/Profile/feedback" thành đúng Route Controller của bác
        // Ví dụ nếu Controller của bác là [Route("api/[controller]")] thì URL sẽ là "/Profile/feedback"
        const response = await api.post<FeedbackResponse>(
            "/Profile/feedback",
            payload,
        );
        return response.data;
    },

    /**
     * Cập nhật thông tin cơ bản (Tên, Avatar)
     */
    updateProfile: async (
        payload: UpdateProfileRequest,
    ): Promise<UpdateProfileResponse> => {
        const response = await api.put<UpdateProfileResponse>(
            "/Profile/update",
            payload,
        );
        return response.data;
    },

    /**
     * Đổi mật khẩu
     */
    changePassword: async (
        payload: ChangePasswordRequest,
    ): Promise<BaseResponse> => {
        const response = await api.put<BaseResponse>(
            "/Profile/change-password",
            payload,
        );
        return response.data;
    },
    /**
     * Lấy danh sách khu du lịch của tôi
     */
    getMyTouristAreas: async (
        page = 1,
        pageSize = 10,
        keyword = "",
        status = "",
    ) => {
        const res = await api.get(
            `/TouristArea/my-areas?page=${page}&pageSize=${pageSize}&keyword=${keyword}&status=${status}`,
        );
        return res.data;
    },
    /**
     * Lấy danh sách Địa điểm du lịch của tôi
     */
    getMyTouristPlaces: async (
        page = 1,
        pageSize = 10,
        keyword = "",
        status = "",
    ) => {
        const res = await api.get(
            `/TouristPlace/my-places?page=${page}&pageSize=${pageSize}&keyword=${keyword}&status=${status}`,
        );
        return res.data;
    },
    /**
     * Lấy danh sách Khách sạn của tôi
     */
    getMyHotels: async (page = 1, pageSize = 10, keyword = "", status = "") => {
        const res = await api.get(
            `/Hotel/my-hotels?page=${page}&pageSize=${pageSize}&keyword=${keyword}&status=${status}`,
        );
        return res.data;
    },
    /**
     * Lấy danh sách Tour của tôi
     */
    getMyTours: async (page = 1, pageSize = 10, keyword = "", status = "") => {
        const res = await api.get(
            `/Tour/my-tours?page=${page}&pageSize=${pageSize}&keyword=${keyword}&status=${status}`,
        );
        return res.data;
    },
    /**
     * Lấy danh sách Marker (Địa điểm đã đánh dấu) - API này sếp có sẵn rồi nè
     */
    getMyMarkers: async () => {
        const res = await api.get(`/Marker/me`);
        return res.data;
    },
    getPublicMarkers: async () => {
        const res = await api.get(`/Marker/public`);
        return res.data;
    },
    /**
     * Lấy danh sách các đánh giá (Review) nhận được
     */
    getMyReviews: async (page = 1, pageSize = 10) => {
        const res = await api.get(
            `/Interaction/my-reviews?page=${page}&pageSize=${pageSize}`,
        );
        return res.data;
    },
    // ================== CRUD TOUR ==================
    createTour: async (payload: any) => {
        const res = await api.post("/Tour", payload);
        return res.data;
    },
    updateTour: async (id: number, payload: any) => {
        const res = await api.put(`/Tour/${id}`, payload);
        return res.data;
    },
    deleteTour: async (id: number) => {
        const res = await api.delete(`/Tour/${id}`);
        return res.data;
    },

    // ================== CRUD HOTEL ==================
    createHotel: async (payload: any) => {
        const res = await api.post("/Hotel", payload);
        return res.data;
    },
    updateHotel: async (id: number, payload: any) => {
        const res = await api.put(`/Hotel/${id}`, payload);
        return res.data;
    },
    deleteHotel: async (id: number) => {
        const res = await api.delete(`/Hotel/${id}`);
        return res.data;
    },

    // ================== CRUD TOURIST AREA ==================
    createTouristArea: async (payload: any) => {
        const res = await api.post("/TouristArea", payload);
        return res.data;
    },
    updateTouristArea: async (id: number, payload: any) => {
        const res = await api.put(`/TouristArea/${id}`, payload);
        return res.data;
    },
    deleteTouristArea: async (id: number) => {
        const res = await api.delete(`/TouristArea/${id}`);
        return res.data;
    },

    // ================== CRUD TOURIST PLACE ==================
    createTouristPlace: async (payload: any) => {
        const res = await api.post("/TouristPlace", payload);
        return res.data;
    },
    updateTouristPlace: async (id: number, payload: any) => {
        const res = await api.put(`/TouristPlace/${id}`, payload);
        return res.data;
    },
    deleteTouristPlace: async (id: number) => {
        const res = await api.delete(`/TouristPlace/${id}`);
        return res.data;
    },

    // ================== DELETE REVIEW (Nếu cần) ==================
    deleteReview: async (id: number) => {
        const res = await api.delete(`/Interaction/review/${id}`);
        return res.data;
    },
    // ================== CÁC HÀM ADD CON ==================
    addHotelRoom: async (hotelId: number, payload: any) => {
        const res = await api.post(`/Hotel/${hotelId}/rooms`, payload);
        return res.data;
    },

    updateHotelRoom: async (roomId: number, payload: any) => {
        const res = await api.put(`/Hotel/rooms/${roomId}`, payload);
        return res.data;
    },
    deleteHotelRoom: async (roomId: number) => {
        const res = await api.delete(`/Hotel/rooms/${roomId}`);
        return res.data;
    },

    addDeparture: async (tourId: number, payload: any) => {
        const res = await api.post(`/Tour/${tourId}/departures`, payload);
        return res.data;
    },

    updateDeparture: async (id: number, payload: any) => {
        const res = await api.put(`/Tour/departures/${id}`, payload);
        return res.data;
    },
    deleteDeparture: async (id: number) => {
        const res = await api.delete(`/Tour/departures/${id}`);
        return res.data;
    },

    addItinerary: async (tourId: number, payload: any) => {
        const res = await api.post(`/Tour/${tourId}/itinerary`, payload);
        return res.data;
    },

    updateItinerary: async (id: number, payload: any) => {
        const res = await api.put(`/Tour/itinerary/${id}`, payload);
        return res.data;
    },
    deleteItinerary: async (id: number) => {
        const res = await api.delete(`/Tour/itinerary/${id}`);
        return res.data;
    },

    // ================== CRUD MARKER ==================
    createMarker: async (payload: any) => {
        const res = await api.post("/Marker", payload);
        return res.data;
    },
    updateMarker: async (id: number, payload: any) => {
        const res = await api.put(`/Marker/${id}`, payload);
        return res.data;
    },
    deleteMarker: async (id: number) => {
        const res = await api.delete(`/Marker/${id}`); // Tùy route Backend của sếp, thường là vầy
        return res.data;
    },

    /**
     * Lấy FULL danh sách Khu du lịch & Địa điểm (Dùng cho Dropdown Thêm/Sửa)
     */
    getAllTouristAreas: async () => {
        const res = await api.get(`/TouristArea/all-dropdown`);
        return res.data;
    },

    getAllTouristPlaces: async () => {
        const res = await api.get(`/TouristPlace/all-dropdown`);
        return res.data;
    },

    // ================== LƯU LINK ẢNH ==================
    saveImageLink: async (payload: {
        url: string;
        isCover: boolean;
        entityType: string;
        entityId: number;
    }) => {
        const res = await api.post("/Image/save-link", payload);
        return res.data;
    },
    // Xóa ảnh
    deleteImage: async (imgId: number) => {
        const res = await api.delete(`/Image/${imgId}`); // Đổi route tùy backend sếp
        return res.data;
    },

    setCoverImage: async (id: number, entityType: string, entityId: number) => {
        const res = await api.put(
            `/Image/set-cover/${id}?entityType=${entityType}&entityId=${entityId}`,
        );
        return res.data;
    },

    // ================== API CHO REVIEW / COMMENT ==================
    /**
     * Gửi đánh giá mới (POST)
     */
    submitReview: async (payload: {
        EntityId: number;
        EntityType: string;
        Star: number;
        Content: string;
    }) => {
        // Gọi API POST /api/Review (Khớp với ReviewController bên C#)
        const res = await api.post("/Review", payload);
        return res.data;
    },

    /**
     * Lấy danh sách đánh giá (GET)
     */
    getReviews: async (entityType: string, entityId: number) => {
        // Gọi API GET /api/Review/{type}/{id}
        const res = await api.get(`/Review/${entityType}/${entityId}`);
        return res.data;
    },
    /**
     * Thả tim hoặc Bỏ thả tim
     */
    toggleFavorite: async (payload: {
        EntityId: number;
        EntityType: string;
    }) => {
        // Khớp với cái [HttpPost("toggle")] trong FavoriteController của sếp
        const res = await api.post("/Favorite/toggle", payload);
        return res.data;
    },

    /**
     * Gửi báo cáo vi phạm
     */
    submitReport: async (payload: {
        EntityType: string;
        EntityId: number;
        Reason: string;
        Description?: string;
    }) => {
        // Gọi API POST /api/User/reports (Khớp với UserController của sếp)
        const res = await api.post("/User/reports", payload);
        return res.data;
    },
    // ================== API CHO BOOKING ĐẶT CHỖ ==================
    /**
     * Tạo đơn đặt phòng khách sạn hoặc đặt tour
     */
    createBooking: async (payload: {
        BookingType: string;
        ContactName: string;
        ContactPhone: string;
        ContactAddress?: string;
        Note?: string;
        TotalAmount: number;
        HotelRoomIds?: number[];
        TourDepartureId?: number;
        SeatNumbers?: string[];
        IsPrivateTour?: boolean;
    }) => {
        // Khớp với cái [HttpPost("create")] trong BookingController
        const res = await api.post("/Booking/create", payload);
        return res.data;
    },
    // ================== QUẢN LÝ BOOKING ==================
    getReceivedBookings: async () => {
        const res = await api.get(`/Booking/received-bookings`);
        return res.data;
    },
    updateBookingStatus: async (id: number, status: string) => {
        const res = await api.put(`/Booking/${id}/status`, { status });
        return res.data;
    },
    getMyBookings: async () => {
        const res = await api.get(`/Booking/my-bookings`);
        console.log(res.data);
        return res.data;
    },
    // ================== NÂNG CẤP TÀI KHOẢN ==================
    upgradeRole: async (payload: { role: string }) => {
        // Gọi xuống endpoint vừa tạo ở UserController
        const res = await api.put("/User/upgrade-role", payload);
        return res.data;
    },
};
