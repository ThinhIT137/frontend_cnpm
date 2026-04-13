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
    isFavorite?: boolean;
    images: ImageProps[];
    coverImageUrl?: string;
};

export type TourScheduleProps = {
    id: number;
    startDate: string;
    totalSeats: number;
    availableSeats: number;
    status: string;
    bookedSeats: string[]; // Mảng chứa các ghế đã đặt
};

export type TourDetailProps = TourProps & {
    tourist_Area?: {
        id: number;
        name: string;
    } | null;
    itineraries: TourItineraryProps[];
    schedules?: TourScheduleProps[];
};
