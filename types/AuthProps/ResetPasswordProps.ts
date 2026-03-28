type ResetPasswordProps = {
    showPassword: boolean;
    Password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    PasswordCheck: string;
    setPasswordCheck: React.Dispatch<React.SetStateAction<string>>;
    togglePasswordVisibility: (
        setPassword: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void;
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
    showPasswordCheck: boolean;
    setShowPasswordCheck: React.Dispatch<React.SetStateAction<boolean>>;
    handleResetPassword: (e: React.FormEvent<HTMLFormElement>) => void;
};
