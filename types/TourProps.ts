import { ImageProps } from "./ImageProps";

export type TourProps = {
    id: number;
    name: string;
    title: string;
    description: string;
    durationDays: number;
    numberOfPeople: number;
    rating_average: number;
    click_count: number;
    favorite_count: number;
    trending_Score: number;
    type: string;
    images: ImageProps[];
    coverImageUrl?: string;
};
