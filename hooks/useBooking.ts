import { supabase } from "@/libs/supabase";
import { error } from "console";
import { useState } from "react";

export const useHotelBooking = () => {
    const [isBooking, setIsBooking] = useState(false);

    const bookRoom = async (roomId: number, userId: string) => {
        setIsBooking(true);

        try {
            const { data: isLocked, error } = await supabase.rpc("");
        } catch (err) {
            console.log(error);
        }
    };
};
