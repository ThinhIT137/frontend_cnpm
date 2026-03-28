import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const CountDown = ({ m }: { m: number }) => {
    const [timeLeft, setTimeLeft] = useState(m * 60);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const route = useRouter();

    useEffect(() => {
        if (timeLeft === 0) {
            route.push("/");
        }
    }, [timeLeft]);

    return (
        <>
            {minutes}:{seconds.toString().padStart(2, "0")}
        </>
    );
};
