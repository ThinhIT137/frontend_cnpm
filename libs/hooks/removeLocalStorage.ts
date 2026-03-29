export const removeLocalStorage = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("accessTokenExpiresAt");
    localStorage.removeItem("name");
    localStorage.removeItem("avt");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
};
