export const getUserInfo = () => {
    if (typeof window === "undefined") return null;

    return {
        name: localStorage.getItem("name") || "",
        avt: localStorage.getItem("avt") || "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || "",
    };
};
