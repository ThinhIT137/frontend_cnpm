"use client";

import { useRouter, useSearchParams } from "next/navigation";
import "../login/login.scss";
import { useEffect, useState } from "react";
import { togglePasswordVisibility } from "@/libs/hooks/togglePasswordVisibility";
import { ResetPassword } from "@/components/common/forms/auth/ResetPasswordForm";
import { resetPasswordApi } from "@/app/api/auth/resetPasswordApi";
import { Loading } from "@/components/common/LoadingComponent";
import { useAuth } from "@/context/AuthContext";
import { useLoading } from "@/context/LoadingContext";

const resetPasswordPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { setLoading } = useLoading();
    const { setAuth } = useAuth();

    const email = searchParams.get("email");
    const token = searchParams.get("token");
    const expiry = Number(searchParams.get("expiry"));

    const [Password, setPassword] = useState("");
    const [PasswordCheck, setPasswordCheck] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordCheck, setShowPasswordCheck] = useState(false);

    useEffect(() => {
        const time = Date.now();
        if (!expiry) {
            alert("Lỗi lấy thời gian");
            router.push("/login");
            return;
        }

        if (expiry < time) {
            alert("Quá thời gian đổi mật khẩu!");
            router.push("/login");
        }
    }, []);

    const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (Password !== PasswordCheck) {
            alert("Đổi mật khẩu thất bại (mật khẩu không khớp)");
            return;
        }

        try {
            setLoading(true);
            const res = await resetPasswordApi({
                Email: String(email),
                Password: Password,
                Token: String(token),
                Expired: new Date(),
            });
            setAuth(true);
            router.push("/");
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                className={`login w-screen h-screen bg-cover bg-center flex justify-center items-center shadow-black box-border`}
            >
                <div
                    className={`login_form w-full max-w-md h-auto p-0 rounded-4xl border-solid border`}
                >
                    <ResetPassword
                        showPassword={showPassword}
                        Password={Password}
                        setPassword={setPassword}
                        setPasswordCheck={setPasswordCheck}
                        togglePasswordVisibility={togglePasswordVisibility}
                        setShowPassword={setShowPassword}
                        showPasswordCheck={showPasswordCheck}
                        PasswordCheck={PasswordCheck}
                        setShowPasswordCheck={setShowPasswordCheck}
                        handleResetPassword={handleResetPassword}
                    />
                </div>
            </div>
        </>
    );
};

export default resetPasswordPage;
