import { ImageProps } from "./ImageProps";

export type TouristAreaProps = {
    id: number;
    name: string;
    title: string;
    address: string;
    description: string;
    rating_average: number;
    click_count: number;
    favorite_count: number;
    isFavorite: boolean;
    trending_Score: number;
    latitude: number;
    longitude: number;
    type: string; // Cái này gán cứng "tourist_area" từ backend
    images: ImageProps[]; // Hứng nguyên mảng ảnh
    coverImageUrl?: string; // Dùng dấu ? vì lỡ khu đó chưa có ảnh bìa thì nó có thể bị null/undefined
};
