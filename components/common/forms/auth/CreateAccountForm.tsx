import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faLock,
    faLockOpen,
    faEnvelope,
    faUser,
} from "@fortawesome/free-solid-svg-icons";
import { CreateAccountProps } from "@/types/AuthProps/CreateAccountProps";

export const CreateAccount = ({
    firstName,
    setFirstName,
    secondName,
    setSecondName,
    EmailRegister,
    setEmailRegister,
    PasswordRegister,
    setPasswordRegister,
    showPasswordRegister,
    setShowPasswordRegister,
    showPasswordRegisterCheck,
    setShowPasswordRegisterCheck,
    PasswordLogin,
    setPasswordLogin,
    togglePasswordVisibility,
    handleRegister,
    setlogin,
}: CreateAccountProps) => {
    return (
        <>
            <div className={`pt-4 pl-4`}>
                <span className="text-2xl">Tạo Tài Khoản Mới</span>
            </div>
            <form
                className="w-full p-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                }}
            >
                <div className="w-full flex pb-1">
                    <div className="pr-1 relative">
                        <input
                            className="peer w-full border border-gray-300 rounded-lg pl-3 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            type="text"
                            placeholder=" "
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                        >
                            <FontAwesomeIcon icon={faUser} />
                            <span className="pl-1">Họ</span>
                        </label>
                    </div>
                    <div className="relative">
                        <input
                            className="peer w-full border border-gray-300 rounded-lg pl-3 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                            type="text"
                            placeholder=" "
                            value={secondName}
                            onChange={(e) => setSecondName(e.target.value)}
                        />
                        <label
                            htmlFor="password"
                            className={`absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                        >
                            <FontAwesomeIcon icon={faUser} />
                            <span className="pl-1">Tên</span>
                        </label>
                    </div>
                </div>
                <div className="relative w-full">
                    <input
                        className="peer w-full border border-gray-300 rounded-lg pl-3 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        type="text"
                        placeholder=" "
                        value={EmailRegister}
                        onChange={(e) => setEmailRegister(e.target.value)}
                    />
                    <label
                        htmlFor="password"
                        className={`absolute left-3 top-1 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-1 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                    >
                        <FontAwesomeIcon icon={faEnvelope} />
                        <span className="pl-1">Email</span>
                    </label>
                </div>
                <div className="relative w-full max-w-md pt-1">
                    <input
                        type={showPasswordRegister ? "text" : "password"}
                        placeholder=" "
                        value={PasswordRegister}
                        onChange={(e) => setPasswordRegister(e.target.value)}
                        className="peer w-full border border-gray-300 rounded-lg pl-10 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <FontAwesomeIcon
                        onClick={() =>
                            togglePasswordVisibility(setShowPasswordRegister)
                        }
                        icon={showPasswordRegister ? faLockOpen : faLock}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 peer-focus:text-blue-500 transition-colors"
                    />
                    <label
                        htmlFor="password"
                        className={`absolute left-10 top-2 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                    >
                        Mật khẩu
                    </label>
                </div>
                <div className="relative w-full max-w-md pt-1">
                    <input
                        type={showPasswordRegisterCheck ? "text" : "password"}
                        placeholder=" "
                        value={PasswordLogin}
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        className="peer w-full border border-gray-300 rounded-lg pl-10 pr-4 pt-5 pb-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <FontAwesomeIcon
                        onClick={() =>
                            togglePasswordVisibility(
                                setShowPasswordRegisterCheck,
                            )
                        }
                        icon={showPasswordRegisterCheck ? faLockOpen : faLock}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 peer-focus:text-blue-500 transition-colors"
                    />
                    <label
                        htmlFor="password"
                        className={`absolute left-10 top-2 text-gray-300 text-sm transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500 pointer-events-none`}
                    >
                        Xác nhận mật khẩu
                    </label>
                    {PasswordRegister !== PasswordLogin && (
                        <div className={`absolute right-2 top-4 text-red-500`}>
                            !
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <button
                        className="pl-8 pr-8 pt-2 pb-2 rounded-4xl border-solid border hover:bg-blue-200 hover:text-black mr-2"
                        type="submit"
                    >
                        Đăng ký
                    </button>
                    <button
                        className="pl-8 pr-8 pt-2 pb-2 rounded-4xl border-solid border hover:bg-blue-200 hover:text-black"
                        onClick={() => {
                            setlogin("login");
                        }}
                    >
                        Đã có tài khoản
                    </button>
                </div>
            </form>
        </>
    );
};
