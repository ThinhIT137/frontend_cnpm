export const isAccessTokenValid = () => {
    if (typeof window === "undefined") {
        return false;
    }

    const accessToken = localStorage.getItem("accessToken");
    const expiresAt = localStorage.getItem("accessTokenExpiresAt");

    if (!accessToken || !expiresAt) {
        return false;
    }

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();
    return expirationTime > currentTime;
};
