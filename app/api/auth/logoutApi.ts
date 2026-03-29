import { api } from "../api";

export const logoutApi = async () => {
    const res = api.post("/Auth/LogOut");

    return res;
};
