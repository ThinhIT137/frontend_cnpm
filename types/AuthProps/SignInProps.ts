import React from "react";

export type SignInProps = {
    EmailLogin: string;

    setEmailLogin: React.Dispatch<React.SetStateAction<string>>;

    PasswordLogin: string;

    setPasswordLogin: React.Dispatch<React.SetStateAction<string>>;
    togglePasswordVisibility: (
        setPassword: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void;

    showPassword: boolean;

    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;

    handleLogin: () => void;

    setlogin: React.Dispatch<React.SetStateAction<string>>;
};
