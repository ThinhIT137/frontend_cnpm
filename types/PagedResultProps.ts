export type PagedResultProps<T> = {
    items: T[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
};
