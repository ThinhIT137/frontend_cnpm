// import { AuthResponse } from "@/types/AuthResponse";
import { AuthResponse } from "@/types/interface/AuthResponseProps";
import { AxiosResponse } from "axios";

export const addToken = (res: AxiosResponse<AuthResponse>) => {
    const { accessToken, expiresAt } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessTokenExpiresAt", expiresAt);
};
