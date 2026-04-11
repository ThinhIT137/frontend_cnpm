export type ApiResponseProps<T = any> = {
    success: boolean;
    message: string;
    data: T;
};
