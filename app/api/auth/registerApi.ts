import { addToken } from "@/libs/hooks/authLogin";
import { registerRequestProps } from "@/types/RegisterRequestProps";
import { api } from "../api";

export const registerApi = async ({
    Name,
    Email,
    PasswordHash,
}: registerRequestProps) => {
    const res = await api.post("/Auth/Register", {
        Name: Name,
        Email: Email,
        PasswordHash: PasswordHash,
    });
    addToken(res);
    return res;
};
