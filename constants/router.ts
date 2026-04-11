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
    /* router detail */
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
{
    /* router admin */
}
export const AdminMoney = "/Admin/User";
export const AdminUser = "/Admin/Users";
export const AdminPeding = "/Admin/Peding";
export const AdminReport = "/Admin/Report";
export const AdminTouristArea = "/Admin/TouristArea";
export const AdminTouristPlace = "/Admin/TouristPlace";
export const AdminHotel = "/Admin/Hotel";
export const AdminTour = "/Admin/Tour";
export const AdminBanner = "/Admin/Banner";
{
    /* router profile */
}
export const helpAndSupport = "/helpAndSupport";
export const contributeComments = "/contributeComments";
export const placedAndPrivate = "/placedAndPrivate";
export const profile = "/profile";
