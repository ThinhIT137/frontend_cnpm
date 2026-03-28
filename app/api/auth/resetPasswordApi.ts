import { ResetPasswordRequest } from "@/types/ResetPasswordRequestProps";
import { api } from "../api";
import { addToken } from "@/libs/hooks/authLogin";

export const resetPasswordApi = async ({
    Email,
    Password,
    Token,
    Expired,
}: ResetPasswordRequest) => {
    const res = await api.post("/Auth/ResetPassword", {
        Email: Email,
        Password: Password,
        Token: Token,
        Expired: Expired,
    });
    addToken(res);
    return res;
};
