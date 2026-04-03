{
    /* router system */
}
export const Home = "/";
export const Tourist_Area = "/tourist_area";
export const Tourist_Place = "/tourist_place";
export const Hottel = "/Hottel";
export const Tour = "/Tour";

{
    /* router Auth */
}
export const Login = "/login";

{
    /* router tourist area detail */
}
export const TouristAreaDetail = (id: number) => {
    return "/tourist_area/tourist_area_detail?id=" + id.toString();
};

export const TouristPlaceDetail = (id: number) => {
    return "/tourist_place/TouristPlaceDetail?id=" + id.toString();
};

export const HottelDetail = (id: number) => {
    return "/Hottel/hottel_detail?id=" + id.toString();
};

export const TourDetail = (id: number) => {
    return "/Tour/tourDetail?id=" + id.toString();
};
