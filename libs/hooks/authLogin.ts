// import { AuthResponse } from "@/types/AuthResponse";
import { AuthResponseProps } from "@/types/interface/AuthResponseProps";
import { AxiosResponse } from "axios";

export const addToken = (res: AxiosResponse<AuthResponseProps>) => {
    const { accessToken, expiresAt } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessTokenExpiresAt", expiresAt);
};
