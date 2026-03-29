import { ResetPasswordRequest } from "@/types/ResetPasswordRequestProps";
import { api } from "../api";
import { addToken } from "@/libs/hooks/authLogin";
import { AuthResponseProps } from "@/types/AuthResponseProps";

export const resetPasswordApi = async ({
    Email,
    Password,
    Token,
    Expired,
}: ResetPasswordRequest) => {
    const res = await api.post<AuthResponseProps>("/Auth/ResetPassword", {
        Email: Email,
        Password: Password,
        Token: Token,
        Expired: Expired,
    });
    addToken(res);
    return res;
};
