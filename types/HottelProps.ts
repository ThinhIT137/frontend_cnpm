import { ImageProps } from "./ImageProps"; // Nhớ import cái này giống bên TourProps nha

export type HottelProps = {
    id: number;
    name: string;
    title: string;
    address: string;
    description: string;
    price?: number;
    rating_average: number;
    click_count: number;
    favorite_count: number;
    trending_Score: number;
    latitude: number;
    longitude: number;
    type: string;
    images: ImageProps[];
    coverImageUrl?: string; // Để dấu ? lỡ db bị null cái url ảnh bìa nó không chửi
};
