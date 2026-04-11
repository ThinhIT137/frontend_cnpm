"use client";
import { useRouter } from "next/navigation";

export const useNextRouter = () => {
    const router = useRouter();

    const go = (r: string) => {
        router.push(r);
    };

    return { go };
};
