// import { AuthResponse } from "@/types/AuthResponse";
import { logoutApi } from "@/app/api/auth/logoutApi";
import { AuthResponseProps } from "@/types/AuthResponseProps";
import { AxiosResponse } from "axios";
import { removeLocalStorage } from "./removeLocalStorage";
import { setAuthMessage } from "@/constants/systemMessager";
import { useRouter } from "next/navigation";

export const addToken = (res: AxiosResponse<AuthResponseProps>) => {
    const { accessToken, expiresAt, info } = res.data;

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("accessTokenExpiresAt", expiresAt);
    localStorage.setItem("name", info.name);
    localStorage.setItem("avt", info.avt);
    localStorage.setItem("email", info.email);
    localStorage.setItem("role", info.role);
};

export const logOut = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        setLoading(true);
        await logoutApi();
        removeLocalStorage();
        setAuthMessage("logout");
        window.location.href = "/login";
    } catch (err) {
        console.log("Lỗi đăng xuất: " + err);
        alert("Có lỗi sảy ra");
    } finally {
        setLoading(false);
    }
};
