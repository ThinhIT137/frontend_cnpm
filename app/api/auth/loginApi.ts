import { addToken } from "@/libs/hooks/authLogin";
import { loginRequestProps } from "@/types/LoginRequestProps";
import { api } from "../api";

export const loginApi = async ({ email, password }: loginRequestProps) => {
    const res = await api.post("/Auth/login", {
        Email: email,
        Password: password,
    });
    addToken(res);
    return res;
};
