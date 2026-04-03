import { ImageProps } from "./ImageProps";
import { TourItineraryProps } from "./TourItineraryProps";

export type TourProps = {
    id: number;
    name: string;
    title: string;
    description: string;
    durationDays: number;
    numberOfPeople: number;
    price?: number;
    vehicle?: string;
    tourType?: string;
    status?: string;
    departure?: {
        name?: string;
        coords: [number, number];
    };
    rating_average: number;
    click_count: number;
    favorite_count: number;
    trending_Score: number;
    type: string;
    images: ImageProps[];
    coverImageUrl?: string;
};

export type TourDetailProps = TourProps & {
    tourist_Area?: {
        id: number;
        name: string;
    } | null;
    itineraries: TourItineraryProps[];
};
