"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./login.scss";

import { useRouter } from "next/navigation";
import { isAccessTokenValid } from "@/libs/hooks/isAccessTokenValid";
import { SignIn } from "@/components/common/forms/auth/SignInForm";
import { CreateAccount } from "@/components/common/forms/auth/CreateAccountForm";
import { Loading } from "@/components/common/LoadingComponent";
import { loginApi } from "@/app/api/auth/loginApi";
import { registerApi } from "@/app/api/auth/registerApi";
import { forgotApi } from "@/app/api/auth/forgotApi";
import { ForgotPassword } from "@/components/common/forms/auth/ForgotPasswordForm";
import { togglePasswordVisibility } from "@/libs/hooks/togglePasswordVisibility";

const login = () => {
    const router = useRouter();
    const [loading, setloading] = useState(false);

    // login
    const [EmailLogin, setEmailLogin] = useState("");
    const [PasswordLogin, setPasswordLogin] = useState("");
    // register
    const [EmailRegister, setEmailRegister] = useState("");
    const [PasswordRegister, setPasswordRegister] = useState("");
    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    //forgot
    const [EmailForgot, setEmailForgot] = useState("");
    const [resForgot, setResForgot] = useState("");
    // button
    // show password login
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRegister, setShowPasswordRegister] = useState(false);
    const [showPasswordRegisterCheck, setShowPasswordRegisterCheck] =
        useState(false);

    // page login - register - forgot
    const [login, setlogin] = useState("login");

    // login
    const handleLogin = async () => {
        if (EmailLogin === "" || PasswordLogin === "") {
            alert("Đằng nhập thất bại (Không được để trống)");
            return;
        }

        try {
            setloading(true);
            await loginApi({ email: EmailLogin, password: PasswordLogin });
            router.push("/");
        } catch (err) {
            console.log(err);
            setloading(false);
            alert("Lỗi");
        }
    };

    // register
    const handleRegister = async () => {
        if (
            EmailRegister === "" ||
            PasswordRegister === "" ||
            firstName === "" ||
            secondName === "" ||
            checkPassword === ""
        ) {
            alert("Đằng ký thất bại (Không được để trống)");
            return;
        }
        if (PasswordRegister !== checkPassword) {
            alert("Đằng ký thất bại (Mật khẩu không trùng khớp)");
            return;
        }
        try {
            setloading(true);
            await registerApi({
                Name: firstName + " " + secondName,
                Email: EmailRegister,
                PasswordHash: PasswordRegister,
            });
            router.push("/");
        } catch (err) {
            console.log(err);
            setloading(false);
            alert("Lỗi");
        } finally {
            setloading(false);
        }
    };
    // forgot
    const handleForgot = async () => {
        if (EmailForgot === "") {
            alert("Gửi mail thất bại (Không được để trống)");
            return;
        }
        try {
            setloading(true);
            const res = await forgotApi(EmailForgot);
            setResForgot(res.data.message);
        } catch (err) {
            console.log(err);
        } finally {
            setloading(false);
        }

        setTimeout(() => {
            setResForgot("");
        }, 6000);
    };

    useEffect(() => {
        if (isAccessTokenValid()) {
            router.push("/");
        }
    }, [router]);

    return (
        <>
            <div
                className={`login w-screen h-screen bg-cover bg-center flex justify-center items-center shadow-black box-border`}
            >
                <div
                    className={`login_form w-full max-w-md h-auto p-0 rounded-4xl border-solid border`}
                >
                    {login === "login" && (
                        // Login
                        <SignIn
                            EmailLogin={EmailLogin}
                            setEmailLogin={setEmailLogin}
                            showPassword={showPassword}
                            PasswordLogin={PasswordLogin}
                            setPasswordLogin={setPasswordLogin}
                            togglePasswordVisibility={togglePasswordVisibility}
                            setShowPassword={setShowPassword}
                            handleLogin={handleLogin}
                            setlogin={setlogin}
                        />
                    )}
                    {login === "register" && (
                        // Register
                        <CreateAccount
                            firstName={firstName}
                            setFirstName={setFirstName}
                            secondName={secondName}
                            setSecondName={setSecondName}
                            EmailRegister={EmailRegister}
                            setEmailRegister={setEmailRegister}
                            PasswordRegister={PasswordRegister}
                            setPasswordRegister={setPasswordRegister}
                            showPasswordRegister={showPasswordRegister}
                            setShowPasswordRegister={setShowPasswordRegister}
                            showPasswordRegisterCheck={
                                showPasswordRegisterCheck
                            }
                            setShowPasswordRegisterCheck={
                                setShowPasswordRegisterCheck
                            }
                            PasswordLogin={checkPassword}
                            setPasswordLogin={setCheckPassword}
                            togglePasswordVisibility={togglePasswordVisibility}
                            handleRegister={handleRegister}
                            setlogin={setlogin}
                        />
                    )}
                    {login === "forgot" && (
                        // forgot
                        <ForgotPassword
                            resForgot={resForgot}
                            EmailForgot={EmailForgot}
                            setEmailForgot={setEmailForgot}
                            handleForgot={handleForgot}
                            setlogin={setlogin}
                        />
                    )}
                </div>
            </div>

            {loading && <Loading />}
        </>
    );
};

export default login;
