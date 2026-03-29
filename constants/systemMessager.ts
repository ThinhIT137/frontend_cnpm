export const setAuthMessage = (type: string) => {
    sessionStorage.setItem("auth_message", type);
};

export const getAuthMessage = () => {
    return sessionStorage.getItem("auth_message");
};

export const clearAuthMessage = () => {
    sessionStorage.removeItem("auth_message");
};
