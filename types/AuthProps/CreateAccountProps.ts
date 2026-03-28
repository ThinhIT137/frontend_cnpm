export type CreateAccountProps = {
    firstName: string;
    setFirstName: React.Dispatch<React.SetStateAction<string>>;
    secondName: string;
    setSecondName: React.Dispatch<React.SetStateAction<string>>;
    EmailRegister: string;
    setEmailRegister: React.Dispatch<React.SetStateAction<string>>;
    PasswordRegister: string;
    setPasswordRegister: React.Dispatch<React.SetStateAction<string>>;
    showPasswordRegister: boolean;
    setShowPasswordRegister: React.Dispatch<React.SetStateAction<boolean>>;
    showPasswordRegisterCheck: boolean;
    setShowPasswordRegisterCheck: React.Dispatch<React.SetStateAction<boolean>>;
    PasswordLogin: string;
    setPasswordLogin: React.Dispatch<React.SetStateAction<string>>;
    togglePasswordVisibility: (
        setPassword: React.Dispatch<React.SetStateAction<boolean>>,
    ) => void;
    handleRegister: () => void;
    setlogin: React.Dispatch<React.SetStateAction<string>>;
};
