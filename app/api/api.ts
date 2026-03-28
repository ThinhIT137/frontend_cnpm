import axios from "axios";
import { addToken } from "../../libs/hooks/authLogin";
import { config } from "process";
import { error } from "console";
// import { useRouter } from "next/navigation";

let isRefreshing = false;
let pendingRequests: any[] = [];
const authChannel =
    typeof window !== "undefined"
        ? new BroadcastChannel("auth_sync_channel")
        : null;
if (authChannel) {
    authChannel.onmessage = (e) => {
        if (e.data.type === "REFRESH_SUCCESS") {
            const newToken = e.data.token;
            pendingRequests.forEach((callback) => callback(newToken));
            pendingRequests = [];
            isRefreshing = false;
        } else if (e.data.type === "LOGOUT") {
            pendingRequests.forEach((callback) => callback(null));
            pendingRequests = [];
            localStorage.removeItem("accessToken");
            localStorage.removeItem("accessTokenExpiresAt");
            window.location.href = "/login";
        }
    };
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    withCredentials: true,
    headers: {
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY as string,
    },
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("accessToken");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        Promise.reject(error);
    },
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/Auth/login") &&
            !originalRequest.url.includes("/Auth/RefreshToken")
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    pendingRequests.push((newToken: string) => {
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(api(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }

            isRefreshing = true;
            originalRequest._retry = true;
            try {
                const res = await api.post("/Auth/RefreshToken");

                const newAccessToken = res.data.accessToken;
                addToken(res);

                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                pendingRequests.forEach((callback) => callback(newAccessToken));

                pendingRequests = [];

                if (authChannel) {
                    authChannel.postMessage({
                        type: "REFRESH_SUCCESS",
                        token: newAccessToken,
                    });
                }

                return api(originalRequest);
            } catch (refreshError) {
                if (authChannel) {
                    authChannel.postMessage({ type: "LOGOUT" });
                }

                pendingRequests.forEach((callback) => callback(null));
                pendingRequests = [];

                localStorage.removeItem("accessToken");
                localStorage.removeItem("accessTokenExpiresAt");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    },
);
