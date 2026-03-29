import { ImageProps } from "./ImageProps";

export type TouristPlaceProps = {
    id: number;
    name: string;
    title: string;
    address: string;
    description: string;
    rating_average: number;
    click_count: number;
    favorite_count: number;
    trending_Score: number;
    latitude: number;
    longitude: number;
    type: string;
    images: ImageProps[];
    coverImageUrl?: string;
};
