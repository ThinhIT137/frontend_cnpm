export const getUserInfo = () => {
    if (typeof window === "undefined") return null;

    return {
        name: localStorage.getItem("name") || "",
        avt: localStorage.getItem("avt") || "",
        email: localStorage.getItem("email") || "",
        role: localStorage.getItem("role") || "",
    };
};

export const role =
    typeof window !== "undefined" ? localStorage.getItem("role") || "" : "";
export const name =
    typeof window !== "undefined" ? localStorage.getItem("name") || "" : "";
export const avt =
    typeof window !== "undefined" ? localStorage.getItem("avt") || "" : "";
export const email =
    typeof window !== "undefined" ? localStorage.getItem("email") || "" : "";
export const accessToken =
    typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || ""
        : "";

export const setUpload = (name: string, avt: string) => {
    localStorage.setItem("name", name);
    localStorage.setItem("avt", avt);
};
