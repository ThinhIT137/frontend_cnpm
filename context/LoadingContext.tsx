"use client";

import { Loading } from "@/components/common/LoadingComponent";
import { createContext, useContext, useState } from "react";

const LoadingContext = createContext<any>(null);

export const LoadingProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && <Loading />}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
