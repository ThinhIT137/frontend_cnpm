"use client";

import { getUserInfo } from "@/constants/info";
import { createContext, useContext, useEffect, useState } from "react";

type AuthType = {
    isAuth: boolean;
    user: any;
    setAuth: (val: boolean) => void;
};

const AuthContext = createContext<AuthType | null>(null);

export const AuthProvider = ({ children }: any) => {
    const [isAuth, setIsAuth] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const name = getUserInfo()?.name;

        if (token) {
            setIsAuth(true);
            setUser({ name });
        }
    }, []);

    const setAuth = (val: boolean) => {
        setIsAuth(val);
        if (!val) {
            localStorage.clear();
            setUser(null);
        }
    };
    return (
        <AuthContext.Provider value={{ isAuth, user, setAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)!;
