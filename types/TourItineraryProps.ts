export type TourItineraryProps = {
    id: number;
    dayNumber: number;
    activityName: string;
    description: string;
    tourist_Place?: {
        id: number;
        name: string;
        latitude: number;
        longitude: number;
    } | null;
};
