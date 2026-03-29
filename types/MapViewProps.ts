import { TouristAreaProps } from "./TouristAreaProps";

export type MapViewProps = {
    locations: TouristAreaProps[];
    selectedLocation?: [number, number] | null;
    LocaltionSetView: [number, number];
    size: number;
};
// [15.8, 105.8], 5.8
