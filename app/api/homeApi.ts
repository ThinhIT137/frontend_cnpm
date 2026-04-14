import { ApiResponseProps } from "@/types/ApiResponseProps";
import { api } from "./api";
import { HomeResponseProps } from "@/types/HomeResponseProps";

export const homeApi = async () => {
    const res =
        await api.get<ApiResponseProps<any>>("/home/index");

    const response = res.data;

    if (response.success == true) {
        console.log(response.message);
        console.log(response.data);
        return response.data;
    }
};
