import { TouristAreaProps } from "./interface/TouristAreaProps";

export type MapViewProps = {
    locations: TouristAreaProps[];
    selectedLocation?: [number, number] | null;
};
