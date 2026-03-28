import { api } from "../api";

export const forgotApi = async (email: string) => {
    const res = await api.post("/Auth/ForgotPassword", {
        Email: email,
    });
    return res;
};
