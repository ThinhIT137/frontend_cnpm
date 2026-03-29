import { TouristAreaProps } from "./TouristAreaProps";
import { PagedResultProps } from "./PagedResultProps";

export type touristAreaDetailResponseProps<T> = {
    tourist_Area_Detail: TouristAreaProps;
    pagedResult: PagedResultProps<T>;
};
