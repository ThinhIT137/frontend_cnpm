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
    return "/tourist_area_detail?id=" + id.toString();
};
