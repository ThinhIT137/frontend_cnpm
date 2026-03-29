export type ApiResponseProps<T> = {
    success: boolean;
    message: string;
    data: T;
};
