import { addToken } from "@/hooks/authLogin";
import { loginRequestProps } from "@/types/LoginRequestProps";
import { api } from "../api";
import { AuthResponseProps } from "@/types/AuthResponseProps";

export const loginApi = async ({ email, password }: loginRequestProps) => {
    const res = await api.post<AuthResponseProps>("/Auth/login", {
        Email: email,
        Password: password,
    });

    console.log(res);

    addToken(res);
    return res;
};
