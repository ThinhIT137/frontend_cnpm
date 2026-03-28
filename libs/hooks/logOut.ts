import { api } from "@/app/api/api";

export const handleLogOut = async (
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    try {
        setLoading(true);
        await api.post("/Auth/Logout");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExpiresAt");
        window.location.href = "/login";
    } catch (err) {
        console.log("Lỗi đăng xuất: " + err);
        alert("Có lỗi sảy ra");
    } finally {
        setLoading(false);
    }
};
