"use client";

import { clearAuthMessage, getAuthMessage } from "@/constants/systemMessager";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type MessageType = "login" | "logout" | "force_logout" | null;

const AuthMessageContext = createContext<any>(null);

export const AuthMessageProvider = ({ children }: any) => {
    const [message, setMessage] = useState<MessageType>(null);
    const pathname = usePathname();

    useEffect(() => {
        const msg = getAuthMessage();
        if (msg) {
            setMessage(msg as MessageType);
            clearAuthMessage();
        }
    }, [pathname]);

    return (
        <AuthMessageContext.Provider value={{ message, setMessage }}>
            {children}
        </AuthMessageContext.Provider>
    );
};

export const useAuthMessage = () => useContext(AuthMessageContext);
