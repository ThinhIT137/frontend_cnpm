import { UserResponseProps } from "../UserResponseProps";

export type AuthResponseProps = {
    accessToken: string;
    refreshToken: string;
    expiresAt: string;
    info: UserResponseProps;
};
