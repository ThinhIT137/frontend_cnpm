export type ResetPasswordRequest = {
    Email: string;
    Password: string;
    Token: string;
    Expired: Date;
};
